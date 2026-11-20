"use client";

import React, { useState } from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { authClient, useSession } from "@/lib/auth-client";

// ================= PROFILE FORM =================

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
    area?: string | null;
    bio?: string | null;
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
  const [phone, setPhone] = useState(user.phone ?? "");
  const [area, setArea] = useState(user.area ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  const [isSaving, setIsSaving] = useState(false);

  const isDirty =
    name !== user.name ||
    image !== (user.image ?? "") ||
    phone !== (user.phone ?? "") ||
    area !== (user.area ?? "") ||
    bio !== (user.bio ?? "");

  const handleReset = () => {
    setName(user.name);
    setImage(user.image ?? "");
    setPhone(user.phone ?? "");
    setArea(user.area ?? "");
    setBio(user.bio ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
      } else {
        toast.success("Profile updated successfully!");
        await refetch();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      {/* ============ HEADING ============ */}
      <h2 className="text-lg font-extrabold text-[#243b53]">
        Edit Profile
      </h2>

      <p className="mt-1 text-sm text-stone-500">
        Update your personal information and profile details.
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
            Paste a direct image link. Leave empty to use your initials.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="profile-phone" className={LABEL_CLASSES}>
            Phone Number
          </label>

          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className={INPUT_CLASSES}
          />
        </div>

        {/* Area */}
        <div>
          <label htmlFor="profile-area" className={LABEL_CLASSES}>
            Area / Location
          </label>

          <input
            id="profile-area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Tongi, Gazipur"
            className={INPUT_CLASSES}
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="profile-bio" className={LABEL_CLASSES}>
            Bio
          </label>

          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            rows={4}
            className={`${INPUT_CLASSES} resize-none`}
          />
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
