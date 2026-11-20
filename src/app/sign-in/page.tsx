"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata=new FormData(e.currentTarget);
    const userdata=Object.fromEntries(formdata.entries()) as {email:string,password:string};
const { data } = await authClient.signIn.email({
email: userdata.email,
password: userdata.password,
});
    console.log("Sign In Data:", userdata);

    if (data) {
      toast.success("Sign In Successful!");
      router.push("/"); // /dashboard redirects to the role-based dashboard
    }else {
      toast.error("Sign In Failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#faf9f6] px-4 py-8 sm:px-6">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

        {/* ================= LEFT SIDE FORM ================= */}
        <div className="order-1 flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-8 flex items-center gap-2 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#243b53] text-white">
                <Wrench size={22} />
              </div>

              <h1 className="text-2xl font-extrabold text-[#243b53]">
                Fix<span className="text-[#d28b53]">Mate</span>
              </h1>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#d28b53]">
                Welcome Back
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl">
                Sign In
              </h2>

              <p className="mt-3 text-sm text-stone-500">
                Enter your details to access your FixMate account.
              </p>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white py-3.5 text-sm font-bold text-[#243b53] shadow-sm transition-all duration-300 hover:border-[#d28b53]/50 hover:bg-[#faf9f6] hover:shadow-md"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7Z"
                />
                <path
                  fill="#FF3D00"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 2-7 2-5.3 0-9.8-3.6-11.4-8.4H5.9v5.2C9.2 39.6 16 44 24 44Z"
                />
                <path
                  fill="#4CAF50"
                  d="M12.6 27.8c-.4-1.2-.7-2.5-.7-3.8s.3-2.6.7-3.8V15H5.9C4.7 17.7 4 20.8 4 24s.7 6.3 1.9 9l6.7-5.2Z"
                />
                <path
                  fill="#1976D2"
                  d="M24 11.6c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.6 29.5 4 24 4 16 4 9.2 8.4 5.9 15l6.7 5.2c1.6-4.8 6.1-8.6 11.4-8.6Z"
                />
              </svg>

              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-stone-200" />

              <span className="text-xs font-medium text-stone-400">
                OR CONTINUE WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#243b53]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3.5 pl-11 pr-4 text-sm text-[#243b53] outline-none transition placeholder:text-stone-400 focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#243b53]">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#d28b53] transition hover:text-[#243b53]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3.5 pl-11 pr-12 text-sm text-[#243b53] outline-none transition placeholder:text-stone-400 focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-[#243b53]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition duration-300 hover:bg-[#d28b53]"
              >
                Sign In

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Sign Up */}
            <p className="mt-7 text-center text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#d28b53] transition hover:text-[#243b53]"
              >
                Create Account
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-5 text-center text-xs leading-6 text-stone-400">
              By signing in, you agree to our Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE IMAGE ================= */}
        <div
          className="relative order-2 hidden min-h-[80vh] overflow-hidden bg-[#243b53] bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=90')",
          }}
        >
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172b40] via-[#243b53]/50 to-[#243b53]/30" />

          {/* Image Content */}
          <div className="relative z-10 flex min-h-[80vh] flex-col justify-between p-12 text-white">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#243b53]">
                <Wrench size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold">
                  Fix<span className="text-[#e4a878]">Mate</span>
                </h1>

                <p className="text-[9px] tracking-[2px] text-white/70">
                  REPAIR MADE SIMPLE
                </p>
              </div>
            </Link>

            {/* Main Content */}
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md">
                <CheckCircle2 size={15} className="text-[#e4a878]" />
                WELCOME BACK TO FIXMATE
              </span>

              <h2 className="text-5xl font-extrabold leading-tight">
                Welcome Back.
                <br />

                <span className="text-[#e4a878]">
                  We&apos;re Here to Help.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
                Sign in to manage your repair requests, connect with
                professional technicians and keep your home running smoothly.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <ShieldCheck size={22} className="text-[#e4a878]" />

                <span className="text-sm font-semibold">
                  Reliable Service. Trusted Professionals.
                </span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/60">
              © 2026 FixMate. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;