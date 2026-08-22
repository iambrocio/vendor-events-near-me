import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "../../auth-ui";

export const metadata: Metadata = {
  title: "Sign in · Vendor Events Near Me",
  robots: { index: false, follow: false },
};

/**
 * Catch-all route on purpose: Clerk drives its multi-step flows (password
 * reset, email verification, SSO callback) as sub-paths of /signin, and the
 * Next adapter throws at runtime if the segment isn't optional-catch-all.
 * It also infers `path` routing from the pathname, so no `path` prop here.
 */
export default function SignInPage() {
  return (
    <AuthShell>
      <SignIn />
    </AuthShell>
  );
}
