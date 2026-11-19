// Single source of truth for role → dashboard routing.
// Navbar, /dashboard redirector, and role pages all use this.

export type Role = "customer" | "technician" | "admin";

export const DASHBOARD_PATHS: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export function isRole(value: unknown): value is Role {
  return (
    value === "customer" ||
    value === "technician" ||
    value === "admin"
  );
}

/** Dashboard path for a role; falls back to the customer dashboard. */
export function dashboardPathFor(role: unknown): string {
  return isRole(role) ? DASHBOARD_PATHS[role] : DASHBOARD_PATHS.customer;
}
