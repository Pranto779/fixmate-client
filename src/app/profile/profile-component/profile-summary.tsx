import React from "react";
import { Mail, CalendarDays, BadgeCheck } from "lucide-react";

import { ROLE_LABELS, isRole } from "@/lib/roles";

// ================= PROFILE SUMMARY =================
// Read-only info card: avatar, name, email, role, member since.

type ProfileSummaryProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
    emailVerified?: boolean;
    createdAt?: Date | string;
  };
};

const formatDate = (value: Date | string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ProfileSummary = ({ user }: ProfileSummaryProps) => {
  const initial =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className="h-fit rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      {/* ============ AVATAR ============ */}
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#e4a878] bg-[#243b53]">
        {user.image?.trim() ? (
          // User-pasted URLs can be anything, so plain <img> is safest.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-white">
            {initial}
          </span>
        )}
      </div>

      {/* ============ NAME + EMAIL ============ */}
      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-[#243b53]">
        {user.name}
      </h2>

      <p className="mt-1.5 flex items-center justify-center gap-1.5 break-all text-sm text-stone-500">
        <Mail size={14} className="shrink-0" aria-hidden="true" />
        {user.email}
      </p>

      {/* ============ BADGES ============ */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="rounded-full bg-[#243b53]/10 px-3 py-1 text-[11px] font-bold capitalize text-[#243b53]">
          {isRole(user.role) ? ROLE_LABELS[user.role] : "Member"}
        </span>

        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
            user.emailVerified
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <BadgeCheck size={12} aria-hidden="true" />
          {user.emailVerified ? "Verified" : "Unverified"}
        </span>
      </div>

      {/* ============ MEMBER SINCE ============ */}
      {user.createdAt && (
        <p className="mt-5 flex items-center justify-center gap-1.5 border-t border-stone-100 pt-4 text-xs font-medium text-stone-400">
          <CalendarDays size={14} aria-hidden="true" />
          Member since {formatDate(user.createdAt)}
        </p>
      )}
    </section>
  );
};

export default ProfileSummary;
