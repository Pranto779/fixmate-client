import React, { Suspense } from "react";
import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import { AllUser } from "@/allapi";
import AdminUsersList from "./admin-users-list";

const UsersData = async () => {
  const users = await AllUser();

  return (
    <AdminUsersList users={Array.isArray(users) ? users : []} />
  );
};

const UsersLoading = () => {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-52 min-w-[320px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </div>
  );
};

const AdminUsersPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Users"
      subtitle="Manage all customers, technicians and administrators on FixMate."
    >
      <Suspense fallback={<UsersLoading />}>
        <UsersData />
      </Suspense>
    </DashboardShell>
  );
};

export default AdminUsersPage;