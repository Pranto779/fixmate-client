import React from "react";
import { Wrench } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= TECHNICIAN · MY SERVICES =================

const TechnicianMyServicesPage = () => {
  return (
    <DashboardShell
      role="technician"
      title="My Services"
      subtitle="Manage the services you offer — edit, pause or remove them."
    >
      <EmptyState
        icon={Wrench}
        title="No services yet"
        description="Services you create will be listed here for customers to book."
      />
    </DashboardShell>
  );
};

export default TechnicianMyServicesPage;
