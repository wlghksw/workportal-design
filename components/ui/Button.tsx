import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerSoft";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: "btn--primary",
    secondary: "btn--secondary",
    ghost: "btn-ghost",
    danger: "btn--danger",
    dangerSoft: "btn--danger-soft",
  }[variant];

  const sizeClass = {
    sm: "btn--sm",
    md: "btn--md",
    lg: "btn--lg",
  }[size];

  return (
    <button
      type={type}
      className={cx(
        "btn",
        variantClass,
        sizeClass,
        fullWidth && "btn--block",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
