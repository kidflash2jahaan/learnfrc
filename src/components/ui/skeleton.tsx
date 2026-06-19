import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted",
        "bg-[linear-gradient(100deg,transparent,color-mix(in_srgb,var(--muted-foreground)_12%,transparent),transparent)]",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}
