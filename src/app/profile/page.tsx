"use client";

import React from "react";

import { useSession } from "@/lib/auth-client";
import ProfileSummary from "@/app/profile/profile-component/profile-summary";
import ProfileForm from "@/app/profile/profile-component/profile-form";
import ProfileSkeleton from "@/app/profile/profile-component/profile-skeleton";
import SignInPrompt from "@/app/profile/profile-component/sign-in-prompt";

// ================= PROFILE PAGE =================
// Just layout + session state. All pieces live in
// src/components/profile/.

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-[80vh] bg-[#faf9f6] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* ============ HEADING ============ */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#d28b53]">
            Account
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            View and update your personal information.
          </p>
        </div>

        {/* ============ CONTENT ============ */}
        {isPending ? (
          <ProfileSkeleton />
        ) : !user ? (
          <SignInPrompt />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <ProfileSummary user={user} />
            <ProfileForm user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
