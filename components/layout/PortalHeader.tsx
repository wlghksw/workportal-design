import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../ui/utils";

export interface PortalHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  logo?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PortalHeader({
  logo,
  title,
  subtitle,
  actions,
  className,
  children,
  ...props
}: PortalHeaderProps) {
  return (
    <header className={cx("portal-header", "site-header", className)} {...props}>
      <div className="portal-header__inner">
        <div className="portal-header__brand brand">
          {logo}
          {title && <span className="brand__sub">{title}</span>}
          {subtitle && <span className="brand__sub">{subtitle}</span>}
        </div>
        <div className="site-header__spacer" />
        {actions && <div className="portal-header__actions">{actions}</div>}
        {children}
      </div>
    </header>
  );
}
