import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({
  label,
  helperText,
  errorMessage,
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  const isError = Boolean(errorMessage);

  return (
    <div className={cx("field", isError && "field--error", className)} {...props}>
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {errorMessage ? (
        <p className="field__error">{errorMessage}</p>
      ) : (
        helperText && <p className="field__help">{helperText}</p>
      )}
    </div>
  );
}
