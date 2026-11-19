import React from "react";
import { Inbox } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= TECHNICIAN · REQUESTS =================

const TechnicianRequestsPage = () => {
  return (
    <DashboardShell
      role="technician"
      title="Requests"
      subtitle="Booking requests from customers waiting for your response."
    >
      <EmptyState
        icon={Inbox}
        title="No pending requests"
        description="New customer requests will appear here for you to accept or decline."
      />
    </DashboardShell>
  );
};

export default TechnicianRequestsPage;
