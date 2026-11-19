import React from "react";
import {
  Users,
  Wrench,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import StatCard from "@/app/dashboard/dashboard-component/stat-card";
import ListCard, { type ListItem } from "@/app/dashboard/dashboard-component/list-card";

// ================= DUMMY DATA =================
// Replace with real API data later — the shell stays the same.

const recentUsers: ListItem[] = [
  {
    id: "USR-2210",
    title: "Nusrat Jahan",
    meta: "Joined 18 Nov 2026",
    badge: "Customer",
    badgeTone: "default",
  },
  {
    id: "USR-2208",
    title: "Rakib Hasan",
    meta: "Joined 17 Nov 2026",
    badge: "Technician",
    badgeTone: "success",
  },
  {
    id: "USR-2205",
    title: "Sumaiya Akter",
    meta: "Joined 16 Nov 2026",
    badge: "Customer",
    badgeTone: "default",
  },
  {
    id: "USR-2201",
    title: "Imran Kabir",
    meta: "Awaiting role approval",
    badge: "Pending",
    badgeTone: "warning",
  },
];

const pendingJobs: ListItem[] = [
  {
    id: "JOB-518",
    title: "Deep freezer repair · Mohammadpur",
    meta: "Requested 18 Nov 2026",
    badge: "Unassigned",
    badgeTone: "warning",
  },
  {
    id: "JOB-515",
    title: "TV wall mounting · Banani",
    meta: "Requested 17 Nov 2026",
    badge: "Unassigned",
    badgeTone: "warning",
  },
];

// ================= ADMIN DASHBOARD =================

const AdminDashboardPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Admin Dashboard"
      subtitle="Overview of users, technicians and jobs across the FixMate platform."
    >
      {/* ============ STATS ============ */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value="1,284"
          hint="+32 this week"
          tone="navy"
        />

        <StatCard
          icon={Wrench}
          label="Active Technicians"
          value="48"
          hint="3 pending"
          tone="tan"
        />

        <StatCard
          icon={Briefcase}
          label="Jobs This Month"
          value="316"
          tone="sky"
        />

        <StatCard
          icon={ShieldCheck}
          label="Resolved Rate"
          value="94%"
          tone="emerald"
        />
      </div>

      {/* ============ LISTS ============ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ListCard title="Recent Users" items={recentUsers} />

        <ListCard
          title="Jobs Needing Attention"
          items={pendingJobs}
          emptyText="All jobs are assigned."
        />
      </div>
    </DashboardShell>
  );
};

export default AdminDashboardPage;
