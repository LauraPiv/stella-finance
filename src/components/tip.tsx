"use client";

import { useState } from "react";

export function Tip({ children }: { children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>{children}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dispensar dica"
        className="text-amber-600 hover:text-amber-900"
      >
        ×
      </button>
    </div>
  );
}
