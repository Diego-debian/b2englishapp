import React from "react";

type Variant = "success" | "error" | "warn" | "info";

export function Alert({
  title,
  description,
  variant = "info",
  className,
}: {
  title: string;
  description?: string;
  variant?: Variant;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    success: "border-emerald-500/25 bg-emerald-500/10",
    error: "border-red-500/25 bg-red-500/10",
    warn: "border-amber-500/25 bg-amber-500/10",
    info: "border-white/10 bg-white/5",
  };

  return (
    <div
      className={[
        "rounded-2xl border p-4 md:p-5",
        styles[variant],
        className ?? "",
      ].join(" ")}
    >
      <p className="text-sm font-semibold tracking-tight text-zinc-100">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-sm text-zinc-200/90">{description}</p>
      )}
    </div>
  );
}
