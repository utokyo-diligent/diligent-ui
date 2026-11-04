import { tv } from "tailwind-variants";

export const button = tv({
  base: [
    "inline-flex items-center justify-center gap-1.5 rounded-md font-[number:var(--button-font-weight,var(--text-action-weight))] font-[family-name:var(--button-font-family,inherit)] whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-all outline-none focus-visible:ring-3",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "aria-invalid:border-error aria-invalid:focus-visible:ring-error/40",
  ],
  variants: {
    variant: {
      default: [
        "bg-[color:var(--button-default-background,var(--foreground))]",
        "text-[color:var(--button-default-text-color,var(--background))]",
        "hover:bg-[color:var(--button-default-background,var(--foreground))]/90",
        "focus-visible:ring-[color:var(--button-default-focus-color,var(--outline))]/50",
      ],
      primary: [
        "bg-[color:var(--button-primary-background,var(--primary))]",
        "text-[color:var(--button-primary-text-color,var(--primary-foreground))]",
        "hover:bg-[color:var(--button-primary-background,var(--primary))]/90",
        "focus-visible:ring-[color:var(--button-primary-focus-color,var(--primary))]/50",
      ],
      secondary: [
        "bg-[color:var(--button-secondary-background,var(--secondary))]",
        "text-[color:var(--button-secondary-text-color,var(--secondary-foreground))]",
        "hover:bg-[color:var(--button-secondary-hover-background,color-mix(in_oklch,var(--button-secondary-background,var(--secondary)),var(--foreground)_5%))]",
        "focus-visible:ring-[color:var(--button-secondary-focus-color,var(--secondary))]/50",
      ],
      outline: [
        "dark:border-input",
        "focus-visible:ring-[color:var(--button-outline-focus-color,var(--outline))]/50",
        "bg-[color:var(--button-outline-background,var(--background))]",
        "dark:bg-input/30",
        "focus-visible:border-[color:var(--button-outline-focus-color,var(--outline))]",
        "hover:bg-[color:var(--button-outline-hover-background,var(--muted))]",
        "dark:hover:bg-input/50",
        "hover:text-[color:var(--button-outline-hover-text-color,var(--foreground))]",
        "border",
        "shadow-xs",
      ],
      ghost: [
        "hover:bg-[color:var(--button-ghost-hover-background,var(--muted))]",
        "hover:text-[color:var(--button-ghost-hover-text-color,var(--foreground))]",
        "focus-visible:ring-[color:var(--button-ghost-focus-color,var(--outline))]/50",
      ],
      info: [
        "bg-[color:var(--button-info-background,var(--info))]",
        "text-[color:var(--button-info-text-color,var(--info-foreground))]",
        "hover:bg-[color:var(--button-info-background,var(--info))]/90",
        "focus-visible:ring-[color:var(--button-info-focus-color,var(--info))]/50",
      ],
      success: [
        "bg-[color:var(--button-success-background,var(--success))]",
        "text-[color:var(--button-success-text-color,var(--success-foreground))]",
        "hover:bg-[color:var(--button-success-background,var(--success))]/90",
        "focus-visible:ring-[color:var(--button-success-focus-color,var(--success))]/50",
      ],
      warning: [
        "bg-[color:var(--button-warning-background,var(--warning))]",
        "text-[color:var(--button-warning-text-color,var(--warning-foreground))]",
        "hover:bg-[color:var(--button-warning-background,var(--warning))]/90",
        "focus-visible:ring-[color:var(--button-warning-focus-color,var(--warning))]/50",
      ],
      error: [
        "bg-[color:var(--button-error-background,var(--error))]",
        "text-[color:var(--button-error-text-color,var(--error-foreground))]",
        "hover:bg-[color:var(--button-error-background,var(--error))]/90",
        "focus-visible:ring-[color:var(--button-error-focus-color,var(--error))]/50",
      ],
    },
    size: {
      sm: [
        "h-9",
        "px-4",
        "text-[length:var(--button-sm-font-size,var(--text-action-sm-size))]/[var(--button-sm-line-height,var(--text-action-sm-leading))]",
        "has-[>svg]:px-3",
        "[&_svg:not([class*='size-'])]:size-3.5",
      ],
      md: [
        "h-11",
        "px-5",
        "text-[length:var(--button-md-font-size,var(--text-action-md-size))]/[var(--button-md-line-height,var(--text-action-md-leading))]",
        "has-[>svg]:px-4",
        "[&_svg:not([class*='size-'])]:size-4.5",
      ],
      lg: [
        "h-12",
        "px-8",
        "text-[length:var(--button-lg-font-size,var(--text-action-lg-size))]/[var(--button-lg-line-height,var(--text-action-lg-leading))]",
        "has-[>svg]:px-6",
        "[&_svg:not([class*='size-'])]:size-5",
      ],
      "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-3.5",
      icon: "size-11 [&_svg:not([class*='size-'])]:size-4.5",
      "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
