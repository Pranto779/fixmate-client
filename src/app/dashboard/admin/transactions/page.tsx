import React from "react";
import { Banknote } from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

// ================= ADMIN · TRANSACTIONS =================

const AdminTransactionsPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Transactions"
      subtitle="Payments and payouts across the FixMate platform."
    >
      <EmptyState
        icon={Banknote}
        title="No transactions yet"
        description="Platform transactions will appear here with amount and status."
      />
    </DashboardShell>
  );
};

export default AdminTransactionsPage;
