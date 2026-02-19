'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
  size?: "default" | "sm" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-accent focus-visible:ring-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-muted focus-visible:ring-primary",
      destructive: "bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:ring-destructive",
      outline: "border-2 border-primary text-primary hover:bg-secondary focus-visible:ring-primary",
    }

    const sizes = {
      default: "px-4 py-2 text-base",
      sm: "px-3 py-1 text-sm",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
export { Button }
