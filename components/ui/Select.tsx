import type { SelectHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: ReactNode;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cx("select", error && "input--error", className)}
      {...props}
    >
      {children}
    </select>
  );
}
