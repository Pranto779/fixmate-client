import React from "react";
import { CreditCard } from "lucide-react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import EmptyState from "@/components/dashboard/empty-state";

// ================= CUSTOMER · PAYMENTS =================

const CustomerPaymentsPage = () => {
  return (
    <DashboardShell
      role="customer"
      title="Payments"
      subtitle="Invoices, payment history and your saved payment methods."
    >
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Once you pay for a service, receipts will show up here."
      />
    </DashboardShell>
  );
};

export default CustomerPaymentsPage;
