"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { resendConfirmation } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function ResendButton({ email }: { email: string }) {
  const [pending, start] = React.useTransition();
  const [sent, setSent] = React.useState(false);

  const onClick = () => {
    start(async () => {
      const r = await resendConfirmation(email);
      if (r?.error) toast.error(r.error);
      else {
        setSent(true);
        toast.success("Verification email re-sent.");
      }
    });
  };

  return (
    <Button variant="outline" onClick={onClick} disabled={pending || sent}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {sent ? "Email sent" : "Resend email"}
    </Button>
  );
}
