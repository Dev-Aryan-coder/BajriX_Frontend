import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes conditionally without style conflicts.
 * Standard helper for shadcn/ui and custom components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
