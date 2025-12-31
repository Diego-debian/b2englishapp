import React from "react";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "glass-strong card-hover rounded-2xl p-6 md:p-8 w-full max-w-md",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {props.children}
    </div>
  );
}
