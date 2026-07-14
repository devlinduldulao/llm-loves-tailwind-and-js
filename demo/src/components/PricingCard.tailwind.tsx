import { cn } from "../lib/cn";

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
        "flex w-80 flex-col rounded-2xl border border-white/10 bg-ink-soft p-7 text-white",
        featured && "border-mint shadow-[0_0_0_1px_theme(colors.mint)]",
      )}
    >
      {featured && (
        <span className="mb-4 self-start rounded-full bg-mint/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-mint">
          Most popular
        </span>
      )}
      <h3 className="text-[15px] font-semibold text-white/70">{name}</h3>
      <p className="mt-1.5 text-4xl font-extrabold leading-none">
        {price}
        <span className="text-[15px] font-medium text-white/50">/mo</span>
      </p>
      <ul className="my-5 flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-white/85">
            <svg
              className="shrink-0 text-mint"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={cn(
          "mt-auto cursor-pointer rounded-lg px-4 py-3 text-sm font-bold transition-colors",
          featured
            ? "bg-mint text-ink hover:bg-mint/80"
            : "bg-white text-ink hover:bg-white/85",
        )}
      >
        Choose {name}
      </button>
    </div>
  );
}
