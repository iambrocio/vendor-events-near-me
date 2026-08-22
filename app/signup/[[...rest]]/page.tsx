import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "../../auth-ui";

export const metadata: Metadata = {
  title: "Create your account · Vendor Events Near Me",
  robots: { index: false, follow: false },
};

// Catch-all for the same reason as /signin — see the note there.
export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp />
    </AuthShell>
  );
}
