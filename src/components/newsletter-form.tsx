"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { subscribe } from "@/app/actions/subscribe";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(subscribe, undefined);

  if (state?.success) {
    return (
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "aq-chip inline-flex items-center gap-2 text-sm font-medium text-success",
          className
        )}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> You&apos;re on the list — check your inbox.
      </p>
    );
  }

  return (
    <form action={action} className={cn("w-full max-w-sm", className)}>
      <div className="group flex items-center gap-2 rounded-2xl border border-border bg-background/80 p-1.5 shadow-[0_1px_2px_rgba(24,35,56,0.06)] transition-shadow focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(37,96,230,0.18)]">
        <input
          type="email"
          name="email"
          required
          placeholder="you@team.org"
          aria-label="Email address"
          className="h-11 flex-1 bg-transparent px-2.5 text-base outline-none placeholder:text-muted-foreground sm:h-9 sm:text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="aq-cta inline-flex h-11 items-center gap-1.5 px-3.5 text-sm font-semibold disabled:opacity-60 sm:h-9"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Submitting</span>
            </>
          ) : (
            <>
              Join{" "}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
      {state?.error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
