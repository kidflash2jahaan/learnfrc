import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variants = {
  // Compose the canonical Arena Clay CTA pill (gradient + soft clay shadow +
  // hover pop are all defined by .aq-cta) so system changes propagate here.
  primary: "aq-cta",
  // brand is an alias of primary — single source of truth via .aq-cta.
  brand: "aq-cta",
  // Compose the Arena Clay ghost-glass surface rather than reconstructing it.
  secondary: "aq-ghost hover:bg-white",
  outline:
    "border border-border bg-white/50 text-foreground hover:bg-white backdrop-blur hover:-translate-y-0.5",
  ghost:
    "text-foreground/85 hover:text-foreground hover:bg-primary/5",
  destructive:
    "bg-destructive text-destructive-foreground hover:brightness-[1.05] hover:-translate-y-0.5",
} as const;

const sizes = {
  // 44px tall on touch surfaces, shrink to 36px only on larger viewports.
  sm: "h-11 sm:h-9 px-4 text-sm gap-1.5 rounded-2xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-12 px-7 text-[0.95rem] gap-2 rounded-2xl",
  // 44x44 minimum touch target.
  icon: "h-11 w-11 rounded-2xl",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-semibold",
          "transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
