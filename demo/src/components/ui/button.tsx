import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * A shadcn/ui-style Button: live proof of the talk's thesis.
 *
 * `cva` (class-variance-authority) turns a closed set of Tailwind utilities into
 * a typed contract. The variants below are:
 *   - autocompleted in your editor,
 *   - type-checked at compile time (a bad variant is a red squiggle),
 *   - and readable in ONE span by both a teammate and an LLM.
 *
 * TypeScript and Tailwind are the same philosophy at two layers: a constrained,
 * named vocabulary that catches mistakes early. Ask an LLM to "add a `success`
 * variant" and it edits exactly one place, because everything lives here.
 */
export const buttonVariants = cva(
  // base classes — always applied
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-mint text-white shadow-sm hover:bg-mint/90 hover:shadow",
        secondary:
          "bg-slate-100 text-ink hover:bg-slate-200",
        outline:
          "border border-border bg-surface text-ink shadow-sm hover:bg-slate-50 hover:border-slate-300",
        ghost: "text-ink-soft hover:bg-slate-100 hover:text-ink",
        destructive:
          "bg-coral text-white shadow-sm hover:bg-coral/90",
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
