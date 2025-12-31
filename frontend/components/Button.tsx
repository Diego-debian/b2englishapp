"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  children,
  className,
  variant = "primary",
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl " +
    "transition outline-none select-none " +
    "focus-visible:ring-2 focus-visible:ring-brand2/40 focus-visible:ring-offset-0 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const styles: Record<Variant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  return (
    <button
      className={[base, styles[variant], className ?? ""].join(" ")}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
