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
} from "lucide-react";

import { toast } from "sonner";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";
import { getallServices, UpdateServiceStatus } from "@/allapi";

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
  approvalStatus?: "pending" | "accepted" | "cancelled";
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

// ================= ADMIN SERVICES PAGE =================

const AdminServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ================= FETCH SERVICES =================

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getallServices();

        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ================= UPDATE STATUS =================

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

      // Update UI after successful API response
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

  return (
    <DashboardShell
      role="admin"
      title="Services"
      subtitle="All services listed across the platform by technicians."
    >
      <div className="space-y-4">
        {/* LOADING */}

        {loading && <ServicesSkeleton />}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
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

            // Read approvalStatus from database
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

                      {/* STATUS BADGE */}

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize transition-all duration-200 ${getStatusStyle(
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
                        {service.technicianName ||
                          "Unknown Technician"}
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

                    {/* BASE PRICE */}

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                      <IndianRupee size={13} />
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
      </div>
    </DashboardShell>
  );
};

export default AdminServicesPage;