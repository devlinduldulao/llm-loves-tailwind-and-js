import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — the single most-copied helper in the modern React / shadcn ecosystem.
 *
 * clsx      → conditionally join class names ("px-4", cond && "bg-primary")
 * twMerge   → resolve Tailwind conflicts so the LAST one wins
 *             (cn("px-2", "px-4") === "px-4", not "px-2 px-4")
 *
 * This tiny function is why an LLM can safely *compose* utilities at runtime:
 * it can pass extra classes into a component and trust conflicts resolve.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
