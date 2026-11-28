import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  CalendarClock,
  Clock,
  Wrench,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import CancelBookingButton from "./CancelBookingButton";

import { getBookingEmail } from "@/allapi";
import { ServerSession } from "@/serverapi";

export interface Booking {
  _id?: string;
  serviceId: string;
  serviceImage: string;
  serviceTitle: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status?:
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
}

// Date Format
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

// Status Style
const getStatusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "requested":
      return "bg-amber-50 text-amber-600";

    case "accepted":
      return "bg-blue-50 text-blue-600";

    case "in-progress":
      return "bg-indigo-50 text-indigo-600";

    case "completed":
      return "bg-emerald-50 text-emerald-600";

    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

// Booking Content
const BookingContent = async () => {
  const session = await ServerSession();
  const email = session?.email;

  const bookings = email ? await getBookingEmail({ email }) : [];

  const totalBookings = bookings?.length || 0;

  // Empty State
  if (totalBookings === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#243b53]/10">
          <CalendarClock size={28} className="text-[#243b53]" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          No Bookings Yet
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          You haven&apos;t booked any repair services yet. Explore our services
          and book your first appointment.
        </p>

        <Link
          href="/services"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#243b53] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a2d40]"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Total Bookings */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <CalendarClock size={16} className="text-[#243b53]" />

          <span className="text-sm text-slate-600">
            Total Bookings:
          </span>

          <span className="text-sm font-bold text-[#243b53]">
            {totalBookings}
          </span>
        </div>
      </div>

      {/* Booking List */}
      <div className="mx-auto max-w-6xl space-y-3">
        {bookings.map((booking: Booking) => (
          <div
            key={booking._id}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#243b53]/30 hover:shadow-md sm:flex-row"
          >

            {/* Image */}
            <div className="relative h-36 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:min-h-70 sm:w-52 md:w-70">
              {booking.serviceImage ? (
                <Image
                  src={booking.serviceImage}
                  alt={booking.serviceTitle || "Service"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 224px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Wrench size={35} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">

              {/* Category & Status */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">

                <span className="rounded-full bg-[#243b53]/10 px-3 py-1 text-xs font-semibold text-[#243b53]">
                  {booking.category}
                </span>

                <div className="flex flex-wrap items-center gap-2">

                  {/* Booking Status */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status || "requested"}
                  </span>

                  {/* Payment Status */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      booking.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {booking.paymentStatus || "unpaid"}
                  </span>

                </div>
              </div>

              {/* Title */}
              <h2 className="mb-2 break-words text-base font-bold text-slate-900 transition-colors group-hover:text-[#243b53]">
                {booking.serviceTitle}
              </h2>

              {/* Problem Description */}
              <div className="mb-3 flex items-start gap-2">
                <FileText
                  size={15}
                  className="mt-0.5 shrink-0 text-[#243b53]"
                />

                <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                  {booking.problemDescription ||
                    "No problem description provided."}
                </p>
              </div>

              {/* Customer Information */}
              <div className="mb-3 grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">

                {/* Phone */}
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Phone
                    size={15}
                    className="mt-0.5 shrink-0 text-[#243b53]"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Phone Number
                    </p>

                    <p className="break-words text-xs font-medium">
                      {booking.customerPhone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-[#243b53]"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Service Address
                    </p>

                    <p className="break-words text-xs font-medium">
                      {booking.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Calendar
                    size={15}
                    className="mt-0.5 shrink-0 text-[#243b53]"
                  />

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Preferred Date
                    </p>

                    <p className="text-xs font-medium">
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                </div>

                {/* Customer Name */}
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Clock
                    size={15}
                    className="mt-0.5 shrink-0 text-[#243b53]"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Customer Name
                    </p>

                    <p className="break-words text-xs font-medium">
                      {booking.customerName || "Not provided"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Price Information */}
              <div className="mb-3 flex flex-wrap items-center gap-3">

                {/* Base Price */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-500">
                    Base Price
                  </p>

                  <p className="text-base font-bold text-[#243b53]">
                    ${booking.basePrice ?? 0}
                  </p>
                </div>

                {/* Final Amount */}
                <div className="rounded-lg border border-[#d28b53]/30 bg-[#f4e7db]/40 px-3 py-2">
                  <p className="text-[11px] font-medium text-[#8c6548]">
                    Final Amount
                  </p>

                  <p className="text-base font-bold text-[#8c6548]">
                    ${booking.finalAmount ?? booking.basePrice ?? 0}
                  </p>
                </div>

                {/* Payment */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-500">
                    Payment
                  </p>

                  <p
                    className={`text-sm font-bold ${
                      booking.paymentStatus === "paid"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {booking.paymentStatus || "unpaid"}
                  </p>
                </div>

              </div>

              {/* Details & Actions */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Details */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Wrench
                      size={15}
                      className="shrink-0 text-[#243b53]"
                    />

                    <span>Repair Service</span>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Cancel Booking */}
                  {booking._id && (
                    <CancelBookingButton
                      id={booking._id}
                      status={booking.status}
                    />
                  )}

                  {/* Payment Button */}
                {/* Payment Button */}
{booking.paymentStatus === "paid" ? (
  <button
    type="button"
    disabled
    className="inline-flex shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white opacity-70"
  >
    <CreditCard size={15} />
    Paid
  </button>
) : booking.status === "completed" && booking._id ? (
  <Link
    href={{
      pathname: "/check-out",
      query: {
        booking: JSON.stringify(booking),
      },
    }}
    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243b53] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#344f6b]"
  >
    <CreditCard size={15} />
    Pay Now
  </Link>
) : (
  <button
    type="button"
    disabled
    className="inline-flex shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#243b53] px-4 py-2 text-xs font-semibold text-white opacity-50"
  >
    <CreditCard size={15} />
    Pay Now
  </button>
)}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Page
const CustomerBookingsPage = () => {
  return (
    <DashboardShell
      role="customer"
      title="My Bookings"
      subtitle="All your scheduled repair appointments, past and upcoming."
    >
      <Suspense
        fallback={
          <div className="space-y-4">

            {/* Total Booking Skeleton */}
            <div className="flex justify-end">
              <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-100" />
            </div>

            {/* Booking Skeleton */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="mx-auto flex max-w-6xl animate-pulse flex-col overflow-hidden rounded-xl bg-slate-100 sm:flex-row"
              >
                <div className="h-36 w-full bg-slate-200 sm:w-36" />

                <div className="flex-1 space-y-3 p-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-5 w-1/2 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <BookingContent />
      </Suspense>
    </DashboardShell>
  );
};

export default CustomerBookingsPage;