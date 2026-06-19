"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
  seed,
}: {
  name?: string | null;
  src?: string | null;
  className?: string;
  seed?: string;
}) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // deterministic hue from seed/name
  const key = seed || name || "x";
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 360;

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={name ?? "avatar"}
          className="h-full w-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(${h} 80% 55%), hsl(${
            (h + 50) % 360
          } 80% 50%))`,
        }}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
