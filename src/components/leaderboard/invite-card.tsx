"use client";

import * as React from "react";
import { UserPlus, Copy, Check } from "lucide-react";
import { ShareButton } from "@/components/share-button";

export function InviteCard({
  username,
  count,
}: {
  username: string;
  count: number;
}) {
  const link = `https://learnfrc.systemerr.com/signup?ref=${username}`;
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-primary">
          <UserPlus className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-sm font-semibold">Invite & climb the Recruiters board</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        You&apos;ve referred{" "}
        <span className="font-semibold text-foreground">{count}</span>{" "}
        {count === 1 ? "person" : "people"} so far. Share your link — everyone who
        joins through it counts toward your spot on the Top Recruiters board.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="truncate font-mono text-xs text-muted-foreground">
            {link}
          </span>
          <button
            onClick={copy}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <ShareButton
          variant="brand"
          label="Share invite"
          text="Learn every part of FRC, free — join me on LearnFRC:"
          url={link}
        />
      </div>
    </div>
  );
}
