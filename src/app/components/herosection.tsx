"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Star,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const heroImage =
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=85";

  return (
    <section className="relative overflow-hidden bg-[#faf9f6]">

      {/* Mobile Background Image Layer */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src={heroImage}
          alt="Professional repair technician"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-[#faf9f6]/65" />
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 z-[1] h-[450px] w-[450px] rounded-full bg-[#e9d8c5]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 z-[1] h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-0 max-w-7xl items-center gap-10 px-5 py-12 md:min-h-[620px] md:grid-cols-2 md:gap-12 md:py-16 lg:px-8 lg:py-20">

        {/* Left Content */}
        <div className="z-10">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8d7c5] bg-white/90 px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#d28b53]" />
            <span className="text-xs font-bold tracking-wide text-[#8c6548]">
              YOUR TRUSTED REPAIR PARTNER
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.13] tracking-tight text-[#243b53] sm:text-5xl md:text-6xl lg:text-[68px]">
            Repair Smarter.
            <br />
            Live <span className="text-[#d28b53]">Better.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#718096] sm:text-base sm:leading-8 md:mt-7 md:text-lg">
            From broken appliances to everyday home fixes, connect with
            trusted professionals and get your problems solved without
            the hassle.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9 md:gap-4">
            <Link
              href="/services"
              className="group flex items-center gap-3 rounded-xl bg-[#243b53] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition duration-300 hover:-translate-y-1 hover:bg-[#d28b53] md:px-7 md:py-4"
            >
              Explore Services
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white/90 px-5 py-3.5 text-sm font-bold text-[#243b53] transition hover:border-[#d28b53] hover:text-[#d28b53] md:px-7 md:py-4"
            >
              How It Works
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Trust Info */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-stone-200/80 pt-6 md:mt-12 md:gap-7 md:pt-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9e3d9] text-[#243b53]">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243b53]">Trusted</p>
                <p className="text-xs text-stone-500">Professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e7db] text-[#d28b53]">
                <Clock3 size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243b53]">Fast</p>
                <p className="text-xs text-stone-500">Reliable Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual - Desktop Only */}
        <div className="relative mx-auto hidden w-full max-w-[510px] md:block">

          {/* Main Image Card */}
          <div className="relative overflow-hidden rounded-[32px] border-[10px] border-white bg-[#e9e3d9] shadow-2xl shadow-slate-900/10">
            <div className="relative h-[400px] overflow-hidden sm:h-[470px]">
              <Image
                height={1000}
                width={1000}
                src={heroImage}
                alt="Professional home appliance repair technician"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10263c]/70 via-transparent to-transparent" />

              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-[3px] text-white/70">
                  Professional Repair
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Quality You Can Trust.
                </h3>
              </div>
            </div>
          </div>

          {/* Floating Rating Card */}
          <div className="absolute -left-8 top-16 hidden items-center gap-3 rounded-2xl border border-stone-100 bg-white p-4 shadow-xl sm:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1df] text-[#d28b53]">
              <Star size={23} fill="currentColor" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#243b53]">4.9/5</p>
              <p className="text-xs text-stone-500">Customer Rating</p>
            </div>
          </div>

          {/* Floating Service Card */}
          <div className="absolute -bottom-7 -right-3 flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-4 shadow-xl sm:-right-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#243b53] text-white">
              <Wrench size={23} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#243b53]">
                Expert Technicians
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                <CheckCircle2 size={13} className="text-green-600" />
                Ready to help you
              </p>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-full border-[18px] border-[#d28b53]/20" />
        </div>
      </div>
    </section>
  );
};

export default Hero;