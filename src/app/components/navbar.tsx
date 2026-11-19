"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Wrench,
  Menu,
  X,
  ArrowUpRight,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

// ================= USER SKELETON =================

const UserSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" />

      <div className="hidden space-y-2 sm:block">
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
        <div className="h-2.5 w-12 animate-pulse rounded bg-stone-200" />
      </div>
    </div>
  );
};

// ================= USER AVATAR =================

const UserAvatar = ({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) => {
  const firstLetter = name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#e4a878] bg-[#243b53] text-base font-bold text-white">
      {image?.trim() ? (
        <Image
          src={image}
          alt={name || "User"}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <span>{firstLetter}</span>
      )}
    </div>
  );
};

// ================= NAVBAR =================

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Dashboard Based on Role
  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "technician"
        ? "/technician"
        : "/customer";

  // Logout
  const handleLogout = async () => {
    await authClient.signOut();

    setDropdownOpen(false);
    setOpen(false);

    router.push("/sign-in");
    router.refresh();
  };

  // ================= AUTH BUTTONS =================

  const navbutton = (
    <>
      {isPending ? (
        <UserSkeleton />
      ) : user ? (
        <div className="relative">
          {/* User Button */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white p-1.5 pr-3 transition hover:border-[#d28b53]"
          >
            <UserAvatar
              name={user.name}
              image={user.image}
            />

            <div className="hidden text-left sm:block">
              <p className="max-w-[110px] truncate text-sm font-bold text-[#243b53]">
                {user.name}
              </p>

              <p className="text-[11px] capitalize text-stone-500">
                {user.role || "Customer"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-[#243b53] transition duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-14 z-[100] w-64 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">

              {/* User Information */}
              <div className="flex items-center gap-3 border-b border-stone-100 px-3 py-3">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#243b53]">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-stone-500">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Dropdown Links */}
              <div className="space-y-1 py-2">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-[#d28b53]"
                >
                  <User size={17} />
                  My Profile
                </Link>

                <Link
                  href={dashboardLink}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-[#d28b53]"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-stone-100 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2.5 text-sm font-bold text-[#243b53] transition hover:text-[#d28b53]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="group flex items-center gap-2 rounded-xl bg-[#243b53] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition duration-300 hover:bg-[#d28b53]"
          >
            Get Started

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      )}
    </>
  );

  // ================= MAIN JSX =================

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#faf9f6]/95 backdrop-blur-xl">

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#243b53] text-white shadow-md shadow-slate-900/10">
            <Wrench size={22} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-[25px] font-extrabold tracking-tight text-[#243b53]">
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
            const active = mounted && pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative py-2 text-[14px] font-semibold transition-colors duration-300 ${
                  active
                    ? "text-[#d28b53]"
                    : "text-[#526171] hover:text-[#d28b53]"
                }`}
              >
                {link.name}

                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-[#d28b53] transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {navbutton}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-stone-200 p-2.5 text-[#243b53] transition hover:bg-stone-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-stone-200 bg-[#faf9f6] px-5 py-5 md:hidden">

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = mounted && pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#243b53] text-white"
                      : "text-[#526171] hover:bg-stone-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-4">
            {navbutton}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;