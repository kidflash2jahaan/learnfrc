import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  reveal = false,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  reveal?: boolean;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "aq-card text-[var(--foreground)]",
        reveal && "aq-reveal",
        interactive && "aq-card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 pb-3 sm:p-6 sm:pb-3", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[15px] leading-relaxed text-muted-foreground sm:text-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0",
        className
      )}
      {...props}
    />
  );
}
