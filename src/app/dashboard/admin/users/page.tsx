import React from "react";
import { Users } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= ADMIN · USERS =================

const AdminUsersPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Users"
      subtitle="All customers and technicians registered on FixMate."
    >
      <EmptyState
        icon={Users}
        title="No users found"
        description="Registered users will appear here with their role and status."
      />
    </DashboardShell>
  );
};

export default AdminUsersPage;
