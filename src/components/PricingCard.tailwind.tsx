import { cn } from "@/lib/utils";

type PricingCardProps = {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
};

// The EXACT same card — but there is only one file, and no invented names.
// Everything about how this looks is right here, co-located with the markup.
//   - No naming decisions.        - No cascade / spooky action at a distance.
//   - Values come from the scale. - An LLM sees the whole spec in one span.
// This is the single biggest reason models generate Tailwind more accurately:
// the context it needs is never in another file it might not have read.
export function PricingCardTailwind({
  name,
  price,
  features,
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-80 flex-col rounded-2xl border border-border bg-card p-6 text-foreground shadow-card sm:p-7",
        featured &&
          "border-foreground shadow-[0_0_0_1px_var(--foreground),0_12px_28px_rgb(15_23_42/0.12)]",
      )}
    >
      {featured && (
        <span className="mb-4 self-start rounded-full bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
          Most popular
        </span>
      )}
      <h3 className="text-[15px] font-semibold text-muted-foreground">{name}</h3>
      <p className="mt-1.5 text-4xl font-extrabold leading-none tracking-tight">
        {price}
        <span className="text-[15px] font-medium text-muted-foreground">/mo</span>
      </p>
      <ul className="my-5 flex flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 text-sm text-foreground/80"
          >
            <svg
              className="shrink-0 text-foreground"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cn(
          "mt-auto cursor-pointer rounded-4xl px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          featured
            ? "bg-primary text-primary-foreground hover:bg-primary/80"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        )}
      >
        Choose {name}
      </button>
    </div>
  );
}
