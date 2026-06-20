import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ResendButton } from "@/components/auth/resend-button";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial-faded opacity-40" />
      <Reveal className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-lg)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-[var(--shadow-md)]">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Verify your email
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            We sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              "your inbox"
            )}
            . Click it to activate your account, then sign in.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Can&apos;t find it? Check your spam folder, or resend the link.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {email && <ResendButton email={email} />}
            <Button asChild variant="brand">
              <Link href="/login">Go to sign in</Link>
            </Button>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
