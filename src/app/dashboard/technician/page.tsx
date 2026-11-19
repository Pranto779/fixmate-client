import React from "react";
import {
  ClipboardList,
  CheckCircle2,
  Star,
  Wallet,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import StatCard from "@/components/dashboard/stat-card";
import ListCard, { type ListItem } from "@/components/dashboard/list-card";

// ================= DUMMY DATA =================
// Replace with real API data later — the shell stays the same.

const upcomingJobs: ListItem[] = [
  {
    id: "JOB-512",
    title: "AC servicing · Dhanmondi",
    meta: "Today · 2:00 PM",
    badge: "Assigned",
    badgeTone: "warning",
  },
  {
    id: "JOB-509",
    title: "Fridge cooling issue · Mirpur",
    meta: "Tomorrow · 10:30 AM",
    badge: "Scheduled",
    badgeTone: "default",
  },
  {
    id: "JOB-504",
    title: "Washing machine repair · Uttara",
    meta: "20 Nov · 4:00 PM",
    badge: "Scheduled",
    badgeTone: "default",
  },
  {
    id: "JOB-501",
    title: "Microwave repair · Gulshan",
    meta: "17 Nov 2026",
    badge: "Completed",
    badgeTone: "success",
  },
];

// ================= TECHNICIAN DASHBOARD =================

const TechnicianDashboardPage = () => {
  return (
    <DashboardShell
      role="technician"
      title="Technician Dashboard"
      subtitle="Manage your assigned jobs, track earnings and keep your rating strong."
    >
      {/* ============ STATS ============ */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Assigned Jobs"
          value="5"
          hint="1 due today"
          tone="tan"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed Jobs"
          value="28"
          tone="emerald"
        />

        <StatCard
          icon={Star}
          label="Average Rating"
          value="4.8"
          hint="32 reviews"
          tone="sky"
        />

        <StatCard
          icon={Wallet}
          label="Earnings This Month"
          value="৳ 24,500"
          tone="navy"
        />
      </div>

      {/* ============ JOBS ============ */}
      <div className="mt-6">
        <ListCard title="My Jobs" items={upcomingJobs} />
      </div>
    </DashboardShell>
  );
};

export default TechnicianDashboardPage;
