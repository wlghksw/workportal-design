import type { InputHTMLAttributes } from "react";
import { cx } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cx("input", error && "input--error", className)}
      {...props}
    />
  );
}
