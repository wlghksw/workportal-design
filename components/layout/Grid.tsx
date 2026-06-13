import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

type GridCols = 2 | 3 | "auto";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  children: ReactNode;
}

export function Grid({ cols, className, children, ...props }: GridProps) {
  const colsClass = cols
    ? {
        2: "grid--2",
        3: "grid--3",
        auto: "grid--auto",
      }[cols]
    : "";

  return (
    <div className={cx("grid", colsClass, className)} {...props}>
      {children}
    </div>
  );
}
