import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

type StackSpacing = "sm" | "md" | "lg";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: StackSpacing;
  children: ReactNode;
}

export function Stack({
  spacing = "md",
  className,
  children,
  ...props
}: StackProps) {
  const spacingClass = {
    sm: "stack--sm",
    md: "stack--md",
    lg: "stack--lg",
  }[spacing];

  return (
    <div className={cx("stack", spacingClass, className)} {...props}>
      {children}
    </div>
  );
}
