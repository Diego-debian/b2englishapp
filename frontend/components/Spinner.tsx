import React from "react";

export function Spinner() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200"
      aria-label="Loading"
      role="status"
    />
  );
}
