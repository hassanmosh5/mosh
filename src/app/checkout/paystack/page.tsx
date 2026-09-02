import Link from "next/link";

export default async function PaystackCheckoutResult({
  searchParams,
}: PageProps<"/checkout/paystack">) {
  const params = await searchParams;
  const reference = typeof params.reference === "string" ? params.reference : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-20">
      <div className="w-full rounded-2xl border border-black/10 p-8 dark:border-white/15">
        <span className="text-sm font-medium uppercase tracking-wide">MOSH Digital Studios</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Payment received</h1>
        <p className="mt-4 text-black/70 dark:text-white/70">
          Paystack has returned you to MOSH. We are confirming the transaction and the download link will be sent to the email address you entered at checkout.
        </p>
        {reference ? (
          <p className="mt-4 break-all text-xs text-black/50 dark:text-white/50">
            Reference: {reference}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">
          If the email does not arrive, check spam first. If it is still missing, contact support and include the payment reference above.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/products" className="rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
            Browse more tools
          </Link>
          <a href="mailto:hassanmosh5@gmail.com" className="rounded-lg border border-black/15 px-4 py-3 text-sm font-semibold dark:border-white/20">
            Contact support
          </a>
        </div>
      </div>
    </main>
  );
}
