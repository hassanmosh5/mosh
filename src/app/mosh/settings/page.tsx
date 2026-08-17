import { requireMoshContext } from "@/lib/mosh/context";
import { getProfile } from "@/lib/mosh/services/profile";
import { isAiConfigured } from "@/lib/mosh/services/coach";
import { BRAND } from "@/lib/mosh/constants";
import { Card, PageHeader, Prose } from "@/components/mosh/ui";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const ctx = await requireMoshContext();
  const profile = await getProfile(ctx);

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="How the system speaks to you"
        description="Your name, your words, your currency. Everything else in MOSH is computed from what you record."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SettingsForm profile={profile} />
        </div>

        <div className="space-y-4">
          <Card title="The mission" description={`${BRAND.owner} — ${BRAND.title}`}>
            <ul className="space-y-2 text-sm leading-relaxed text-mosh-ink-muted">
              {BRAND.mission.map((line) => (
                <li key={line}>— {line}</li>
              ))}
            </ul>
          </Card>

          <Card title="The AI layer">
            <Prose>
              {isAiConfigured() ? (
                <p>
                  The model is configured. The Billionaire Self personalises its answers using only
                  the numbers you have recorded, and every response is labelled with the engine that
                  produced it.
                </p>
              ) : (
                <p>
                  No model key is set on this server, so The Billionaire Self answers from its
                  written playbook. Everything else in MOSH — every score, chart and export — is
                  deterministic and does not use AI at all.
                </p>
              )}
            </Prose>
          </Card>
        </div>
      </div>
    </>
  );
}
