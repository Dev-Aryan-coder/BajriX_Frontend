import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import "./badge.css"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-[var(--rebar)]",
        secondary: "bg-[var(--secondary)] text-white",
        success: "bg-[var(--success)] text-white",
        pending: "bg-[var(--amber)] text-[var(--rebar)]",
        destructive: "bg-red-600 text-white",
        outline: "border border-[var(--border)] text-[var(--foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
