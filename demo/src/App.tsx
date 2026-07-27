import { useEffect, useRef, useState } from "react";
import { PricingCardSemantic } from "./components/PricingCard.semantic";
import { PricingCardTailwind } from "./components/PricingCard.tailwind";
import { Button, buttonVariants } from "./components/ui/button";
import { LlmIterationDemo } from "./components/LlmIterationDemo";
import { cn } from "./lib/cn";

// Real source, imported raw — the code you SEE is the code that RENDERS.
import semanticTsx from "./components/PricingCard.semantic.tsx?raw";
import semanticCss from "./components/PricingCard.semantic.css?raw";
import tailwindTsx from "./components/PricingCard.tailwind.tsx?raw";

const FEATURES = ["Unlimited projects", "Priority support", "LLM-friendly by design"];

const VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive"] as const;
const SIZES = ["sm", "md", "lg"] as const;

function scrollToId(id: string) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

const NAV_ITEMS = [
  { id: "demo-1", label: "Demo 1 · Files" },
  { id: "demo-2", label: "Demo 2 · Variants" },
  { id: "demo-3", label: "Demo 3 · Iterate" },
] as const;

/** Scroll-spy: highlights the nav item for the section currently in view. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const { id } of NAV_ITEMS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

function SiteNav() {
  const active = useActiveSection();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: prefersReducedMotion ? "auto" : "smooth",
            })
          }
          className="shrink-0 cursor-pointer rounded-md text-sm font-extrabold tracking-tight text-ink transition-colors hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        >
          LLMs <span className="text-mint">♥</span> Tailwind
        </button>
        <div className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollToId(id)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint sm:px-3 sm:text-sm",
                  isActive
                    ? "bg-mint-soft text-mint"
                    : "text-muted hover:bg-slate-100 hover:text-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Section({
  kicker,
  title,
  children,
  id,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-6 sm:py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-mint sm:text-sm">
        {kicker}
      </p>
      <h2 className="mb-3 max-w-2xl text-2xl font-extrabold tracking-tight text-ink sm:mb-4 sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 shadow-card">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2">
        <span className="font-mono text-[11px] font-medium text-slate-400">{label}</span>
        <span className="flex gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-slate-700" />
          <span className="size-2 rounded-full bg-slate-700" />
          <span className="size-2 rounded-full bg-slate-700" />
        </span>
      </div>
      <pre className="max-h-72 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </legend>
      <div
        className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-1",
                selected
                  ? "bg-surface text-ink shadow-sm ring-1 ring-border"
                  : "text-muted hover:bg-white/60 hover:text-ink",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function App() {
  const [showCode, setShowCode] = useState(false);
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("primary");
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");
  const codeRef = useRef<HTMLDivElement>(null);
  const pendingCodeScroll = useRef(false);

  const generatedClasses = buttonVariants({ variant, size });

  // Scroll once the code panel is actually mounted — requestAnimationFrame can
  // fire before React commits, silently dropping the scroll on stage.
  useEffect(() => {
    if (showCode && pendingCodeScroll.current) {
      pendingCodeScroll.current = false;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      codeRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [showCode]);

  const revealCode = () => {
    if (showCode) {
      codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    pendingCodeScroll.current = true;
    setShowCode(true);
  };

  const toggleCode = () => {
    if (showCode) {
      setShowCode(false);
      return;
    }
    revealCode();
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteNav />
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_15%_-10%,rgb(13_148_136/0.14),transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgb(225_29_72/0.06),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center rounded-full border border-mint/20 bg-mint-soft/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-mint">
              Live demo
            </p>
            <p className="text-xs text-muted">Talk companion · ~3 interactive demos</p>
          </div>
          <h1 className="mt-5 max-w-3xl text-[2.15rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Why LLMs & JS frameworks{" "}
            <span className="bg-gradient-to-r from-mint to-teal-600 bg-clip-text text-transparent">
              love Tailwind CSS
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Same UI, two approaches. See what a human — and a next-token predictor —
            has to hold in context when styles live next to markup.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => scrollToId("demo-1")}>
              Start the demos
            </Button>
            <Button size="lg" variant="outline" onClick={revealCode}>
              Show the source
            </Button>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-muted",
              )}
            >
              Tailwind docs ↗
            </a>
          </div>
        </div>
      </header>

      {/* Demo 1 — same card, two ways */}
      <Section
        id="demo-1"
        kicker="Demo 1"
        title="Same card. Two files vs. one span."
      >
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Pixel-identical components. The only difference is how many files you (or
          an LLM) must open to understand the look.
        </p>

        <div className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:grid-cols-2">
          <div className="flex flex-col items-center gap-5 border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex w-full max-w-xs flex-col items-center gap-1 text-center">
              <span className="rounded-md bg-coral-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-coral">
                Semantic CSS
              </span>
              <span className="text-xs text-muted">2 files · invented names · cascade</span>
            </div>
            <PricingCardSemantic name="Pro" price="$29" features={FEATURES} featured />
          </div>
          <div className="flex flex-col items-center gap-5 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex w-full max-w-xs flex-col items-center gap-1 text-center">
              <span className="rounded-md bg-mint-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-mint">
                Tailwind
              </span>
              <span className="text-xs text-muted">1 file · 0 names · 0 config</span>
            </div>
            <PricingCardTailwind name="Pro" price="$29" features={FEATURES} featured />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Same pixels. Different cost of change.
          </p>
          <Button variant="secondary" size="sm" onClick={toggleCode}>
            {showCode ? "Hide source" : "Compare source files"}
          </Button>
        </div>

        {showCode && (
          <div ref={codeRef} className="mt-6 scroll-mt-8 grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <CodeBlock code={semanticTsx} label="PricingCard.semantic.tsx" />
              <CodeBlock code={semanticCss} label="PricingCard.semantic.css" />
            </div>
            <CodeBlock code={tailwindTsx} label="PricingCard.tailwind.tsx  (that's it)" />
          </div>
        )}
      </Section>

      {/* Demo 2 — typed variants with cva */}
      <div className="border-y border-border bg-surface">
        <Section id="demo-2" kicker="Demo 2" title="Typed variants: TypeScript ♥ Tailwind">
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Flip variant and size. The class string updates from one typed contract —
            the same closed vocabulary an LLM can read and edit safely.
          </p>

          <div className="grid items-stretch gap-8 lg:grid-cols-5">
            <div className="flex flex-col rounded-2xl border border-border bg-canvas p-5 shadow-card sm:p-6 lg:col-span-3">
              <div className="flex min-h-36 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-surface p-8">
                <Button variant={variant} size={size} key={`${variant}-${size}`}>
                  {variant} · {size}
                </Button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ChipGroup
                  label="Variant"
                  value={variant}
                  options={VARIANTS}
                  onChange={setVariant}
                />
                <ChipGroup
                  label="Size"
                  value={size}
                  options={SIZES}
                  onChange={setSize}
                />
              </div>

              <div className="mt-5">
                <p className="mb-2 font-mono text-[11px] text-muted">
                  buttonVariants({"{"} variant, size {"}"}) →
                </p>
                <code className="block overflow-x-auto rounded-xl border border-border bg-surface p-3 font-mono text-[11px] leading-relaxed text-mint sm:text-xs">
                  {generatedClasses}
                </code>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4 text-sm leading-relaxed text-ink-soft sm:text-base lg:col-span-2">
              <p>
                <code className="rounded-md bg-mint-soft px-1.5 py-0.5 font-mono text-[13px] text-mint">
                  cva
                </code>{" "}
                turns utilities into a{" "}
                <strong className="font-semibold text-ink">typed contract</strong>.
                Wrong values are compile-time errors, not runtime surprises.
              </p>
              <p>
                TypeScript constrains values; Tailwind constrains styles. An LLM
                reads the whole contract in one span and edits exactly one place.
              </p>
              <p className="rounded-xl border border-mint/20 bg-mint-soft/50 p-4 text-sm text-ink-soft">
                <strong className="text-mint">Try it:</strong> ask an LLM to add a{" "}
                <code className="font-mono text-ink">success</code> variant or make{" "}
                <code className="font-mono text-ink">lg</code> full-width on mobile.
                One file changes — nothing else.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Demo 3 — the LLM iterates on one file */}
      <Section id="demo-3" kicker="Demo 3" title="Watch it edit one file">
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Grow the component step by step. Every edit lands inside{" "}
          <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-ink">
            button.tsx
          </code>
          . No cascade to chase. Local edit = safe edit.
        </p>
        <LlmIterationDemo />
      </Section>

      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-muted sm:text-sm">
        <p>
          Companion demo · &ldquo;Why LLMs & JS Frameworks Love Tailwind CSS&rdquo; ·
          Vite + React + TS + Tailwind v4
        </p>
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            })
          }
          className="mt-3 cursor-pointer rounded-md text-xs font-semibold text-mint transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        >
          ↑ Back to top
        </button>
      </footer>
    </div>
  );
}

export default App;
