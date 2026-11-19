import React from "react";
import { CalendarClock } from "lucide-react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import EmptyState from "@/components/dashboard/empty-state";

// ================= CUSTOMER · BOOKINGS =================

const CustomerBookingsPage = () => {
  return (
    <DashboardShell
      role="customer"
      title="Bookings"
      subtitle="All your scheduled repair appointments, past and upcoming."
    >
      <EmptyState
        icon={CalendarClock}
        title="No bookings yet"
        description="Book a service and your appointments will appear here."
      />
    </DashboardShell>
  );
};

export default CustomerBookingsPage;
