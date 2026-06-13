import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

export interface PageProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Page({ className, children, ...props }: PageProps) {
  return (
    <div className={cx("page", className)} {...props}>
      <div className="page__inner">{children}</div>
    </div>
  );
}
