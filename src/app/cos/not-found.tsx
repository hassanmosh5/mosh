import Link from "next/link";

export default function CosNotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-line bg-surface p-6 text-center">
      <h1 className="text-lg font-semibold text-ink">Not found</h1>
      <p className="mt-2 text-sm text-ink-muted">
        That record does not exist, or it belongs to a different workspace.
      </p>
      <Link
        href="/cos"
        className="mt-4 inline-flex items-center rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink hover:bg-surface-2"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
