import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarClock,
  CreditCard,
  PlusCircle,
  Wrench,
  Inbox,
  Users,
  CalendarCheck,
  Banknote,
} from "lucide-react";

import type { Role } from "./roles";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// ============================================================
// 🔧 SIDEBAR LINKS — customize here
//
// Add / remove / rename links for any role below. Each href
// must match a page file under:
//   src/app/dashboard/<role>/<page>/page.tsx
// ============================================================

export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "Bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarClock,
    },
    {
      label: "Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],

  technician: [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Requests",
      href: "/dashboard/technician/requests",
      icon: Inbox,
    },
  ],

  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Services",
      href: "/dashboard/admin/services",
      icon: Wrench,
    },
    {
      label: "Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Banknote,
    },
  ],
};
