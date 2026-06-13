import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export function Section({
  title,
  description,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cx("section", className)} {...props}>
      {(title || description) && (
        <header className="section__header">
          {title && <h2 className="section__title">{title}</h2>}
          {description && <p className="section__description">{description}</p>}
        </header>
      )}
      <div className="section__body">{children}</div>
    </section>
  );
}
