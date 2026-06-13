import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  soft?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  soft = false,
  className,
  children,
  ...props
}: BadgeProps) {
  // Map neutral to default as fallback
  const effectiveVariant = variant === "neutral" ? "default" : variant;

  const variantClassSolid = {
    default: "badge--default",
    primary: "badge--primary",
    success: "badge--success",
    warning: "badge--warning",
    danger: "badge--danger",
  };

  const variantClassSoft = {
    default: "badge--default",
    primary: "badge--primary-soft",
    success: "badge--success-soft",
    warning: "badge--warning-soft",
    danger: "badge--danger-soft",
  };

  const finalVariantClass = soft
    ? (variantClassSoft[effectiveVariant as keyof typeof variantClassSoft] || "badge--default")
    : (variantClassSolid[effectiveVariant as keyof typeof variantClassSolid] || "badge--default");

  const sizeClass = {
    sm: "badge--sm",
    md: "badge--md",
  }[size];

  return (
    <span
      className={cx("badge", finalVariantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </span>
  );
}
