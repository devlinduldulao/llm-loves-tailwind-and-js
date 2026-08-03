# Why LLMs & JS Frameworks Love Tailwind CSS — Live Demo

Companion repo for the conference talk. A tiny **Vite + React + TypeScript + Tailwind v4**
app that makes the talk's thesis concrete and live-codeable on stage.

UI stack: **shadcn/ui `base-maia`** — Base UI primitives + Maia style (soft, large radius,
generous spacing). Config lives in `components.json`.

## Run it

```bash
cd demo
npm install
npm run dev      # http://localhost:5173
```

Build check (typecheck + production bundle):

```bash
npm run build
```

## What's inside (and how it maps to the talk)

| File | Talk beat |
| --- | --- |
| `src/components/PricingCard.semantic.tsx` + `.css` | **Demo 1** — the "semantic CSS" way. Two files, invented BEM names, the cascade. This is what an LLM (or a tired human) must hold in context to reason about one component. |
| `src/components/PricingCard.tailwind.tsx` | **Demo 1** — the *identical* card, one co-located file, no naming, no cascade. The whole spec in a single span of tokens. |
| `src/components/ui/button.tsx` | **Demo 2** — official shadcn Base UI `Button` (Maia) with `cva`. Typed, autocompleted variants: TypeScript and Tailwind are the same idea (a constrained vocabulary) at two layers. |
| `src/components/ui/{card,badge,separator}.tsx` | Supporting shadcn Base UI components used by the showcase shell. |
| `src/components/LlmIterationDemo.tsx` | **Demo 3** — a deterministic replay of an LLM extending the component. Each prompt streams a diff into `button.tsx` and unlocks the real capability in the live preview. Shows: every edit lands in *one* file. |
| `src/lib/utils.ts` | The `cn` helper (`clsx` + `tailwind-merge`) that makes runtime class composition safe. `cn.ts` re-exports it. |
| `src/index.css` | Tailwind v4 + shadcn tokens. Brand palette (`ink`, `mint`, `gold`, `coral`) sits next to semantic tokens (`primary`, `muted-foreground`, …). |
| `components.json` | shadcn config: `"style": "base-maia"`. |
| `src/App.tsx` | The showcase page. Doubles as a visual backup if a live demo misbehaves. |

## Live-demo scripts (say this, do this)

**Demo 1 — "What the model has to reason about"**
1. Show both cards rendered side-by-side, pixel identical.
2. Click **Show source**. Point out: semantic = 2 files + 11 invented class names + a cascade; Tailwind = 1 file, 0 names.
3. Optional zinger: paste `PricingCard.tailwind.tsx` into an LLM and ask *"make the featured card's CTA pulse on hover."* It edits one line, in place.

**Demo 2 — "Typed variants, LLM-friendly by construction"**
1. Play with the variant/size dropdowns; show the generated class string update live.
2. In your editor, show autocomplete on `<Button variant="` — the closed set appears.
3. Point out a wrong variant is a red squiggle at compile time.

**Demo 3 — "Watch it edit one file"** (`LlmIterationDemo`)
1. Scroll to the **"Watch it edit one file"** section. Click **Send prompt** three times.
2. Each click appends a green diff to the `button.tsx` feed *and* grows the live component (green `success`, a spinner `loading` state, then a full-width CTA).
3. Land the closing counter: **"3 prompts · 5 lines added · 0 other files touched."** Local edit = safe edit.
4. This panel is a *deterministic replay* so it never fails on stage. To do it for real, run the same prompts against `ui/button.tsx` in your editor with Cursor/Claude. This panel is the backup.

## Stack

- **shadcn/ui `base-maia`** — Base UI primitives, Maia visual style.
- **Tailwind v4** via `@tailwindcss/vite` — no `tailwind.config.js`, no PostCSS config.
- **class-variance-authority** for typed variants, **tailwind-merge** for conflict resolution.
- React 19 + TypeScript 5.8 + Vite 6.

### Add more components

```bash
cd demo
# Corporate Zscaler may need: $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npx shadcn@latest add dialog input --overwrite
```
