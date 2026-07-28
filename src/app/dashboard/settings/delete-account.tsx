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
        className="font-heading text-sm font-semibold text-berry underline"
      >
        Excluir minha conta e todos os meus dados
      </button>
    );
  }

  return (
    <form action={deleteAccountPermanently} className="flex flex-col gap-3">
      <p className="m-0 text-sm text-wine">
        Isso apaga permanentemente sua conta, transações, contas, cartões e
        metas. Não é possível desfazer. Digite <strong>EXCLUIR</strong> para
        confirmar.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="w-40 rounded-2xl border-[1.5px] border-rose bg-white px-3.5 py-2.5 text-sm text-wine outline-none focus:border-berry"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={confirmText !== "EXCLUIR"}
          className="rounded-full bg-berry px-4 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-berry-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Excluir permanentemente
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="font-heading text-sm font-semibold text-wine/60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
