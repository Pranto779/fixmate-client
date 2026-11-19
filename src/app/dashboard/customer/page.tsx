import React from "react";
import {
  Wrench,
  CheckCircle2,
  MapPin,
  CalendarClock,
} from "lucide-react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import StatCard from "@/components/dashboard/stat-card";
import ListCard, { type ListItem } from "@/components/dashboard/list-card";

// ================= DUMMY DATA =================
// Replace with real API data later — the shell stays the same.

const recentRequests: ListItem[] = [
  {
    id: "REQ-1042",
    title: "AC not cooling properly",
    meta: "14 Nov 2026",
    badge: "In Progress",
    badgeTone: "warning",
  },
  {
    id: "REQ-1038",
    title: "Washing machine drum noise",
    meta: "09 Nov 2026",
    badge: "Completed",
    badgeTone: "success",
  },
  {
    id: "REQ-1031",
    title: "Refrigerator gas refill",
    meta: "02 Nov 2026",
    badge: "Completed",
    badgeTone: "success",
  },
  {
    id: "REQ-1027",
    title: "Microwave not heating",
    meta: "28 Oct 2026",
    badge: "Cancelled",
    badgeTone: "danger",
  },
];

// ================= CUSTOMER DASHBOARD =================

const CustomerDashboardPage = () => {
  return (
    <DashboardShell
      role="customer"
      title="Customer Dashboard"
      subtitle="Track your repair requests, appointments and saved addresses — all in one place."
    >
      {/* ============ STATS ============ */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Wrench}
          label="Active Requests"
          value="3"
          hint="1 new this week"
          tone="tan"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed Repairs"
          value="12"
          tone="emerald"
        />

        <StatCard
          icon={MapPin}
          label="Saved Addresses"
          value="2"
          tone="navy"
        />
      </div>

      {/* ============ NEXT APPOINTMENT ============ */}
      <div className="mt-6">
        <StatCard
          icon={CalendarClock}
          label="Next Appointment — AC servicing, Dhanmondi"
          value="Tomorrow · 2:00 PM"
          hint="Technician assigned"
          tone="sky"
        />
      </div>

      {/* ============ RECENT REQUESTS ============ */}
      <div className="mt-6">
        <ListCard title="Recent Requests" items={recentRequests} />
      </div>
    </DashboardShell>
  );
};

export default CustomerDashboardPage;
