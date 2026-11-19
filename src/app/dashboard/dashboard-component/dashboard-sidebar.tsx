"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROLE_LABELS, type Role } from "@/lib/roles";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";

// ================= DASHBOARD SIDEBAR =================
// Reads links from DASHBOARD_NAV (src/lib/dashboard-nav.ts).
// Desktop: sticky left sidebar. Mobile: horizontal chips.

type DashboardSidebarProps = {
  role: Role;
};

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role];

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-64 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-6 lg:flex">
        <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[2px] text-stone-400">
          Menu
        </p>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#243b53] text-white shadow-sm shadow-slate-900/10"
                    : "text-stone-600 hover:bg-[#faf9f6] hover:text-[#d28b53]"
                }`}
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Signed-in role */}
        <div className="mt-auto rounded-xl border border-stone-200 bg-[#faf9f6] px-3 py-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400">
            Signed in as
          </p>

          <p className="mt-1 text-sm font-extrabold capitalize text-[#243b53]">
            {ROLE_LABELS[role]}
          </p>
        </div>
      </aside>

      {/* ============ MOBILE NAV (horizontal chips) ============ */}
      <nav
        aria-label="Dashboard navigation"
        className="flex shrink-0 gap-2 overflow-x-auto border-b border-stone-200 bg-white px-5 py-3 lg:hidden"
      >
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                active
                  ? "bg-[#243b53] text-white"
                  : "border border-stone-200 bg-white text-stone-600"
              }`}
            >
              <item.icon size={14} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default DashboardSidebar;
