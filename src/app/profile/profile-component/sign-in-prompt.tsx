import React from "react";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

// ================= SIGN-IN PROMPT =================
// Shown on pages that need a session when the user is logged out.

const SignInPrompt = () => {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto w-fit rounded-2xl bg-[#faf9f6] p-4 text-[#d28b53]">
        <Lock size={26} aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-lg font-extrabold text-[#243b53]">
        You&apos;re not signed in
      </h2>

      <p className="mt-2 text-sm text-stone-500">
        Sign in to view and edit your profile information.
      </p>

      <Link
        href="/sign-in"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#243b53] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#d28b53]"
      >
        Sign In
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default SignInPrompt;
