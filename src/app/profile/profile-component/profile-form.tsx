"use client";

import React, { useState } from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { authClient, useSession } from "@/lib/auth-client";

// ================= PROFILE FORM =================
// Edits name + avatar URL via better-auth updateUser().
// Email is read-only (better-auth handles email change separately).

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

const INPUT_CLASSES =
  "w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3.5 text-sm text-[#243b53] outline-none transition placeholder:text-stone-400 focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10 disabled:cursor-not-allowed disabled:opacity-60";

const LABEL_CLASSES =
  "mb-2 block text-sm font-semibold text-[#243b53]";

const ProfileForm = ({ user }: ProfileFormProps) => {
  const { refetch } = useSession();

  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const isDirty =
    name !== user.name || image !== (user.image ?? "");

  const handleReset = () => {
    setName(user.name);
    setImage(user.image ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: image.trim() || null,
    });

    if (error) {
      toast.error(error.message || "Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
      await refetch(); // refreshes navbar + summary card too
    }

    setIsSaving(false);
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      {/* ============ HEADING ============ */}
      <h2 className="text-lg font-extrabold text-[#243b53]">
        Edit Profile
      </h2>

      <p className="mt-1 text-sm text-stone-500">
        Update your name and avatar. Changes are saved to your
        account.
      </p>

      {/* ============ FORM ============ */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="profile-name" className={LABEL_CLASSES}>
            Full Name
          </label>

          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            className={INPUT_CLASSES}
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label htmlFor="profile-image" className={LABEL_CLASSES}>
            Avatar URL
          </label>

          <input
            id="profile-image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className={INPUT_CLASSES}
          />

          <p className="mt-1.5 text-xs text-stone-400">
            Paste a direct image link. Leave empty to use your
            initials.
          </p>
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="profile-email" className={LABEL_CLASSES}>
            Email Address
          </label>

          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className={INPUT_CLASSES}
          />

          <p className="mt-1.5 text-xs text-stone-400">
            Email changes are not available yet.
          </p>
        </div>

        {/* ============ ACTIONS ============ */}
        <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-5">
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 rounded-xl bg-[#243b53] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#d28b53] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-3.5 text-sm font-bold text-stone-600 transition hover:border-[#d28b53] hover:text-[#d28b53] disabled:opacity-60"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ProfileForm;
