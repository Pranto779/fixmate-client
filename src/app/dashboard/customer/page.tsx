import React, { Suspense } from "react";
import {
  Wrench,
  CheckCircle2,
  Clock,
  CalendarClock,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import StatCard from "@/app/dashboard/dashboard-component/stat-card";
import ListCard, {
  type ListItem,
} from "@/app/dashboard/dashboard-component/list-card";

import { ServerSession } from "@/serverapi";
import { connection } from "next/server";
import { getBookingEmail } from "@/allapi";

interface Booking {
  _id: string;
  title?: string;
  serviceTitle?: string;
  image?: string;
  serviceImage?: string;
  technicianName?: string;
  technicianEmail?: string;
  preferredDate?: string | Date;
  status: string;
  finalAmount?: number;
  paymentStatus?: string;
}

const CustomerDashboardContent = async () => {
  await connection();

  const user = await ServerSession();
  const email = user?.email;

  let bookings: Booking[] = [];

  try {
    if (email) {
      const response = await getBookingEmail({ email });

      bookings = Array.isArray(response) ? response : [];
    }
  } catch (error) {
    console.error("Customer Dashboard Booking Error:", error);
  }

  // ================= BOOKING STATISTICS =================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter((booking) =>
    ["pending", "requested"].includes(
      booking.status?.toLowerCase()
    )
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed"
  ).length;

  const activeBookings = bookings.filter((booking) =>
    ["accepted", "approved", "in-progress"].includes(
      booking.status?.toLowerCase()
    )
  ).length;

  // ================= UPCOMING APPOINTMENT =================

  const now = new Date();

  const upcomingBookings = bookings
    .filter((booking) => {
      const date = new Date(booking.preferredDate || "");

      return (
        ["accepted", "approved", "in-progress"].includes(
          booking.status?.toLowerCase()
        ) &&
        !isNaN(date.getTime()) &&
        date >= now
      );
    })
    .sort(
      (a, b) =>
        new Date(a.preferredDate!).getTime() -
        new Date(b.preferredDate!).getTime()
    );

  const nextAppointment = upcomingBookings[0];

  // ================= RECENT BOOKINGS =================

  const recentBookings: ListItem[] = [...bookings]
    .sort((a, b) => {
      const dateA = new Date(a.preferredDate || 0).getTime();
      const dateB = new Date(b.preferredDate || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 4)
    .map((booking) => {
      const statusConfig: Record<
        string,
        {
          label: string;
          tone: ListItem["badgeTone"];
        }
      > = {
        pending: {
          label: "Pending",
          tone: "warning",
        },
        requested: {
          label: "Requested",
          tone: "warning",
        },
        accepted: {
          label: "Accepted",
          tone: "success",
        },
        approved: {
          label: "Approved",
          tone: "success",
        },
        "in-progress": {
          label: "In Progress",
          tone: "warning",
        },
        completed: {
          label: "Completed",
          tone: "success",
        },
        rejected: {
          label: "Rejected",
          tone: "danger",
        },
        cancelled: {
          label: "Cancelled",
          tone: "danger",
        },
      };

      const currentStatus =
        booking.status?.toLowerCase() || "pending";

      const status = statusConfig[currentStatus] || {
        label: currentStatus,
        tone: "warning" as const,
      };

      const date = booking.preferredDate
        ? new Date(booking.preferredDate).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )
        : "Date not available";

      return {
        id: booking._id,
        title:
          booking.title ||
          booking.serviceTitle ||
          "Service Booking",
        meta: date,
        badge: status.label,
        badgeTone: status.tone,
      };
    });

  // ================= APPOINTMENT DATE =================

  const appointmentDate = nextAppointment?.preferredDate
    ? new Date(nextAppointment.preferredDate)
    : null;

  const formattedAppointment =
    appointmentDate && !isNaN(appointmentDate.getTime())
      ? appointmentDate.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "No upcoming appointment";

  // ================= UI =================

  return (
    <DashboardShell
      role="customer"
      title="Customer Dashboard"
      subtitle="Track your service bookings, manage appointments and monitor your requests."
    >
      {/* STATS */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Wrench}
          label="Total Bookings"
          value={String(totalBookings)}
          hint="All your service bookings"
          tone="tan"
        />

        <StatCard
          icon={Clock}
          label="Active Bookings"
          value={String(activeBookings + pendingBookings)}
          hint="Pending and ongoing bookings"
          tone="sky"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed Bookings"
          value={String(completedBookings)}
          hint="Successfully completed"
          tone="emerald"
        />
      </div>

      {/* NEXT APPOINTMENT */}

      <div className="mt-6">
        <StatCard
          icon={CalendarClock}
          label={
            nextAppointment
              ? `Next Appointment — ${
                  nextAppointment.title ||
                  nextAppointment.serviceTitle ||
                  "Service"
                }`
              : "Next Appointment"
          }
          value={formattedAppointment}
          hint={
            nextAppointment
              ? `Technician: ${
                  nextAppointment.technicianName ||
                  "Assigned Technician"
                }`
              : "You have no upcoming appointments"
          }
          tone="sky"
        />
      </div>

      {/* RECENT BOOKINGS */}

      <div className="mt-6">
        <ListCard
          title="Recent Bookings"
          items={recentBookings}
        />
      </div>
    </DashboardShell>
  );
};

// ================= LOADING SKELETON =================

const DashboardLoading = () => {
  return (
    <DashboardShell
      role="customer"
      title="Customer Dashboard"
      subtitle="Track your service bookings, manage appointments and monitor your requests."
    >
      <div className="animate-pulse space-y-6">
        {/* Stats Skeleton */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5"
            />
          ))}
        </div>

        {/* Appointment Skeleton */}

        <div className="h-32 rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5" />

        {/* Recent Bookings Skeleton */}

        <div className="h-64 rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5" />
      </div>
    </DashboardShell>
  );
};

// ================= MAIN PAGE =================

const CustomerDashboardPage = () => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <CustomerDashboardContent />
    </Suspense>
  );
};

export default CustomerDashboardPage;