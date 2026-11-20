import React, { Suspense } from "react";
import Image from "next/image";

import {
  CalendarClock,
  Clock,
  Wrench,
  CreditCard,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";
import { getBookingEmail } from "@/allapi";
import { ServerSession } from "@/serverapi";
export interface Booking {
  _id?: string;
  serviceId: string;
  image: string;
  title: string;
  category: string;
  isAvailable: boolean;
  estimatedDuration: string;
  description: string;
  customerName: string;
  customerEmail: string;
}

// Booking Content
const BookingContent = async () => {
  const session = await ServerSession();
  const email = session?.email;

  const bookings = email ? await getBookingEmail({ email }) : [];

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="No bookings yet"
        description="Book a service and your appointments will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking:Booking) => (
        <div
          key={booking._id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#243b53]/30 hover:shadow-md sm:h-44 sm:flex-row"
        >
          {/* Image */}
          <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-full sm:w-56">
            <Image
              src={booking.image}
              alt={booking.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 224px"
            />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
            {/* Category & Status */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-[#243b53]/10 px-3 py-1 text-xs font-semibold text-[#243b53]">
                {booking.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.isAvailable
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {booking.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#243b53]">
              {booking.title}
            </h2>

            {/* Description */}
            <p className="mb-3 line-clamp-2 text-sm leading-5 text-slate-500">
              {booking.description}
            </p>

            {/* Product Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={16} className="text-[#243b53]" />
                  <span>{booking.estimatedDuration}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Wrench size={16} className="text-[#243b53]" />
                  <span>Repair Service</span>
                </div>
              </div>

              {/* Non-functional Payment Button */}
              <button
                type="button"
                disabled
                className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-lg bg-[#243b53] px-5 py-2.5 text-sm font-semibold text-white shadow-sm opacity-90"
              >
                <CreditCard size={16} />
                Pay Now
              </button>
            </div>
          </div>
        </div>
      ))}
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
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-44 animate-pulse flex-col overflow-hidden rounded-2xl bg-slate-100 sm:flex-row"
              >
                <div className="h-44 w-full bg-slate-200 sm:h-full sm:w-56" />

                <div className="flex-1 space-y-3 p-5">
                  <div className="h-5 w-24 rounded bg-slate-200" />
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