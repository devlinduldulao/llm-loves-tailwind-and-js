import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

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
// Standalone cva button for the iteration demo (intentionally local — the talk
// point is that edits land in one file). Maia-soft rounding matches the system.
const iteratedButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-4xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-600/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    added: ['success: "bg-emerald-600 text-white hover:bg-emerald-600/90",'],
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
  const done = applied >= STEPS.length;
  const nextPrompt = STEPS[applied]?.prompt;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Left — prompts + live preview */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ① Prompt the model
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {applied}/{STEPS.length}
            </p>
          </div>

          <ol className="space-y-2">
            {STEPS.map((step, i) => {
              const sent = i < applied;
              const isNext = i === applied;
              return (
                <li key={step.prompt}>
                  <button
                    type="button"
                    disabled={!isNext}
                    onClick={isNext ? send : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition-all",
                      sent && "border-border bg-muted/60 text-muted-foreground",
                      isNext &&
                        "cursor-pointer border-foreground/30 bg-muted text-foreground shadow-sm ring-2 ring-ring/20 hover:border-foreground/50 hover:bg-muted/80",
                      !sent && !isNext && "cursor-default border-border/80 text-muted-foreground/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold",
                        sent && "bg-primary text-primary-foreground",
                        isNext && "bg-foreground text-background",
                        !sent && !isNext && "bg-muted text-muted-foreground",
                      )}
                      aria-hidden
                    >
                      {sent ? "✓" : i + 1}
                    </span>
                    <span className="flex-1 leading-snug">{step.prompt}</span>
                    {isNext && (
                      <span className="shrink-0 text-[11px] font-semibold text-foreground">
                        Send →
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex flex-wrap gap-2">
            <IterButton onClick={send} disabled={done} className="min-w-[9.5rem]">
              {done ? "All applied ✓" : "Send prompt →"}
            </IterButton>
            <IterButton variant="secondary" onClick={reset} disabled={applied === 0}>
              Reset
            </IterButton>
          </div>

          {nextPrompt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">&ldquo;{nextPrompt}&rdquo;</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live component
          </p>
          <div className="flex min-h-12 flex-wrap items-center gap-2.5">
            <IterButton>Primary</IterButton>
            <IterButton variant="destructive">Delete</IterButton>
            {applied >= 1 && (
              <IterButton variant="success" className="line-in">
                Saved
              </IterButton>
            )}
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
            <p className="mt-3 text-sm text-muted-foreground">
              Send a prompt above — new variants appear here as they unlock.
            </p>
          )}
        </div>
      </div>

      {/* Right — the diff feed */}
      <div className="overflow-hidden rounded-2xl border border-border bg-code text-code-foreground shadow-card lg:sticky lg:top-6">
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ② The edits
          </p>
          <span className="flex items-center gap-2 font-mono text-[11px] text-emerald-600">
            <span
              className={cn(
                "inline-block size-1.5 rounded-full",
                applied > 0 ? "bg-emerald-600" : "bg-muted-foreground/40",
              )}
            />
            {applied > 0 ? "1 file · button.tsx" : "button.tsx"}
          </span>
        </div>

        <div className="min-h-64 space-y-4 p-4 font-mono text-[11px] leading-relaxed sm:min-h-72 sm:p-5 sm:text-xs">
          {applied === 0 && (
            <p className="text-muted-foreground">
              Waiting for a prompt… edits stream into this one file.
            </p>
          )}
          {STEPS.slice(0, applied).map((step, i) => (
            <div key={step.prompt} className="line-in">
              <p className="text-muted-foreground">{step.intent}</p>
              {step.added.map((line) => (
                <p key={line} className="text-emerald-700">
                  <span className="mr-2 select-none text-emerald-600">+</span>
                  {line}
                </p>
              ))}
              {i < applied - 1 && <div className="mt-3 border-b border-border" />}
            </div>
          ))}
        </div>

        {done && (
          <div className="border-t border-border bg-muted px-4 py-3 text-xs text-muted-foreground sm:px-5">
            3 prompts · 5 lines added ·{" "}
            <span className="font-semibold text-emerald-700">0 other files touched</span>
          </div>
        )}
      </div>
    </div>
  );
}
