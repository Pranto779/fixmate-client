import React from "react";
import { CalendarCheck } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= ADMIN · BOOKINGS =================

const AdminBookingsPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Bookings"
      subtitle="Every booking made on the platform, with its live status."
    >
      <EmptyState
        icon={CalendarCheck}
        title="No bookings found"
        description="Customer bookings will appear here for you to monitor."
      />
    </DashboardShell>
  );
};

export default AdminBookingsPage;
