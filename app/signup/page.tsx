import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, Field } from "../auth-ui";

export const metadata: Metadata = {
  title: "Create your account · Vendor Events Near Me",
  robots: { index: false, follow: false },
};

export default function SignUp() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="First market is free to list. Takes about two minutes."
      footer={
        <>
          <span className="text-center text-[13px] leading-[1.45] text-sage">
            By creating an account you agree to our{" "}
            <Link href="/">terms</Link> and <Link href="/">privacy policy</Link>.
          </span>
          <div className="border-t border-hairline pt-4 text-center">
            <span className="text-[15px] text-sage">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold">
                Sign in
              </Link>
            </span>
          </div>
        </>
      }
    >
      <Field
        label="Your name"
        type="text"
        placeholder="Ada Vinh"
        autoComplete="name"
      />
      <Field
        label="Email"
        type="email"
        placeholder="you@yourmarket.org"
        autoComplete="email"
      />
      <Field
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
      <button
        type="submit"
        className="mt-1 rounded-[9px] bg-clay py-[15px] font-sans text-base font-semibold text-white transition-colors hover:bg-clay-dark"
      >
        Create account
      </button>
    </AuthShell>
  );
}
