"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, ...rest }, ref) => {
    return (
      <div className="block">
        {label && (
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          // Note: .input-pro is defined in globals.css with new styles
          className={[
            "input-pro",
            error ? "!border-red-500 ring-2 ring-red-500/20" : "",
            className ?? "",
          ].join(" ")}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
