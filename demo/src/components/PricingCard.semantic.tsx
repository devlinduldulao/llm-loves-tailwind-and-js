import "./PricingCard.semantic.css";

type PricingCardProps = {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
};

// The markup is clean and "semantic" — but it is ALSO a pile of indirection.
// Every className is a promise that some rule exists in the .css file. To review,
// modify, or reason about this component, you must open and hold BOTH files.
export function PricingCardSemantic({
  name,
  price,
  features,
  featured = false,
}: PricingCardProps) {
  return (
    <div className={`pricing-card${featured ? " pricing-card--featured" : ""}`}>
      {featured && <span className="pricing-card__badge">Most popular</span>}
      <h3 className="pricing-card__name">{name}</h3>
      <p className="pricing-card__price">
        {price}
        <span className="pricing-card__price-suffix">/mo</span>
      </p>
      <ul className="pricing-card__features">
        {features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <svg
              className="pricing-card__check"
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
      <button type="button" className="pricing-card__cta">
        Choose {name}
      </button>
    </div>
  );
}
