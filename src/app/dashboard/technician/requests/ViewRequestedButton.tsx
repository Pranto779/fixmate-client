"use client";

import React, { useState } from "react";
import {
  Eye,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  Wallet,
  CreditCard,
  Wrench,
  Check,
} from "lucide-react";

import { UpdateBookingStatus } from "@/allapi";
import { toast } from "sonner";

interface Booking {
  _id: string;
  serviceId?: string;
  serviceImage?: string;
  serviceTitle?: string;
  category?: string;

  basePrice?: number;

  technicianName?: string;
  technicianEmail?: string;

  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  address?: string;
  preferredDate?: string;
  problemDescription?: string;

  status?:
    | "pending"
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";

  finalAmount?: number;
  paymentStatus?: "unpaid" | "paid";
}

interface Props {
  serviceId: string;
  bookings: Booking[];
}

const statusOptions = [
  "requested",
  "accepted",
  "rejected",
  "in-progress",
  "completed",
  "cancelled",
] as const;

const ViewRequestedButton = ({ bookings }: Props) => {
  const [open, setOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [bookingList, setBookingList] = useState(bookings);

  const [amount, setAmount] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [saving, setSaving] = useState(false);

  // Open Booking Details
  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);

    setAmount(
      String(booking.finalAmount ?? booking.basePrice ?? "")
    );
  };

  // Update Booking Status
  const handleStatusChange = async (status: Booking["status"]) => {
    if (!selectedBooking?._id || !status) {
      toast.error("Booking ID not found");
      return;
    }

    try {
      setUpdatingStatus(true);

      const result = await UpdateBookingStatus({
        id: selectedBooking._id,
        status,
      });

      const updatedBooking: Booking = {
        ...selectedBooking,
        status,
      };

      setSelectedBooking(updatedBooking);

      setBookingList((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? updatedBooking
            : booking
        )
      );

      toast.success(
        result?.message || "Booking status updated successfully!"
      );
    } catch (error) {
      console.error("Status Update Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update booking status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Submit Final Amount
  const handleSubmitAmount = async () => {
    if (!selectedBooking?._id) {
      toast.error("Booking ID not found");
      return;
    }

    if (selectedBooking.status !== "completed") {
      toast.error("Complete the job first");
      return;
    }

    const finalAmount = Number(amount);

    if (
      amount.trim() === "" ||
      !Number.isFinite(finalAmount) ||
      finalAmount < 0
    ) {
      toast.error("Please enter a valid final amount");
      return;
    }

    try {
      setSaving(true);

      const result = await UpdateBookingStatus({
        id: selectedBooking._id,
        finalAmount,
      });

      const updatedBooking: Booking = {
        ...selectedBooking,
        finalAmount,
      };

      setSelectedBooking(updatedBooking);

      setBookingList((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? updatedBooking
            : booking
        )
      );

      toast.success(
        result?.message || "Final amount saved successfully!"
      );
    } catch (error) {
      console.error("Final Amount Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save final amount"
      );
    } finally {
      setSaving(false);
    }
  };

  // Status Colors
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-purple-100 text-purple-700";

      case "cancelled":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {/* View Button */}

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[#243b53] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#344f6b]"
      >
        <Eye size={16} />
        View Requests
      </button>

      {/* Main Modal */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#243b53]">
                  Customer Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your service bookings
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedBooking(null);
                }}
                className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Booking List */}

            {!selectedBooking ? (
              <div className="max-h-[70vh] space-y-3 overflow-y-auto p-5">
                {bookingList.length === 0 ? (
                  <div className="py-12 text-center">
                    <Clock
                      size={35}
                      className="mx-auto mb-3 text-slate-400"
                    />

                    <h3 className="font-semibold text-[#243b53]">
                      No Requests Found
                    </h3>
                  </div>
                ) : (
                  bookingList.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#243b53]/10 text-[#243b53]">
                          <User size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[#243b53]">
                            {booking.customerName || "Customer"}
                          </h3>

                          <p className="truncate text-xs text-slate-500">
                            {booking.customerEmail}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {booking.serviceTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status || "requested"}
                        </span>

                        <button
                          onClick={() => handleView(booking)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#243b53] px-3 py-2 text-xs font-semibold text-white hover:bg-[#344f6b]"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Selected Booking Details */

              <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">

                {/* Back Button */}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-sm font-semibold text-[#8c6548] hover:underline"
                >
                  ← Back to Requests
                </button>

                {/* Service Information */}

                <div className="flex flex-col gap-4 rounded-xl bg-[#243b53]/5 p-4 sm:flex-row sm:items-center">
                  {selectedBooking.serviceImage ? (
                    <img
                      src={selectedBooking.serviceImage}
                      alt={selectedBooking.serviceTitle || "Service"}
                      className="h-20 w-full rounded-lg object-cover sm:w-24"
                    />
                  ) : (
                    <div className="flex h-20 w-full items-center justify-center rounded-lg bg-slate-200 sm:w-24">
                      <Wrench size={30} className="text-slate-500" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="rounded-md bg-[#f4e7db] px-2 py-1 text-xs font-semibold text-[#8c6548]">
                      {selectedBooking.category || "General Service"}
                    </span>

                    <h3 className="mt-2 text-lg font-bold text-[#243b53]">
                      {selectedBooking.serviceTitle}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Base Price: ৳{selectedBooking.basePrice ?? 0}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-[#243b53]">
                    <User size={18} />
                    Customer Information
                  </h3>

                  <div className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                    <InfoItem
                      icon={<User size={16} />}
                      label="Customer Name"
                      value={selectedBooking.customerName}
                    />

                    <InfoItem
                      icon={<Mail size={16} />}
                      label="Email Address"
                      value={selectedBooking.customerEmail}
                    />

                    <InfoItem
                      icon={<Phone size={16} />}
                      label="Phone Number"
                      value={selectedBooking.customerPhone}
                    />

                    <InfoItem
                      icon={<MapPin size={16} />}
                      label="Service Address"
                      value={selectedBooking.address}
                    />

                    <InfoItem
                      icon={<Calendar size={16} />}
                      label="Preferred Date"
                      value={formatDate(selectedBooking.preferredDate)}
                    />
                  </div>
                </div>

                {/* Problem Description */}

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-[#243b53]">
                    <FileText size={18} />
                    Problem Description
                  </h3>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {selectedBooking.problemDescription ||
                        "No problem description provided."}
                    </p>
                  </div>
                </div>

                {/* Booking Status */}

                <div>
                  <h3 className="mb-3 font-bold text-[#243b53]">
                    Booking Status
                  </h3>

                  <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          selectedBooking.status
                        )}`}
                      >
                        {selectedBooking.status || "requested"}
                      </span>

                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <CreditCard size={16} />
                        Payment: {selectedBooking.paymentStatus || "unpaid"}
                      </span>
                    </div>

                    <select
                      value={selectedBooking.status || "requested"}
                      onChange={(e) =>
                        handleStatusChange(
                          e.target.value as Booking["status"]
                        )
                      }
                      disabled={updatingStatus}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-medium capitalize text-slate-700 outline-none focus:border-[#243b53] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace("-", " ")}
                        </option>
                      ))}
                    </select>

                    {updatingStatus && (
                      <p className="text-xs text-slate-500">
                        Updating booking status...
                      </p>
                    )}
                  </div>
                </div>

                {/* Final Amount - Only When Completed */}

                {selectedBooking.status === "completed" && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#243b53]">
                      <Wallet size={18} />
                      Final Amount
                    </h3>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                        ৳
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter final amount"
                        className="w-full rounded-lg border border-slate-300 py-3 pl-8 pr-3 text-sm text-slate-800 outline-none focus:border-[#243b53]"
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Base Price: ৳{selectedBooking.basePrice ?? 0}
                    </p>

                    <button
                      onClick={handleSubmitAmount}
                      disabled={saving}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#243b53] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#344f6b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={16} />
                      {saving ? "Saving..." : "Submit Final Amount"}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Reusable Information Item

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <div className="mt-0.5 shrink-0 text-[#d28b53]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="break-words text-sm font-medium text-[#243b53]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default ViewRequestedButton;