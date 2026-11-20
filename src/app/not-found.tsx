import Link from "next/link";

import {
  ArrowUpRight,
  Home,
  Wrench,
  Settings,
  Search,
  Cog,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex h-[90vh] min-h-[550px] items-center justify-center overflow-hidden bg-[#faf9f6] px-5">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#c18b5e]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#d4a477]/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">

        {/* 404 Illustration */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[290px] items-center justify-center">

          {/* Outer Circles */}
          <div className="absolute inset-[3%] rounded-full border border-dashed border-[#c18b5e]/30" />

          <div className="absolute inset-[13%] rounded-full border border-[#c18b5e]/15" />

          <div className="absolute inset-[23%] rounded-full border border-dashed border-[#c18b5e]/25" />

          {/* Main 404 Circle */}
          <div className="relative z-10 flex h-[210px] w-[210px] flex-col items-center justify-center rounded-full border border-[#c18b5e]/20 bg-white shadow-[0_25px_80px_rgba(48,37,30,0.10)] sm:h-[230px] sm:w-[230px]">

            <div className="absolute inset-3 rounded-full border border-[#f1ece6]" />

            <h2 className="relative text-7xl font-black tracking-tighter text-[#30251e]">
              404  <span className="text-[#c18b5e]">!</span>
            </h2>

            <div className="mt-2 flex items-center gap-2 rounded-full bg-[#f1ece6] px-4 py-2 text-sm font-semibold text-[#a16e49]">
              <Wrench size={15} />
              Under Repair
            </div>

            <div className="absolute -bottom-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c18b5e] text-white shadow-lg shadow-[#c18b5e]/30">
              <Settings size={23} />
            </div>
          </div>

          {/* Orbit 1 */}
          <div className="absolute inset-0 z-20 animate-[spin_12s_linear_infinite]">
            <div className="absolute left-1/2 top-0 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-2xl border border-[#c18b5e]/20 bg-white text-[#c18b5e] shadow-lg">
              <Settings size={23} />
            </div>
          </div>

          {/* Orbit 2 */}
          <div className="absolute inset-0 z-20 animate-[spin_16s_linear_infinite_reverse]">
            <div className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#c18b5e]/20 bg-white text-[#30251e] shadow-lg">
              <Cog size={23} />
            </div>
          </div>

          {/* Orbit 3 */}
          <div className="absolute inset-0 z-20 animate-[spin_20s_linear_infinite]">
            <div className="absolute bottom-0 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-2xl border border-[#c18b5e]/20 bg-white text-[#c18b5e] shadow-lg">
              <Search size={22} />
            </div>
          </div>

          {/* Orbit 4 */}
          <div className="absolute inset-0 z-20 animate-[spin_14s_linear_infinite_reverse]">
            <div className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#c18b5e]/20 bg-white text-[#30251e] shadow-lg">
              <Wrench size={22} />
            </div>
          </div>

          {/* Small Decorations */}
          <div className="absolute right-[13%] top-[12%] h-3 w-3 rounded-full bg-[#c18b5e]" />
          <div className="absolute bottom-[13%] left-[12%] h-2.5 w-2.5 rounded-full bg-[#d4a477]" />
          <div className="absolute left-[18%] top-[25%] h-2 w-2 rounded-full bg-[#c18b5e]/50" />
        </div>

        {/* Heading */}
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-[#30251e] sm:text-5xl">
          Oops! Lost in
          <span className="block text-[#c18b5e]">
            the Fix.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#776b62] sm:text-base">
          The page you&apos;re looking for might have been moved,
          removed, or is temporarily unavailable.
        </p>

        {/* Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="h-11 rounded-xl bg-[#30251e] px-5 text-sm font-semibold text-white shadow-lg shadow-[#30251e]/15 transition-all hover:bg-[#49372b]"
          >
            <Home size={17} />
            Back to Home
            <ArrowUpRight size={16} />
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/services" />}
            className="h-11 rounded-xl border border-[#c18b5e]/30 bg-white px-5 text-sm font-semibold text-[#30251e] shadow-sm transition-all hover:bg-[#f1ece6]"
          >
            Explore Services
            <Wrench size={16} />
          </Button>

        </div>

      </div>
    </main>
  );
}