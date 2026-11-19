"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  Cog,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 bg-[#faf9f6]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#243b53] text-white shadow-md transition-all duration-300 group-hover:bg-[#d28b53]">

            {/* Wrench Icon */}
            <Wrench
              size={22}
              strokeWidth={2.2}
              className="absolute transition-all duration-300 group-hover:rotate-[-45deg] group-hover:scale-0 group-hover:opacity-0"
            />

            {/* Rotating Gear Icon */}
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

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-[#243b53] transition-all duration-300 hover:border-[#d28b53] hover:bg-[#d28b53]/10 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-stone-200/70 bg-[#faf9f6] transition-all duration-300 md:hidden ${
          open
            ? "max-h-[450px] opacity-100"
            : "max-h-0 opacity-0"
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

          <div className="grid grid-cols-2 gap-3 pt-3">
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;