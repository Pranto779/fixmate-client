"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  Wrench,
  Mail,
  User,
  Tag,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
  RefreshCw,
  ArrowRight,
  FileText,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  DollarSign,
} from "lucide-react";

import { toast } from "sonner";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

import {
  getallServices,
  UpdateServiceStatus,
  getPendingServiceUpdates,
  reviewServiceUpdate,
} from "@/allapi";

// ================= TYPES =================

interface Service {
  _id: string;
  title?: string;
  name?: string;
  image?: string;
  category?: string;
  description?: string;
  technicianName?: string;
  technicianEmail?: string;
  basePrice?: number;
  serviceArea?: string;
  estimatedDuration?: string;
  isAvailable?: boolean;
  approvalStatus?: "pending" | "accepted" | "cancelled";

  hasPendingUpdate?: boolean;
  pendingUpdates?: Partial<Service>;
}

// ================= STATUS STYLE =================

const getStatusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

// ================= STATUS ICON =================

const getStatusIcon = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return <CheckCircle2 size={14} />;

    case "cancelled":
      return <XCircle size={14} />;

    default:
      return <Clock size={14} />;
  }
};

// ================= SKELETON =================

const ServicesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="flex w-28 shrink-0 items-center justify-center bg-slate-100 p-2 sm:w-40">
            <div className="h-24 w-full rounded-xl bg-slate-200" />
          </div>

          <div className="flex-1 space-y-3 p-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-3 w-52 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-200" />
            <div className="h-8 w-28 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ================= UPDATE FIELD LABELS =================

const updateFieldLabels: Record<string, string> = {
  title: "Service Title",
  category: "Category",
  basePrice: "Price",
  description: "Description",
  image: "Service Image",
  serviceArea: "Location",
  estimatedDuration: "Duration",
  isAvailable: "Availability",
};

// ================= FORMAT VALUE =================

const formatValue = (field: string, value: unknown) => {
  if (field === "isAvailable") {
    return value ? "Available" : "Unavailable";
  }

  if (field === "basePrice") {
    return `$ ${value ?? 0}`;
  }

  return String(value ?? "Not provided");
};

// ================= ADMIN SERVICES PAGE =================

const AdminServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // ================= FETCH SERVICES =================

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const [servicesData, pendingData] = await Promise.all([
        getallServices(),
        getPendingServiceUpdates(),
      ]);

      setServices(Array.isArray(servicesData) ? servicesData : []);

      setPendingUpdates(Array.isArray(pendingData) ? pendingData : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ================= UPDATE SERVICE STATUS =================

  const handleStatusChange = async (
    id: string,
    approvalStatus: "accepted" | "cancelled"
  ) => {
    try {
      setUpdatingId(id);

      const result = await UpdateServiceStatus({
        id,
        approvalStatus,
      });

      if (!result.success) {
        throw new Error(result.message || "Status update failed");
      }

      setServices((previousServices) =>
        previousServices.map((service) =>
          service._id === id
            ? {
                ...service,
                approvalStatus,
              }
            : service
        )
      );

      toast.success(
        approvalStatus === "accepted"
          ? "Service accepted successfully!"
          : "Service cancelled successfully!"
      );
    } catch (err) {
      console.error("Status Update Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update service status!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= APPROVE / REJECT UPDATE =================

  const handleReviewUpdate = async (
    service: Service,
    action: "approve" | "reject"
  ) => {
    try {
      setReviewingId(service._id);

      const result = await reviewServiceUpdate({
        id: service._id,
        action,
      });

      if (!result.success) {
        throw new Error(result.message || "Review failed");
      }

      // Remove from pending updates
      setPendingUpdates((previous) =>
        previous.filter((item) => item._id !== service._id)
      );

      // If approved, update the main service UI
      if (action === "approve") {
        setServices((previous) =>
          previous.map((item) =>
            item._id === service._id
              ? {
                  ...item,
                  ...service.pendingUpdates,
                  approvalStatus: "accepted",
                  hasPendingUpdate: false,
                  pendingUpdates: undefined,
                }
              : item
          )
        );

        toast.success("Service changes approved successfully!");
      } else {
        toast.success("Service changes rejected successfully!");
      }
    } catch (err) {
      console.error("Review Update Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to review service update!"
      );
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <DashboardShell
      role="admin"
      title="Services"
      subtitle="Manage technician services and review submitted changes."
    >
      <div className="space-y-7">

        {/* ================= PENDING UPDATE SECTION ================= */}

        {!loading && pendingUpdates.length > 0 && (
          <section className="space-y-4">

            {/* SECTION HEADER */}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <RefreshCw size={17} />
                  </div>

                  <h2 className="text-base font-bold text-[#243b53]">
                    Pending Update Requests
                  </h2>

                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                    {pendingUpdates.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Review changes submitted by technicians before they go live.
                </p>
              </div>
            </div>

            {/* PENDING CARDS */}

            {pendingUpdates.map((service) => {
              const title =
                service.title || service.name || "Untitled Service";

              const changes = Object.entries(
                service.pendingUpdates || {}
              ).filter(
                ([field, value]) =>
                  field in updateFieldLabels && value !== undefined
              );

              const isReviewing = reviewingId === service._id;

              return (
                <div
                  key={service._id}
                  className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm"
                >
                  {/* CARD HEADER */}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-600" />

                      <span className="text-xs font-bold text-amber-800">
                        Waiting for Admin Approval
                      </span>
                    </div>

                    <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[9px] font-bold text-amber-700">
                      {changes.length} Changes
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">

                    {/* SERVICE INFO */}

                    <div className="flex flex-col gap-4 sm:flex-row">

                      {/* IMAGE */}

                      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-36">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={title}
                            fill
                            unoptimized
                            sizes="144px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <Wrench size={30} />
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-[#243b53]">
                          {title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Tag size={13} />
                            {service.category || "Uncategorized"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <User size={13} />
                            {service.technicianName || "Unknown Technician"}
                          </span>
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 break-all text-xs text-slate-500">
                          <Mail size={13} className="shrink-0" />
                          {service.technicianEmail || "No email"}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          Current Status:{" "}
                          <span className="font-bold capitalize text-emerald-700">
                            {service.approvalStatus || "pending"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* CHANGES COMPARISON */}

                    <div className="mt-5">
                      <div className="mb-3 flex items-center gap-2">
                        <FileText
                          size={16}
                          className="text-[#d28b53]"
                        />

                        <h4 className="text-sm font-bold text-[#243b53]">
                          Review Changes
                        </h4>
                      </div>

                      {changes.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          {/* TABLE HEADER */}

                          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
                            <div className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:px-4">
                              Previous Information
                            </div>

                            <div className="border-l border-slate-200 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 sm:px-4">
                              New Information
                            </div>
                          </div>

                          {/* CHANGED FIELDS */}

                          {changes.map(([field, newValue]) => {
                            const oldValue = service[
                              field as keyof Service
                            ];

                            return (
                              <div
                                key={field}
                                className="grid grid-cols-2 border-b border-slate-100 last:border-b-0"
                              >
                                <div className="min-w-0 px-3 py-3 sm:px-4">
                                  <p className="mb-1 text-[10px] font-semibold text-slate-400">
                                    {updateFieldLabels[field]}
                                  </p>

                                  <p className="break-words text-xs font-medium text-slate-600 line-through decoration-slate-300">
                                    {formatValue(field, oldValue)}
                                  </p>
                                </div>

                                <div className="min-w-0 border-l border-slate-200 bg-emerald-50/40 px-3 py-3 sm:px-4">
                                  <p className="mb-1 text-[10px] font-semibold text-emerald-600">
                                    New Value
                                  </p>

                                  <p className="break-words text-xs font-bold text-emerald-800">
                                    {formatValue(field, newValue)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                          No field changes found.
                        </p>
                      )}
                    </div>

                    {/* APPROVE / REJECT BUTTONS */}

                    <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        disabled={isReviewing}
                        onClick={() =>
                          handleReviewUpdate(service, "reject")
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isReviewing ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={15} />
                        )}

                        Reject Changes
                      </button>

                      <button
                        type="button"
                        disabled={isReviewing}
                        onClick={() =>
                          handleReviewUpdate(service, "approve")
                        }
                        className="flex items-center gap-2 rounded-lg bg-[#243b53] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#304f70] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isReviewing ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}

                        Approve Changes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ================= ALL SERVICES SECTION ================= */}

        <section className="space-y-4">

          {/* SECTION HEADER */}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#243b53]">
                All Services
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage all services listed by technicians.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
              {services.length} Services
            </span>
          </div>

          {/* LOADING */}

          {loading && <ServicesSkeleton />}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              <div className="flex items-center gap-2">
                <AlertCircle size={17} />
                {error}
              </div>

              <button
                onClick={fetchServices}
                className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200"
              >
                <RefreshCw size={13} />
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && services.length === 0 && (
            <EmptyState
              icon={Wrench}
              title="No services found"
              description="Services created by technicians will appear here."
            />
          )}

          {/* SERVICES */}

          {!loading &&
            !error &&
            services.map((service) => {
              const title =
                service.title || service.name || "Untitled Service";

              const currentStatus =
                service.approvalStatus?.toLowerCase() === "accepted"
                  ? "accepted"
                  : service.approvalStatus?.toLowerCase() === "cancelled"
                    ? "cancelled"
                    : "pending";

              const isUpdating = updatingId === service._id;

              return (
                <div
                  key={service._id}
                  className="group flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-slate-300 hover:shadow-md"
                >
                  {/* IMAGE */}

                  <div className="flex w-28 shrink-0 items-center justify-center bg-slate-50 p-2 sm:w-40">
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-200 sm:h-28">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={title}
                          fill
                          unoptimized
                          sizes="160px"
                          className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <Wrench size={30} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
                    <div>
                      {/* TITLE */}

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                          {title}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${getStatusStyle(
                            currentStatus
                          )}`}
                        >
                          {getStatusIcon(currentStatus)}

                          {currentStatus === "accepted"
                            ? "Accepted"
                            : currentStatus === "cancelled"
                              ? "Cancelled"
                              : "Pending"}
                        </span>

                        {service.hasPendingUpdate && (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">
                            Update Under Review
                          </span>
                        )}
                      </div>

                      {/* CATEGORY */}

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Tag size={13} />

                        <span>
                          {service.category || "Uncategorized"}
                        </span>
                      </div>

                      {/* DESCRIPTION */}

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {service.description ||
                          "No description available."}
                      </p>
                    </div>

                    {/* DETAILS */}

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <User
                          size={14}
                          className="shrink-0 text-slate-400"
                        />

                        <span>
                          {service.technicianName || "Unknown Technician"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-600">
                        <Mail
                          size={14}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="break-all">
                          {service.technicianEmail || "No email"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                    <DollarSign size={13} />
                        {service.basePrice ?? 0}
                      </div>
                    </div>

                    {/* STATUS UPDATE */}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Update Status
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Change service status
                        </p>
                      </div>

                      {/* STATUS DROPDOWN */}

                      <div className="relative">
                        <select
                          value={currentStatus}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              service._id,
                              e.target.value as "accepted" | "cancelled"
                            )
                          }
                          className={`cursor-pointer appearance-none rounded-lg border py-2 pl-3 pr-9 text-xs font-bold outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                            currentStatus === "accepted"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-200"
                              : currentStatus === "cancelled"
                                ? "border-red-200 bg-red-50 text-red-700 focus:ring-red-200"
                                : "border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-200"
                          }`}
                        >
                          <option value="pending" disabled>
                            Pending
                          </option>

                          <option value="accepted">Accept</option>

                          <option value="cancelled">Cancel</option>
                        </select>

                        {isUpdating ? (
                          <Loader2
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </DashboardShell>
  );
};

export default AdminServicesPage;