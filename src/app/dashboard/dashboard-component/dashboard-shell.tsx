"use client";

import React, { type ReactNode } from "react";

import { useSession } from "@/lib/auth-client";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import DashboardSidebar from "./dashboard-sidebar";

// ================= ROLE BADGE TONES =================

const ROLE_BADGE: Record<Role, string> = {
  customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  technician: "border-sky-200 bg-sky-50 text-sky-700",
  admin: "border-rose-200 bg-rose-50 text-rose-700",
};

// ================= DASHBOARD SHELL =================
// Shared layout for every dashboard route:
//   [ left sidebar | content (header + children) ]
// Sidebar links come from DASHBOARD_NAV (src/lib/dashboard-nav.ts).

type DashboardShellProps = {
  role: Role;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const DashboardShell = ({
  role,
  title,
  subtitle,
  children,
}: DashboardShellProps) => {
  const { data: session } = useSession();

  const firstName =
    session?.user?.name?.trim().split(" ")[0] || "there";

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* ============ SIDEBAR ============ */}
      <DashboardSidebar role={role} />

      {/* ============ CONTENT ============ */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1.5 text-sm font-bold text-[#d28b53]">
                Welcome back, {firstName}
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#243b53]">
                {title}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                {subtitle}
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full border px-4 py-2 text-xs font-bold capitalize ${ROLE_BADGE[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          </header>

          {/* Page content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
