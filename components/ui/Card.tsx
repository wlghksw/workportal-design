import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type CardVariant = "default" | "elevated" | "soft" | "clickable" | "danger";
type CardSpacing = "compact" | "default" | "spacious";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  spacing?: CardSpacing;
  children: ReactNode;
}

export function Card({
  variant = "default",
  spacing = "default",
  className,
  children,
  ...props
}: CardProps) {
  const variantClass = {
    default: "card--default",
    elevated: "card--elevated",
    soft: "card--soft",
    clickable: "card--clickable",
    danger: "card--danger",
  }[variant];

  const spacingClass = {
    compact: "card--compact",
    default: "",
    spacious: "card--spacious",
  }[spacing];

  return (
    <section
      className={cx("card", variantClass, spacingClass, className)}
      {...props}
    >
      {children}
    </section>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <header className={cx("card__header", className)} {...props}>
      {children}
    </header>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cx("card__title", className)} {...props}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p className={cx("card__description", className)} {...props}>
      {children}
    </p>
  );
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cx("card__body", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <footer className={cx("card__footer", className)} {...props}>
      {children}
    </footer>
  );
}

// Attach sub-components for easier usage
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;
