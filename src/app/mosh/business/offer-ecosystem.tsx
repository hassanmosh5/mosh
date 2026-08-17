"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { OFFER_TIERS, type OfferMetricKey } from "@/lib/mosh/constants";
import type { BusinessView, OfferView } from "@/lib/mosh/services/business";
import type { MoshOfferTier } from "@/generated/prisma/enums";
import {
  Badge,
  Card,
  EmptyState,
  Field,
  buttonClass,
  inputClass,
  labelClass,
} from "@/components/mosh/ui";

/**
 * The three-tier offer ecosystem.
 *
 * Metrics are entered one month at a time, per offer, and only the columns that
 * belong to a tier are asked for. Nothing is inferred: the Wealth Flow Index is
 * exactly as good as the numbers typed here, which is the discipline the module
 * is built to create.
 */

export function OfferEcosystem({
  business,
  month,
}: {
  business: BusinessView;
  month: string;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [addingTier, setAddingTier] = useState<MoshOfferTier | null>(null);

  const monthOptions = business.months.slice().reverse();

  return (
    <div className="space-y-4">
      <Card
        title="Reporting month"
        description="Metrics are reported per offer, per month. Pick the month you are filling in."
      >
        <div className="flex flex-wrap items-center gap-3">
          <label className={labelClass} htmlFor="metric-month">
            Month
          </label>
          <select
            id="metric-month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className={`${inputClass} max-w-xs`}
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {OFFER_TIERS.map((tier) => {
        const offers = business.offers.filter((offer) => offer.tier === tier.tier);
        const summary = business.tiers.find((entry) => entry.tier === tier.tier);

        return (
          <Card
            key={tier.tier}
            title={tier.label}
            description={tier.role}
            actions={
              <div className="flex items-center gap-2">
                <Badge tone="brand">× {tier.weight} in the index</Badge>
                <button
                  type="button"
                  onClick={() => setAddingTier(addingTier === tier.tier ? null : tier.tier)}
                  className={buttonClass("secondary", "sm")}
                >
                  <Plus size={14} aria-hidden />
                  Add offer
                </button>
              </div>
            }
          >
            {summary ? (
              <p className="mb-4 text-xs text-mosh-ink-muted">
                {summary.offers} offer{summary.offers === 1 ? "" : "s"} ·{" "}
                {business.currency} {Math.round(summary.revenue).toLocaleString()} revenue in the
                window · {summary.headcount.toLocaleString()} people
              </p>
            ) : null}

            {addingTier === tier.tier ? (
              <OfferForm
                tier={tier.tier}
                currency={business.currency}
                onDone={() => {
                  setAddingTier(null);
                  router.refresh();
                }}
                onError={(message) => toast(message, "error")}
                onSuccess={() => toast("Offer saved.")}
              />
            ) : null}

            {offers.length === 0 ? (
              <EmptyState
                title="No offer in this tier yet"
                description={tier.role}
                action={
                  <button
                    type="button"
                    onClick={() => setAddingTier(tier.tier)}
                    className={buttonClass("primary", "sm")}
                  >
                    <Plus size={14} aria-hidden />
                    Create it
                  </button>
                }
              />
            ) : (
              <ul className="space-y-4">
                {offers.map((offer) => (
                  <li key={offer.id}>
                    <OfferRow
                      offer={offer}
                      metricKeys={tier.metrics}
                      month={selectedMonth}
                      currency={business.currency}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function OfferForm({
  tier,
  currency,
  onDone,
  onError,
  onSuccess,
}: {
  tier: MoshOfferTier;
  currency: string;
  onDone: () => void;
  onError: (message: string) => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: "", promise: "", price: 0 } });

  const submit = handleSubmit(async (values) => {
    try {
      await api.post("/api/mosh/business/offers", {
        tier,
        name: values.name,
        promise: values.promise,
        price: Number(values.price) || 0,
        currency,
        active: true,
      });
      onSuccess();
      onDone();
    } catch (error) {
      onError(error instanceof ApiError ? error.message : "That did not save.");
    }
  });

  return (
    <form onSubmit={submit} className="mb-4 space-y-3 rounded-xl border border-mosh-line p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="Name" htmlFor={`name-${tier}`}>
          <input
            id={`name-${tier}`}
            className={inputClass}
            required
            {...register("name", { required: true })}
          />
        </Field>
        <Field label="Promise" htmlFor={`promise-${tier}`}>
          <input id={`promise-${tier}`} className={inputClass} {...register("promise")} />
        </Field>
        <Field label={`Price (${currency})`} htmlFor={`price-${tier}`}>
          <input
            id={`price-${tier}`}
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            {...register("price")}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className={buttonClass("ghost", "sm")}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "sm")}>
          {isSubmitting ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <Save size={14} aria-hidden />
          )}
          Save offer
        </button>
      </div>
    </form>
  );
}

function OfferRow({
  offer,
  metricKeys,
  month,
  currency,
}: {
  offer: OfferView;
  metricKeys: { key: OfferMetricKey; label: string; kind: "count" | "percent" | "money" }[];
  month: string;
  currency: string;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const existing = offer.metrics.find((metric) => metric.month === month);

  const defaults = Object.fromEntries(
    metricKeys.map((metric) => [
      metric.key,
      existing ? ((existing[metric.key] as number | null) ?? "") : "",
    ])
  ) as Record<OfferMetricKey, number | "">;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });

  const submit = handleSubmit(async (values) => {
    try {
      const numeric = (key: OfferMetricKey) => {
        const value = values[key];
        return value === "" || value === undefined ? null : Number(value);
      };

      await api.post("/api/mosh/business/metrics", {
        offerId: offer.id,
        month,
        revenue: numeric("revenue") ?? 0,
        leads: numeric("leads") ?? 0,
        conversions: numeric("conversions") ?? 0,
        subscribers: numeric("subscribers") ?? 0,
        downloads: numeric("downloads") ?? 0,
        students: numeric("students") ?? 0,
        satisfaction: numeric("satisfaction"),
        completionRate: numeric("completionRate"),
        clients: numeric("clients") ?? 0,
        retention: numeric("retention"),
        transformation: numeric("transformation"),
      });
      toast(`${offer.name} updated for ${month}.`);
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    }
  });

  const remove = async () => {
    try {
      await api.delete(`/api/mosh/business/offers?id=${offer.id}`);
      toast("Offer removed.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not delete.", "error");
    }
  };

  return (
    <div className="rounded-xl border border-mosh-line p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-mosh-ink">{offer.name}</h3>
          {offer.promise ? (
            <p className="mt-0.5 text-xs leading-relaxed text-mosh-ink-muted">{offer.promise}</p>
          ) : null}
          <p className="mt-1 text-xs text-mosh-ink-subtle">
            {currency} {offer.price.toLocaleString()} · {currency}{" "}
            {Math.round(offer.totals.revenue).toLocaleString()} earned in the window
            {offer.totals.conversionRate !== null
              ? ` · ${offer.totals.conversionRate}% lead conversion`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={remove}
          aria-label={`Delete ${offer.name}`}
          className={buttonClass("danger", "sm")}
        >
          <Trash2 size={14} aria-hidden />
        </button>
      </div>

      <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {metricKeys.map((metric) => (
            <Field
              key={metric.key}
              label={metric.kind === "money" ? `${metric.label} (${currency})` : metric.label}
              htmlFor={`${offer.id}-${metric.key}`}
            >
              <input
                id={`${offer.id}-${metric.key}`}
                type="number"
                min={0}
                max={metric.kind === "percent" ? 100 : undefined}
                step={metric.kind === "money" ? "0.01" : "1"}
                className={inputClass}
                {...register(metric.key)}
              />
            </Field>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-mosh-ink-subtle">
            {existing ? `Reported for ${month}.` : `Nothing reported for ${month} yet.`}
          </p>
          <button type="submit" disabled={isSubmitting} className={buttonClass("secondary", "sm")}>
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Save size={14} aria-hidden />
            )}
            Save month
          </button>
        </div>
      </form>
    </div>
  );
}
