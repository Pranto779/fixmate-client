import React from "react";
import {
  Mail,
  CalendarDays,
  BadgeCheck,
  Phone,
  FileText,
  MapPin,
} from "lucide-react";

import { ROLE_LABELS, isRole } from "@/lib/roles";

type ProfileSummaryProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
    emailVerified?: boolean;
    createdAt?: Date | string;
    phone?: string | number | null;
    bio?: string | null;
    location?: string | null;
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

      {/* Avatar */}
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#e4a878] bg-[#243b53]">
        {user.image?.trim() ? (
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

      {/* Name */}
      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-[#243b53]">
        {user.name}
      </h2>

      {/* Email */}
      <p className="mt-1.5 flex items-center justify-center gap-1.5 break-all text-sm text-stone-500">
        <Mail size={14} className="shrink-0" />
        {user.email}
      </p>

      {/* Phone */}
      {user.phone !== null &&
        user.phone !== undefined &&
        String(user.phone).trim() !== "" && (
          <p className="mt-2 flex items-center justify-center gap-1.5 break-all text-sm text-stone-500">
            <Phone size={14} className="shrink-0" />
            {user.phone}
          </p>
        )}

      {/* Location */}
      {user.location?.trim() && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-stone-500">
          <MapPin size={14} className="shrink-0" />
          {user.location}
        </p>
      )}

      {/* Bio */}
      {user.bio?.trim() && (
        <div className="mt-3 rounded-xl bg-stone-50 p-3 text-left">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#243b53]">
            <FileText size={14} />
            About
          </p>

          <p className="text-sm leading-relaxed text-stone-600">
            {user.bio}
          </p>
        </div>
      )}

      {/* Badges */}
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
          <BadgeCheck size={12} />
          {user.emailVerified ? "Verified" : "Unverified"}
        </span>
      </div>

      {/* Member Since */}
      {user.createdAt && (
        <p className="mt-5 flex items-center justify-center gap-1.5 border-t border-stone-100 pt-4 text-xs font-medium text-stone-400">
          <CalendarDays size={14} />
          Member since {formatDate(user.createdAt)}
        </p>
      )}

    </section>
  );
};

export default ProfileSummary;
