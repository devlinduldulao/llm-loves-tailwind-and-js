import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/**
 * Demo 3 — "watch it edit ONE file".
 *
 * A DETERMINISTIC replay of the edits an LLM makes when you ask it to extend a
 * component. Each prompt appends a green diff to button.tsx AND unlocks the real
 * capability in the live preview below. Nothing here calls a model at runtime —
 * it's curated so it behaves identically every time you run it on stage. (To do
 * it for real, run the same prompts against ui/button.tsx in your editor with
 * Cursor/Claude; this panel is the reliable backup.)
 *
 * The point the audience should feel: every edit lands inside THIS one file.
 * No cascade to chase, no stylesheet to hunt. Local edit = safe edit.
 */

// The button AFTER all three edits — the preview uses it, gated by `unlocked`.
const iteratedButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-mint text-ink hover:bg-mint/80",
        destructive: "bg-coral text-ink hover:bg-coral/80",
        success: "bg-emerald-500 text-ink hover:bg-emerald-500/80",
      },
      size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4", lg: "h-12 px-6 text-base" },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type IterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iteratedButton> & { loading?: boolean };

function IterButton({ className, variant, size, fullWidth, loading, children, ...props }: IterButtonProps) {
  return (
    <button
      className={cn(iteratedButton({ variant, size, fullWidth }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

type Step = {
  prompt: string;
  intent: string; // the comment line shown above the diff
  added: string[]; // the "+" lines streamed into button.tsx
};

const STEPS: Step[] = [
  {
    prompt: "Add a success variant (green).",
    intent: "// add a success variant",
    added: ['success: "bg-emerald-500 text-ink hover:bg-emerald-500/80",'],
  },
  {
    prompt: "Add a loading state with a spinner.",
    intent: "// add a loading state",
    added: ["loading?: boolean", "disabled={loading}", "{loading && <Spinner className=\"animate-spin\" />}"],
  },
  {
    prompt: "Add a fullWidth prop.",
    intent: "// add a fullWidth prop",
    added: ["fullWidth: { true: \"w-full\" },"],
  },
];

export function LlmIterationDemo() {
  const [applied, setApplied] = useState(0); // how many steps have been "sent"

  const send = () => setApplied((n) => Math.min(n + 1, STEPS.length));
  const reset = () => setApplied(0);
  const nextPrompt = STEPS[applied]?.prompt;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      {/* Left — prompts + live preview */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-ink-soft p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">
            ① Prompt the model
          </p>
          <div className="space-y-2">
            {STEPS.map((step, i) => {
              const sent = i < applied;
              const isNext = i === applied;
              return (
                <div
                  key={step.prompt}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                    sent && "border-mint/30 bg-mint/5 text-white/60",
                    isNext && "border-white/20 bg-white/5 text-white",
                    !sent && !isNext && "border-white/5 text-white/30",
                  )}
                >
                  <span className={cn("font-mono text-xs", sent ? "text-mint" : "text-white/30")}>
                    {sent ? "✓" : i + 1}
                  </span>
                  <span className="flex-1">{step.prompt}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3">
            <IterButton onClick={send} disabled={applied >= STEPS.length}>
              {nextPrompt ? "Send prompt →" : "All applied ✓"}
            </IterButton>
            <IterButton variant="destructive" onClick={reset} className="bg-white/10 text-white hover:bg-white/20">
              Reset
            </IterButton>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-soft p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">
            Live component
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <IterButton>Primary</IterButton>
            <IterButton variant="destructive">Delete</IterButton>
            {applied >= 1 && <IterButton variant="success" className="line-in">Saved</IterButton>}
            {applied >= 2 && (
              <IterButton loading className="line-in">
                Saving
              </IterButton>
            )}
          </div>
          {applied >= 3 && (
            <div className="mt-3 line-in">
              <IterButton variant="success" fullWidth>
                Full-width CTA
              </IterButton>
            </div>
          )}
          {applied === 0 && (
            <p className="mt-3 text-sm text-white/40">Send a prompt to grow the component ↑</p>
          )}
        </div>
      </div>

      {/* Right — the diff feed */}
      <div className="rounded-2xl border border-white/10 bg-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wider text-white/40">
            ② The edits
          </p>
          <span className="flex items-center gap-2 font-mono text-xs text-mint">
            <span className="inline-block size-2 rounded-full bg-mint" />
            {applied > 0 ? "1 file changed · button.tsx" : "button.tsx"}
          </span>
        </div>

        <div className="min-h-72 space-y-4 p-5 font-mono text-xs leading-relaxed">
          {applied === 0 && (
            <p className="text-white/30">No edits yet — send a prompt on the left.</p>
          )}
          {STEPS.slice(0, applied).map((step, i) => (
            <div key={step.prompt} className="line-in">
              <p className="text-white/40">{step.intent}</p>
              {step.added.map((line) => (
                <p key={line} className="text-emerald-400">
                  <span className="mr-2 select-none text-emerald-500/60">+</span>
                  {line}
                </p>
              ))}
              {i < applied - 1 && <div className="mt-3 border-b border-white/5" />}
            </div>
          ))}
        </div>

        {applied === STEPS.length && (
          <div className="border-t border-white/10 px-5 py-3 text-xs text-white/60">
            3 prompts · 5 lines added · <span className="text-mint">0 other files touched</span>
          </div>
        )}
      </div>
    </div>
  );
}
