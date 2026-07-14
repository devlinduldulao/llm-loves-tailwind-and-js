import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * A shadcn/ui-style Button — the most-copied component pattern on the internet,
 * and a live proof of the talk's thesis.
 *
 * `cva` (class-variance-authority) turns a closed set of Tailwind utilities into
 * a TYPED contract. The variants below are:
 *   - autocompleted in your editor,
 *   - type-checked at compile time (a bad variant is a red squiggle, not a bug),
 *   - and readable in ONE span by both a teammate and an LLM.
 *
 * TypeScript and Tailwind are the same philosophy at two layers: a constrained,
 * named vocabulary that catches mistakes early. Ask an LLM to "add a `success`
 * variant" and it edits exactly one place — because everything lives here.
 */
export const buttonVariants = cva(
  // base classes — always applied
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-mint text-ink hover:bg-mint/80",
        secondary: "bg-white/10 text-white hover:bg-white/20",
        outline: "border border-white/20 text-white hover:bg-white/10",
        ghost: "text-white/80 hover:bg-white/10 hover:text-white",
        destructive: "bg-coral text-ink hover:bg-coral/80",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
