import React from "react";
import { PlusCircle } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= TECHNICIAN · ADD SERVICE =================

const TechnicianAddServicePage = () => {
  return (
    <DashboardShell
      role="technician"
      title="Add Service"
      subtitle="Create a new service listing that customers can book."
    >
      <EmptyState
        icon={PlusCircle}
        title="Create your first service"
        description="Add the service details, pricing and duration here to start receiving booking requests."
      />
    </DashboardShell>
  );
};

export default TechnicianAddServicePage;
