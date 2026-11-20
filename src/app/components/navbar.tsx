"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Wrench,
  Cog,
  Menu,
  X,
  ArrowUpRight,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Role Based Dashboard
  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-It-work" },
  ];

  // Logout Function
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setDropdownOpen(false);
      setOpen(false);

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // User Avatar - Session Image
  const UserAvatar = ({ size = "h-10 w-10" }: { size?: string }) => (
    <div
      className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#e9d8c5] bg-[#243b53] text-sm font-bold uppercase text-white`}
    >
      {user?.image && !imageError ? (
        <img
          src={user.image}
          alt={user.name || "User"}
          className="absolute inset-0 h-full w-full rounded-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        user?.name?.charAt(0) || "U"
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 bg-[#faf9f6]/95 backdrop-blur-md">
      <nav className="relative mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#243b53] text-white shadow-md transition-all duration-300 group-hover:bg-[#d28b53]">
            <Wrench
              size={22}
              strokeWidth={2.2}
              className="absolute transition-all duration-300 group-hover:rotate-[-45deg] group-hover:scale-0 group-hover:opacity-0"
            />

            <Cog
              size={25}
              strokeWidth={2.2}
              className="absolute scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:animate-spin"
            />
          </div>

          <div>
            <h1 className="text-[25px] font-extrabold tracking-tight text-[#243b53] transition-colors duration-300 group-hover:text-[#d28b53]">
              Fix<span className="text-[#d28b53]">Mate</span>
            </h1>

            <p className="-mt-1 text-[9px] font-semibold tracking-[2px] text-stone-400">
              REPAIR MADE SIMPLE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-2 text-[14px] font-semibold transition-colors duration-300 ${
                  isActive
                    ? "text-[#d28b53]"
                    : "text-[#243b53] hover:text-[#d28b53]"
                }`}
              >
                {link.name}

                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#d28b53] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="relative hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" />
          ) : user ? (
            <>
              {/* Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-[#d28b53]"
              >
                <UserAvatar />

                <div className="text-left">
                  <p className="text-[10px] font-medium text-stone-400">
                    Welcome,
                  </p>

                  <p className="max-w-[110px] truncate text-sm font-bold text-[#243b53]">
                    {user.name}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-[#243b53] transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-stone-100 px-3 py-3">
                    <UserAvatar size="h-11 w-11" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-stone-400">
                        Welcome,
                      </p>

                      <p className="truncate text-sm font-bold text-[#243b53]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-stone-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#243b53] transition-colors hover:bg-[#f4e7db]"
                  >
                    <User size={18} className="text-[#d28b53]" />
                    My Profile
                  </Link>

                  <Link
                    href={dashboardLink}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#243b53] transition-colors hover:bg-[#f4e7db]"
                  >
                    <LayoutDashboard
                      size={18}
                      className="text-[#d28b53]"
                    />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#243b53] transition-all duration-300 hover:bg-stone-100"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-xl bg-[#243b53] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d28b53]"
              >
                Get Started

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Auth + Menu Button */}
        <div className="relative flex items-center gap-1.5 md:hidden">

          {/* Mobile Profile Button */}
          {!isPending && user && (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-1.5 shadow-sm transition-all hover:border-[#d28b53]"
            >
              <UserAvatar size="h-8 w-8" />

              <div className="max-w-[75px] text-left">
                <p className="text-[8px] font-medium leading-3 text-stone-400">
                  Welcome,
                </p>

                <p className="truncate text-[11px] font-bold leading-4 text-[#243b53]">
                  {user.name}
                </p>
              </div>

              <ChevronDown
                size={12}
                className={`text-[#243b53] transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {isPending && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
          )}

          {/* Mobile Profile Dropdown */}
          {dropdownOpen && user && (
            <div className="absolute right-12 top-12 z-[60] w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
              <div className="flex items-center gap-3 border-b border-stone-100 px-3 py-3">
                <UserAvatar size="h-10 w-10" />

                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-stone-400">
                    Welcome,
                  </p>

                  <p className="truncate text-sm font-bold text-[#243b53]">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-stone-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#243b53] hover:bg-[#f4e7db]"
              >
                <User size={18} className="text-[#d28b53]" />
                My Profile
              </Link>

              <Link
                href={dashboardLink}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#243b53] hover:bg-[#f4e7db]"
              >
                <LayoutDashboard
                  size={18}
                  className="text-[#d28b53]"
                />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-[#243b53] transition-all duration-300 hover:border-[#d28b53] hover:bg-[#d28b53]/10"
            aria-label="Toggle menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-stone-200/70 bg-[#faf9f6] transition-all duration-300 md:hidden ${
          open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-5 py-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#243b53] text-white"
                    : "text-[#243b53] hover:bg-stone-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Sign In / Get Started - Only When Logged Out */}
          {!isPending && !user && (
            <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-4">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[#243b53] py-3 text-center text-sm font-bold text-[#243b53] transition-all duration-300 hover:bg-[#243b53] hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#243b53] py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#d28b53]"
              >
                Get Started
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
