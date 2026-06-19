"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-6xl font-bold text-gradient">Oops</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button variant="brand" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
