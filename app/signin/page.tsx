import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, Field } from "../auth-ui";

export const metadata: Metadata = {
  title: "Sign in · Vendor Events Near Me",
};

export default function SignIn() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your listings."
      footer={
        <>
          <span className="text-center text-[13px] leading-[1.45] text-sage">
            Trouble getting in? <Link href="/">Email us</Link> and a person
            answers.
          </span>
          <div className="border-t border-hairline pt-4 text-center">
            <span className="text-[15px] text-sage">
              New here?{" "}
              <Link href="/signup" className="font-semibold">
                Create an account
              </Link>
            </span>
          </div>
        </>
      }
    >
      <Field
        label="Email"
        type="email"
        placeholder="you@yourmarket.org"
        autoComplete="email"
      />
      <Field
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        action={
          <Link href="/" className="text-[13px] font-semibold">
            Forgot?
          </Link>
        }
      />
      <button
        type="submit"
        className="mt-1 rounded-[9px] bg-market-green py-[15px] font-sans text-base font-semibold text-white transition-colors hover:bg-market-green-dark"
      >
        Sign in
      </button>
    </AuthShell>
  );
}
