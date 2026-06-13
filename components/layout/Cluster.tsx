import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Cluster({ className, children, ...props }: ClusterProps) {
  return (
    <div className={cx("cluster", className)} {...props}>
      {children}
    </div>
  );
}
