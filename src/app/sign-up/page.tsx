"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: "customer",
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const userdata = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    image: formData.image,
    signupRole: formData.role as "customer" | "technician",
  };

  const result = await authClient.signUp.email({
    name: userdata.name,
    email: userdata.email,
    password: userdata.password,
    image: userdata.image || undefined,
    signupRole: userdata.signupRole,
    callbackURL: "/",
  });

  if (result.error) {
    if (result.error.code === "USER_ALREADY_EXISTS") {
      toast.info("This email is already registered.");
    } else {
      toast.error(result.error.message || "Failed to create account.");
    }
  } else {
    toast.success("Account created successfully!");
    await authClient.signOut();
    router.push("/sign-in");
  }

  console.log("Selected Role:", userdata.signupRole);
  console.log("Signup Result:", result);
};
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#faf9f6] px-4 py-8 sm:px-6">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div
          className="relative hidden min-h-[80vh] overflow-hidden bg-[#243b53] bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=90')",
          }}
        >
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172b40] via-[#243b53]/50 to-[#243b53]/30" />

          {/* Left Content */}
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
                YOUR TRUSTED REPAIR PARTNER
              </span>

              <h2 className="text-5xl font-extrabold leading-tight">
                Expert Care.
                <br />
                <span className="text-[#e4a878]">
                  Reliable Repairs.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
                Join FixMate and connect with trusted professionals
                for all your home appliance repair needs.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <ShieldCheck size={22} className="text-[#e4a878]" />

                <span className="text-sm font-semibold">
                  Quality Service You Can Trust
                </span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/60">
              © 2026 FixMate. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
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
                Create Your Account
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl">
                Get Started
              </h2>

              <p className="mt-3 text-sm text-stone-500">
                Create an account to get started with FixMate.
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
                OR SIGN UP WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#243b53]">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3.5 pl-11 pr-4 text-sm text-[#243b53] outline-none transition placeholder:text-stone-400 focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10"
                  />
                </div>
              </div>

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
                <label className="mb-2 block text-sm font-semibold text-[#243b53]">
                  Password
                </label>

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
                    placeholder="Create a strong password"
                    required
                    minLength={6}
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

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#243b53]">
                  Profile Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3.5 pl-11 pr-4 text-sm text-[#243b53] outline-none transition placeholder:text-stone-400 focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10"
                  />
                </div>
              </div>

              {/* Role Tabs */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#243b53]">
                  Choose Your Role
                </label>

                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#f5f3ef] p-1.5">

                  {/* Customer */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "customer",
                      }))
                    }
                    className={`rounded-xl border py-3.5 text-sm font-bold transition-all duration-300 ${
                      formData.role === "customer"
                        ? "border-[#243b53] bg-[#243b53] text-white shadow-md"
                        : "border-transparent text-stone-500 hover:text-[#243b53]"
                    }`}
                  >
                    <span className="block">Customer</span>

                    <span className="mt-1 block text-[10px] font-normal opacity-70">
                      Need a repair
                    </span>
                  </button>

                  {/* Technician */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "technician",
                      }))
                    }
                    className={`rounded-xl border py-3.5 text-sm font-bold transition-all duration-300 ${
                      formData.role === "technician"
                        ? "border-[#243b53] bg-[#243b53] text-white shadow-md"
                        : "border-transparent text-stone-500 hover:text-[#243b53]"
                    }`}
                  >
                    <span className="block">Technician</span>

                    <span className="mt-1 block text-[10px] font-normal opacity-70">
                      Provide services
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition duration-300 hover:bg-[#d28b53]"
              >
                Create Account

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Sign In */}
            <p className="mt-7 text-center text-sm text-stone-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#d28b53] transition hover:text-[#243b53]"
              >
                Sign In
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-5 text-center text-xs leading-6 text-stone-400">
              By creating an account, you agree to our Terms of Service
              and Privacy Policy.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;