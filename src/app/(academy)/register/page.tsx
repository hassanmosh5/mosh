import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Start turning AI tools into income.
        </p>
      </div>
      <RegisterForm />
      <p className="text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
