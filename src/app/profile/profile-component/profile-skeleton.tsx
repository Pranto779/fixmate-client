import React from "react";

// ================= PROFILE SKELETON =================
// Loading placeholder while the session is being fetched.

const ProfileSkeleton = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Summary skeleton */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-stone-200" />

        <div className="mx-auto mt-4 h-5 w-32 animate-pulse rounded bg-stone-200" />
        <div className="mx-auto mt-2 h-4 w-44 animate-pulse rounded bg-stone-200" />
        <div className="mx-auto mt-4 h-6 w-28 animate-pulse rounded-full bg-stone-200" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-stone-200" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="h-12 w-40 animate-pulse rounded-xl bg-stone-200" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
