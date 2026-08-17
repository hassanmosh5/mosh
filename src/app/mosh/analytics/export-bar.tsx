"use client";

import { Download, FileText } from "lucide-react";
import { downloadExport } from "@/lib/mosh/client";
import { buttonClass } from "@/components/mosh/ui";

const DATASETS = [
  { key: "daily", label: "Daily tracker" },
  { key: "weekly", label: "Weekly goals" },
  { key: "monthly", label: "Monthly reviews" },
  { key: "business", label: "Business" },
  { key: "funnel", label: "Funnel" },
  { key: "eclipse", label: "50-Day Eclipse" },
  { key: "annual", label: "Master plan" },
] as const;

/**
 * Exports.
 *
 * CSV is the machine copy, PDF the human one, and the year report is every
 * module in a single document. All three are generated on request from live
 * records, so an export is never stale.
 */
export function ExportBar() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
          Download a dataset
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-sm">
            <caption className="sr-only">Available exports by dataset and format</caption>
            <tbody>
              {DATASETS.map((dataset) => (
                <tr key={dataset.key} className="border-b border-mosh-line last:border-0">
                  <td className="py-2.5 pr-3 text-mosh-ink">{dataset.label}</td>
                  <td className="py-2.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          downloadExport(`/api/mosh/export?dataset=${dataset.key}&format=csv`)
                        }
                        className={buttonClass("secondary", "sm")}
                      >
                        <Download size={13} aria-hidden />
                        CSV
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          downloadExport(`/api/mosh/export?dataset=${dataset.key}&format=pdf`)
                        }
                        className={buttonClass("secondary", "sm")}
                      >
                        <FileText size={13} aria-hidden />
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        type="button"
        onClick={() => downloadExport("/api/mosh/export/year")}
        className={buttonClass("primary")}
      >
        <FileText size={15} aria-hidden />
        Download the full year report (PDF)
      </button>
    </div>
  );
}
