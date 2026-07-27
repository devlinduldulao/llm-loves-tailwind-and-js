import { useState } from "react";
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

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-mint">
        {kicker}
      </p>
      <h2 className="mb-10 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-white/50">
        {label}
      </div>
      <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-white/80">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

function App() {
  const [showCode, setShowCode] = useState(false);
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("primary");
  const [size, setSize] = useState<(typeof SIZES)[number]>("md");

  const generatedClasses = buttonVariants({ variant, size });

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-4 inline-block rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-mint">
            Live demo
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Why LLMs & JS frameworks{" "}
            <span className="text-mint">love Tailwind CSS</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            The methodology wars are over, and the machines voted. Below: the same
            UI built the "semantic" way vs. the Tailwind way — the difference is
            what a human <em>and</em> a next-token predictor have to reason about.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setShowCode((s) => !s)}>
              {showCode ? "Hide the code" : "Show me the code"}
            </Button>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Tailwind docs ↗
            </a>
          </div>
        </div>
      </header>

      {/* Demo 1 — same card, two ways */}
      <Section kicker="Demo 1" title="Same card. Two files vs. one span.">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="rounded bg-coral/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-coral">
                Semantic CSS
              </span>
              <span className="text-xs text-white/50">
                2 files · invented names · cascade
              </span>
            </div>
            <PricingCardSemantic name="Pro" price="$29" features={FEATURES} featured />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="rounded bg-mint/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-mint">
                Tailwind
              </span>
              <span className="text-xs text-white/50">
                1 file · 0 names · 0 config
              </span>
            </div>
            <PricingCardTailwind name="Pro" price="$29" features={FEATURES} featured />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          Pixel-identical output. Now look at what produced it —
          <button
            className="ml-1 font-bold text-mint underline underline-offset-4"
            onClick={() => setShowCode((s) => !s)}
          >
            {showCode ? "hide source" : "show source"}
          </button>
        </p>

        {showCode && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <CodeBlock code={semanticTsx} label="PricingCard.semantic.tsx" />
              <CodeBlock code={semanticCss} label="PricingCard.semantic.css" />
            </div>
            <CodeBlock code={tailwindTsx} label="PricingCard.tailwind.tsx  (that's it)" />
          </div>
        )}
      </Section>

      {/* Demo 2 — typed variants with cva */}
      <Section kicker="Demo 2" title="Typed variants: TypeScript ♥ Tailwind">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-ink-soft p-8">
            <div className="flex min-h-40 items-center justify-center rounded-xl bg-black/30 p-8">
              <Button variant={variant} size={size}>
                {variant} · {size}
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                Variant
                <select
                  value={variant}
                  onChange={(e) =>
                    setVariant(e.target.value as (typeof VARIANTS)[number])
                  }
                  className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
                >
                  {VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                Size
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as (typeof SIZES)[number])}
                  className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6">
              <p className="mb-2 font-mono text-xs text-white/40">
                buttonVariants({"{"} variant, size {"}"}) →
              </p>
              <code className="block rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed text-mint">
                {generatedClasses}
              </code>
            </div>
          </div>

          <div className="space-y-4 text-white/70">
            <p>
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-mint">
                cva
              </code>{" "}
              turns a closed set of utilities into a{" "}
              <strong className="text-white">typed contract</strong>. Every
              variant above is autocompleted and type-checked. A wrong value is a
              red squiggle at compile time.
            </p>
            <p>
              Same idea at two layers: a{" "}
              <strong className="text-white">constrained, named vocabulary</strong>{" "}
              that catches mistakes early. TypeScript does it for values; Tailwind
              does it for styles. An LLM reads the entire contract in one span and
              edits exactly one place.
            </p>
            <p className="rounded-xl border border-mint/20 bg-mint/5 p-4 text-sm text-white/80">
              <strong className="text-mint">Try it live:</strong> ask your LLM to
              "add a <code className="font-mono">success</code> variant" or "make{" "}
              <code className="font-mono">lg</code> full-width on mobile." Watch it
              touch one file and nothing else.
            </p>
          </div>
        </div>
      </Section>

      {/* Demo 3 — the LLM iterates on one file */}
      <Section kicker="Demo 3" title="Watch it edit one file">
        <p className="mb-8 max-w-3xl text-white/70">
          Ask an LLM to grow the component. Every edit lands inside{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-mint">button.tsx</code>
          . No cascade to chase, no stylesheet to hunt down. Local edit = safe edit.
        </p>
        <LlmIterationDemo />
      </Section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/40">
        Companion demo · "Why LLMs & JS Frameworks Love Tailwind CSS" · built with
        Vite + React + TS + Tailwind v4
      </footer>
    </div>
  );
}

export default App;
