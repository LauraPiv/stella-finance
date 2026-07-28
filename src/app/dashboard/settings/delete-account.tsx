"use client";

import { useState } from "react";
import { deleteAccountPermanently } from "@/lib/actions/auth";

export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-red-600 underline"
      >
        Excluir minha conta e todos os meus dados
      </button>
    );
  }

  return (
    <form action={deleteAccountPermanently} className="flex flex-col gap-3">
      <p className="text-sm text-zinc-700">
        Isso apaga permanentemente sua conta, transações, contas, cartões e
        metas. Não é possível desfazer. Digite <strong>EXCLUIR</strong> para
        confirmar.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-600"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={confirmText !== "EXCLUIR"}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Excluir permanentemente
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm font-medium text-zinc-500 underline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
