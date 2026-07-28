"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";

export function ProfileSettings({
  userId,
  fullName,
  avatarUrl,
}: {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setUploading(false);
      setUploadError("Não foi possível enviar a foto. Tente novamente.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);

    setPreview(publicUrl);
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Sua foto de perfil"
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-lg font-medium text-zinc-400">
            {(fullName || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <label className="text-xs font-medium text-zinc-600 underline cursor-pointer">
          {uploading ? "Enviando…" : "Trocar foto"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleAvatarChange}
          />
        </label>
      </div>
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <form action={action} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="full_name" className="text-xs font-medium text-zinc-600">
            Nome
          </label>
          <input
            id="full_name"
            name="full_name"
            defaultValue={fullName ?? ""}
            placeholder="Como podemos te chamar?"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          {pending ? "Salvando…" : "Salvar nome"}
        </button>
      </form>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
