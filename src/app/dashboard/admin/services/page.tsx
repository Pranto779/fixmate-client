import React from "react";
import { Wrench } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= ADMIN · SERVICES =================

const AdminServicesPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Services"
      subtitle="All services listed across the platform by technicians."
    >
      <EmptyState
        icon={Wrench}
        title="No services found"
        description="Services created by technicians will appear here."
      />
    </DashboardShell>
  );
};

export default AdminServicesPage;
