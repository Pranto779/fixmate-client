"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  Mail,
  ShieldCheck,
  Trash2,
  Ban,
  UserCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, updateUserRole } from "@/allapi";

type UserRole = "admin" | "customer" | "technician";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: UserRole;
}

interface Props {
  users: User[];
}

const AdminUsersList = ({ users }: Props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [suspendedUsers, setSuspendedUsers] = useState<string[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole>>({});

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [pendingRoleChange, setPendingRoleChange] = useState<{
    id: string;
    role: UserRole;
    name: string;
  } | null>(null);

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const tabs = [
    { label: "All Users", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Customer", value: "customer" },
    { label: "Technician", value: "technician" },
  ];

  const availableUsers = users
    .filter((user) => !deletedUsers.includes(user._id))
    .map((user) => ({
      ...user,
      role: userRoles[user._id] || user.role || "customer",
    }));

  // Admin users always appear first
  const sortedUsers = [...availableUsers].sort((a, b) => {
    if (a.role.toLowerCase() === "admin") return -1;
    if (b.role.toLowerCase() === "admin") return 1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      activeTab === "all" ||
      user.role.toLowerCase() === activeTab
  );

  // Suspend / Activate
  const handleSuspend = (id: string) => {
    setSuspendedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };

  // Open Delete Confirmation Modal
  const handleDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
  };

  // Confirm Delete User
  const confirmDelete = async () => {
    if (!pendingDelete || deletingId) return;

    const id = pendingDelete.id;

    try {
      setDeletingId(id);

      await deleteUser({ id });

      setDeletedUsers((prev) => [...prev, id]);
      setPendingDelete(null);

      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Delete user error:", error);

      toast.error("Failed to delete user. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Open Role Confirmation Modal
  const handleRoleChange = (
    id: string,
    role: UserRole,
    name: string
  ) => {
    const currentUser = availableUsers.find(
      (user) => user._id === id
    );

    if (!currentUser) return;

    if (currentUser.role.toLowerCase() === role.toLowerCase()) {
      return;
    }

    setPendingRoleChange({
      id,
      role,
      name,
    });
  };

  // Confirm Role Change API
  const confirmRoleChange = async () => {
    if (!pendingRoleChange || loading) return;

    try {
      setLoading(true);

      await updateUserRole({
        id: pendingRoleChange.id,
        role: pendingRoleChange.role,
      });

      setUserRoles((prev) => ({
        ...prev,
        [pendingRoleChange.id]: pendingRoleChange.role,
      }));

      setPendingRoleChange(null);

      toast.success("User role updated successfully!");
    } catch (error) {
      console.error("Role update error:", error);

      toast.error("Failed to update user role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: "Admin", value: "admin" },
    { label: "Technician", value: "technician" },
    { label: "Customer", value: "customer" },
  ];

  return (
    <div className="w-full min-w-0 space-y-5">

      {/* Total Users */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div>
          <p className="text-sm font-medium text-stone-500">
            Total Registered Users
          </p>

          <h2 className="mt-1 text-3xl font-extrabold text-[#243b53]">
            {availableUsers.length}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#243b53]/10 text-[#243b53] sm:h-14 sm:w-14">
          <Users size={26} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-2">
        {tabs.map((tab) => {
          const count =
            tab.value === "all"
              ? availableUsers.length
              : availableUsers.filter(
                  (user) => user.role.toLowerCase() === tab.value
                ).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition sm:px-5 sm:py-3 sm:text-sm ${
                activeTab === tab.value
                  ? "bg-[#243b53] text-white shadow-md"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              {tab.label}

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  activeTab === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

        <div className="flex items-center justify-between gap-3 border-b border-stone-100 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-[#243b53] sm:text-lg">
              User Management
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Manage your platform users and their access.
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-[#243b53]/10 px-3 py-2 text-xs font-bold text-[#243b53]">
            {filteredUsers.length} Users
          </span>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="w-full">

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full table-fixed text-left">

                <thead className="bg-stone-50">
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    <th className="w-[19%] px-3 py-4 xl:px-4">User</th>
                    <th className="w-[20%] px-3 py-4 xl:px-4">Email</th>
                    <th className="w-[12%] px-3 py-4 xl:px-4">Role</th>
                    <th className="w-[27%] px-3 py-4 xl:px-4">Update Role</th>
                    <th className="w-[10%] px-3 py-4 xl:px-4">Status</th>
                    <th className="w-[12%] px-3 py-4 text-center xl:px-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((user) => {
                    const isSuspended = suspendedUsers.includes(user._id);

                    return (
                      <tr
                        key={user._id}
                        className={`transition hover:bg-stone-50/80 ${
                          user.role.toLowerCase() === "admin"
                            ? "bg-[#243b53]/[0.03]"
                            : ""
                        }`}
                      >
                        {/* User */}
                        <td className="px-3 py-4 xl:px-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-[#e4a878] bg-[#243b53]">
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt={user.name || "User"}
                                  fill
                                  unoptimized
                                  sizes="36px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#243b53]">
                                {user.name || "Unknown User"}
                              </p>
                              <p className="truncate text-[10px] text-stone-400">
                                ID: {user._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-3 py-4 xl:px-4">
                          <div className="flex min-w-0 items-center gap-1.5 text-xs text-stone-500">
                            <Mail size={13} className="shrink-0 text-[#d28b53]" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </td>

                        {/* Current Role */}
                        <td className="px-3 py-4 xl:px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#243b53]/10 px-2 py-1.5 text-[10px] font-bold capitalize text-[#243b53]">
                            <ShieldCheck size={12} />
                            {user.role}
                          </span>
                        </td>

                        {/* Update Role */}
                        <td className="px-3 py-4 xl:px-4">
                          <div className="flex flex-wrap gap-1 rounded-lg bg-stone-50 p-1">
                            {roleOptions.map((role) => (
                              <button
                                key={role.value}
                                onClick={() =>
                                  handleRoleChange(
                                    user._id,
                                    role.value,
                                    user.name
                                  )
                                }
                                className={`rounded-md px-2 py-2 text-[10px] font-bold transition ${
                                  user.role.toLowerCase() === role.value
                                    ? "bg-[#243b53] text-white shadow-sm"
                                    : "text-stone-500 hover:bg-stone-200"
                                }`}
                              >
                                {role.label}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-4 xl:px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-bold ${
                              isSuspended
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isSuspended ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                            {isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4 xl:px-4">
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            <button
                              onClick={() => handleSuspend(user._id)}
                              title={isSuspended ? "Activate User" : "Suspend User"}
                              className={`rounded-lg p-2 transition ${
                                isSuspended
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }`}
                            >
                              {isSuspended ? (
                                <UserCheck size={15} />
                              ) : (
                                <Ban size={15} />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(user._id, user.name)
                              }
                              disabled={deletingId === user._id}
                              title="Delete User"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              {deletingId === user._id ? (
                                <span className="block h-[15px] w-[15px] animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:hidden">
              {filteredUsers.map((user) => {
                const isSuspended = suspendedUsers.includes(user._id);

                return (
                  <div
                    key={user._id}
                    className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    {/* Profile */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#e4a878] bg-[#243b53]">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            fill
                            unoptimized
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-bold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#243b53]">
                          {user.name || "Unknown User"}
                        </p>
                        <p className="truncate text-xs text-stone-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Role and Status */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#243b53]/10 px-2.5 py-1.5 text-xs font-bold capitalize text-[#243b53]">
                        <ShieldCheck size={12} />
                        {user.role}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1.5 text-xs font-bold ${
                          isSuspended
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </div>

                    {/* Update Role */}
                    <div className="mt-4 border-t border-stone-100 pt-3">
                      <p className="mb-2 text-xs font-bold text-stone-500">
                        Update Role
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {roleOptions.map((role) => (
                          <button
                            key={role.value}
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                role.value,
                                user.name
                              )
                            }
                            className={`rounded-md px-2.5 py-2 text-[10px] font-bold transition ${
                              user.role.toLowerCase() === role.value
                                ? "bg-[#243b53] text-white"
                                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                            }`}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2 border-t border-stone-100 pt-3">
                      <button
                        onClick={() => handleSuspend(user._id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                          isSuspended
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {isSuspended ? (
                          <UserCheck size={14} />
                        ) : (
                          <Ban size={14} />
                        )}
                        {isSuspended ? "Activate" : "Suspend"}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user._id, user.name)
                        }
                        disabled={deletingId === user._id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === user._id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="py-16 text-center">
            <Users size={38} className="mx-auto mb-3 text-[#d28b53]" />

            <h3 className="text-lg font-bold capitalize text-[#243b53]">
              No {activeTab === "all" ? "" : activeTab} users found
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Users with this role will appear here.
            </p>
          </div>
        )}

      </div>

      {/* Role Change Confirmation Modal */}
      {pendingRoleChange && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !loading && setPendingRoleChange(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle size={25} />
              </div>

              <button
                disabled={loading}
                onClick={() => setPendingRoleChange(null)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-[#243b53]">
              Confirm Role Change
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Are you sure you want to change{" "}
              <span className="font-bold text-[#243b53]">
                {pendingRoleChange.name}
              </span>
              &apos;s role to{" "}
              <span className="font-bold capitalize text-[#d28b53]">
                {pendingRoleChange.role}
              </span>
              ?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                disabled={loading}
                onClick={() => setPendingRoleChange(null)}
                className="flex-1 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={confirmRoleChange}
                className="flex-1 rounded-lg bg-[#243b53] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1b3045] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !deletingId && setPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={25} />
              </div>

              <button
                disabled={!!deletingId}
                onClick={() => setPendingDelete(null)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-[#243b53]">
              Delete User?
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#243b53]">
                {pendingDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                disabled={!!deletingId}
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={!!deletingId}
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
