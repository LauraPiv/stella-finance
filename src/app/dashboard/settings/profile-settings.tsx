"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";

export function ProfileSettings({
  userId,
  fullName,
  avatarUrl,
  email,
}: {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  email: string;
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
    <div className="flex flex-col gap-4 rounded-[20px] border border-rose bg-cream p-[18px]">
      <div className="flex items-center gap-3.5">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Sua foto de perfil"
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-berry font-heading text-lg font-semibold text-white">
            {(fullName || email || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="m-0 font-heading text-[17px] font-semibold text-wine">
            {fullName || "Sem nome ainda"}
          </p>
          <p className="m-0 text-[13px] text-wine/60">{email}</p>
        </div>
        <label className="font-heading text-[13px] font-semibold text-berry underline cursor-pointer">
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
      {uploadError && <p className="m-0 text-sm text-berry">{uploadError}</p>}

      <form action={action} className="flex items-end gap-2">
        <input
          id="full_name"
          name="full_name"
          defaultValue={fullName ?? ""}
          placeholder="Como podemos te chamar?"
          className="flex-1 rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3 text-[15px] text-wine outline-none focus:border-berry"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-[46px] rounded-full bg-berry px-4 font-heading text-[13.5px] font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Salvando…" : "Salvar"}
        </button>
      </form>
      {state?.error && <p className="m-0 text-sm text-berry">{state.error}</p>}
    </div>
  );
}
