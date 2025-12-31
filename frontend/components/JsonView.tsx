import React from "react";

export function JsonView({ data }: { data: any }) {
  try {
    return (
      <pre className="whitespace-pre-wrap text-xs text-zinc-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  } catch {
    return <pre className="text-xs text-zinc-200">{"{unserializable}"}</pre>;
  }
}
