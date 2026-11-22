import React, { Suspense } from "react";
import Link from "next/link";

import {
  Wrench,
  CheckCircle2,
  Clock,
  ClipboardList,
  ArrowUpRight,
  User,
  RefreshCw,
  BriefcaseBusiness,
  TrendingUp,
  Plus,
  CircleCheck,
  Mail,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  FilePlus2,
  ListChecks,
  Wallet,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import { ServerSession } from "@/serverapi";

import {
  getService,
  getTechnicianBookings,
  type Service,
} from "@/allapi";

// ================= TYPES =================

type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

interface Booking {
  _id: string;
  serviceTitle?: string;
  title?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  status: BookingStatus;
  basePrice?: number;
  finalAmount?: number;
  createdAt?: string;
}

// ================= THEME =================

const THEME = {
  background: "#faf9f6",
  navy: "#243b53",
  orange: "#d28b53",
  gray: "#718096",
  border: "#eee5dc",
  brown: "#8c6548",
};

// ================= HELPERS =================

const formatDate = (date?: string) => {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-blue-50 text-blue-700";

    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "in-progress":
      return "bg-indigo-50 text-indigo-700";

    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    requested: "Requested",
    accepted: "Accepted",
    rejected: "Rejected",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
};

// ================= DATA =================

async function getTechnicianOverviewData() {
  const session = await ServerSession();

  const email = session?.email;

  if (!email) {
    throw new Error("Technician session not found");
  }

  const [serviceData, bookingData] = await Promise.all([
    getService({ email }),
    getTechnicianBookings({ email }),
  ]);

  return {
    services: Array.isArray(serviceData)
      ? (serviceData as Service[])
      : [],

    bookings: Array.isArray(bookingData)
      ? (bookingData as Booking[])
      : [],

    technicianName: session?.name || "Technician",
    technicianEmail: email,
  };
}

// ================= CARD =================

function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 sm:p-5 ${className}`}
      style={{ borderColor: THEME.border }}
    >
      {children}
    </div>
  );
}

// ================= SECTION TITLE =================

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2
          className="text-base font-bold"
          style={{ color: THEME.navy }}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

// ================= DASHBOARD TABS =================

function DashboardTabs() {
  const tabs = [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
      active: false,
    },
    {
      label: "Requests",
      href: "/dashboard/technician/requests",
      icon: ListChecks,
      active: false,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: FilePlus2,
      active: false,
    },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-xl border bg-white p-2"
      style={{ borderColor: THEME.border }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
              tab.active
                ? "text-white shadow-sm"
                : "text-gray-600 hover:bg-[#faf9f6]"
            }`}
            style={
              tab.active
                ? { backgroundColor: THEME.navy }
                : undefined
            }
          >
            <Icon size={16} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

// ================= STATISTICS =================

function Statistics({
  services,
  bookings,
}: {
  services: Service[];
  bookings: Booking[];
}) {
  const approved = services.filter(
    (service) => service.approvalStatus === "accepted"
  ).length;

  const pending = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const items = [
    {
      label: "Total Services",
      value: services.length,
      icon: Wrench,
      color: "text-[#d28b53]",
      bg: "bg-[#f4e7db]",
    },
    {
      label: "Approved Services",
      value: approved,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Requests",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Completed Jobs",
      value: completed,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Earnings",
      value: "৳ 0.00",
      icon: Wallet,
      color: "text-[#d28b53]",
      bg: "bg-[#f4e7db]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-xl border bg-white p-4 transition hover:shadow-sm"
            style={{ borderColor: THEME.border }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-gray-500">
                {item.label}
              </p>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}
              >
                <Icon size={18} className={item.color} />
              </div>
            </div>

            <h3
              className="mt-3 text-2xl font-bold"
              style={{ color: THEME.navy }}
            >
              {item.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}

// ================= REQUEST OVERVIEW =================

function RequestOverview({
  bookings,
}: {
  bookings: Booking[];
}) {
  const items = [
    {
      label: "Requested",
      status: "requested",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Accepted",
      status: "accepted",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "In Progress",
      status: "in-progress",
      icon: RefreshCw,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Completed",
      status: "completed",
      icon: CircleCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <DashboardCard>
      <SectionTitle
        title="Request Overview"
        subtitle="Track your booking activities"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          const count = bookings.filter(
            (booking) => booking.status === item.status
          ).length;

          return (
            <div
              key={item.status}
              className="rounded-lg border border-[#eee5dc] bg-[#faf9f6] p-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}
                >
                  <Icon size={17} className={item.color} />
                </div>

                <span
                  className="text-xl font-bold"
                  style={{ color: THEME.navy }}
                >
                  {count}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-gray-600">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

// ================= RECENT REQUESTS =================

function RecentRequests({
  bookings,
}: {
  bookings: Booking[];
}) {
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  return (
    <DashboardCard>
      <SectionTitle
        title="Recent Requests"
        subtitle="Your latest customer activities"
        action={
          <Link
            href="/dashboard/technician/requests"
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: THEME.navy }}
          >
            View all
            <ArrowUpRight size={15} />
          </Link>
        }
      />

      {recentBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ClipboardList
            size={32}
            className="text-gray-400"
          />

          <h3 className="mt-2 text-sm font-semibold text-gray-700">
            No requests yet
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Your customer requests will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-left">
            <thead>
              <tr className="border-b border-[#eee5dc] text-[10px] uppercase tracking-wider text-gray-500">
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Service</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-[#f1ede8] last:border-0"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4e7db]">
                        <User
                          size={15}
                          style={{ color: THEME.brown }}
                        />
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        {booking.customerName || "Customer"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="text-xs text-gray-600">
                      {booking.serviceTitle ||
                        booking.title ||
                        "Service"}
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>

                  <td className="py-3 text-right text-xs text-gray-500">
                    {formatDate(booking.preferredDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}

// ================= TECHNICIAN PROFILE =================

function TechnicianProfile({
  name,
  email,
  services,
  bookings,
}: {
  name: string;
  email: string;
  services: Service[];
  bookings: Booking[];
}) {
  const approved = services.filter(
    (service) => service.approvalStatus === "accepted"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <DashboardCard>
      <SectionTitle
        title="My Profile"
        subtitle="Your technician information"
      />

      <div className="flex flex-col items-center rounded-xl bg-[#faf9f6] p-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: THEME.navy }}
        >
          <User size={27} />
        </div>

        <h3
          className="mt-3 text-base font-bold"
          style={{ color: THEME.navy }}
        >
          {name}
        </h3>

        <span className="mt-1 rounded-full bg-[#f4e7db] px-3 py-1 text-[10px] font-semibold text-[#8c6548]">
          Technician
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <Mail
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: THEME.orange }}
          />

          <div className="min-w-0">
            <p className="text-[10px] text-gray-500">
              Email Address
            </p>

            <p className="mt-0.5 break-all text-xs font-medium text-gray-700">
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck
            size={16}
            style={{ color: THEME.orange }}
          />

          <div>
            <p className="text-[10px] text-gray-500">
              Account Role
            </p>

            <p className="mt-0.5 text-xs font-medium text-gray-700">
              Service Technician
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 border-t border-[#eee5dc] pt-4">
        <div className="text-center">
          <p
            className="text-xl font-bold"
            style={{ color: THEME.navy }}
          >
            {services.length}
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            Services
          </p>
        </div>

        <div className="text-center">
          <p className="text-xl font-bold text-emerald-600">
            {approved}
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            Approved
          </p>
        </div>

        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">
            {completed}
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            Completed
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

// ================= SERVICE SUMMARY =================

function ServiceSummary({
  services,
}: {
  services: Service[];
}) {
  const items = [
    {
      label: "Approved",
      count: services.filter(
        (service) => service.approvalStatus === "accepted"
      ).length,
      color: "bg-emerald-500",
      text: "text-emerald-600",
    },
    {
      label: "Pending",
      count: services.filter(
        (service) => service.approvalStatus === "pending"
      ).length,
      color: "bg-amber-500",
      text: "text-amber-600",
    },
    {
      label: "Rejected",
      count: services.filter(
        (service) => service.approvalStatus === "cancelled"
      ).length,
      color: "bg-red-500",
      text: "text-red-600",
    },
  ];

  return (
    <DashboardCard>
      <SectionTitle
        title="My Services"
        subtitle="Service approval summary"
        action={
          <Link
            href="/dashboard/technician/my-services"
            className="text-xs font-semibold"
            style={{ color: THEME.navy }}
          >
            Manage
          </Link>
        }
      />

      <div className="mb-5 flex items-center justify-between rounded-lg bg-[#faf9f6] p-3">
        <div>
          <p className="text-xs text-gray-500">
            Total Services
          </p>

          <h3
            className="mt-1 text-xl font-bold"
            style={{ color: THEME.navy }}
          >
            {services.length}
          </h3>
        </div>

        <BriefcaseBusiness
          size={23}
          style={{ color: THEME.orange }}
        />
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage =
            services.length > 0
              ? (item.count / services.length) * 100
              : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  {item.label}
                </span>

                <span className={`text-xs font-bold ${item.text}`}>
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#eee5dc]">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/technician/my-services"
        className="mt-5 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold transition hover:bg-[#faf9f6]"
        style={{
          borderColor: THEME.border,
          color: THEME.navy,
        }}
      >
        View All Services
        <ArrowUpRight size={15} />
      </Link>
    </DashboardCard>
  );
}

// ================= QUICK INFORMATION =================

function QuickInformation() {
  const items = [
    {
      title: "Accept Requests",
      description: "Review customer details before accepting.",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Update Services",
      description: "Keep your service information updated.",
      icon: Settings,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Complete Jobs",
      description: "Update booking status after completing work.",
      icon: CircleCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <DashboardCard>
      <SectionTitle
        title="Quick Information"
        subtitle="Technician reminders"
      />

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
              >
                <Icon size={17} className={item.color} />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

// ================= BOTTOM BANNER =================

function DashboardBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-5 sm:p-6"
      style={{ backgroundColor: THEME.navy }}
    >
      <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-white/[0.04]" />

      <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full border-[25px] border-white/[0.04]" />

      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="max-w-lg">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Grow your service business with FixMate.
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/70">
            Add more services, manage your bookings and deliver
            better experiences to your customers.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: THEME.orange }}
        >
          Add Service
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ================= MAIN DASHBOARD =================

async function TechnicianOverviewContent() {
  const {
    services,
    bookings,
    technicianName,
    technicianEmail,
  } = await getTechnicianOverviewData();

  return (
    <DashboardShell
      role="technician"
      title="Overview"
      subtitle="Manage your bookings, track your work and monitor your service activities."
    >
      <div
        className="space-y-4 rounded-xl p-2 sm:p-3"
        style={{ backgroundColor: THEME.background }}
      >
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1
              className="text-xl font-bold sm:text-2xl"
              style={{ color: THEME.navy }}
            >
              Welcome, {technicianName}!
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Here's what's happening with your business.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: THEME.navy }}
          >
            <Plus size={16} />
            Add New Service
          </Link>
        </div>

        {/* DASHBOARD TABS */}

        <DashboardTabs />

        {/* STATISTICS */}

        <Statistics
          services={services}
          bookings={bookings}
        />

        {/* REQUEST OVERVIEW */}

        <RequestOverview bookings={bookings} />

        {/* RECENT REQUESTS + PROFILE */}

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <RecentRequests bookings={bookings} />
          </div>

          <TechnicianProfile
            name={technicianName}
            email={technicianEmail}
            services={services}
            bookings={bookings}
          />
        </div>

        {/* SERVICE SUMMARY + QUICK INFORMATION */}

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <ServiceSummary services={services} />

          <QuickInformation />
        </div>

        {/* BANNER */}

        <DashboardBanner />
      </div>
    </DashboardShell>
  );
}

// ================= LOADING =================

function TechnicianOverviewLoading() {
  return (
    <DashboardShell
      role="technician"
      title="Overview"
      subtitle="Loading your dashboard..."
    >
      <div
        className="space-y-4 rounded-xl p-3"
        style={{ backgroundColor: THEME.background }}
      >
        <div className="h-16 animate-pulse rounded-xl bg-white" />

        <div className="h-14 animate-pulse rounded-xl bg-white" />

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>

        <div className="h-40 animate-pulse rounded-xl bg-white" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-xl bg-white lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    </DashboardShell>
  );
}

// ================= PAGE =================

export default function TechnicianOverviewPage() {
  return (
    <Suspense fallback={<TechnicianOverviewLoading />}>
      <TechnicianOverviewContent />
    </Suspense>
  );
}