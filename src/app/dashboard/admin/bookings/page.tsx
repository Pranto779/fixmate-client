"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  CalendarCheck,
  Search,
  Eye,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Wrench,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
  ClipboardList,
  Activity,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";
import { getAllBookings } from "@/allapi";

interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage?: string;
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
  status:
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
}

const statusStyle: Record<string, string> = {
  requested: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  accepted: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  "in-progress": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
};

const formatDate = (date: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BookingsContent = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.serviceTitle,
        booking.customerName,
        booking.customerEmail,
        booking.technicianName,
        booking.technicianEmail,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || booking.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [bookings, search, filter]);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-violet-600",
      bg: "bg-violet-50",
      description: "All service requests",
    },
    {
      title: "Requested",
      value: bookings.filter((b) => b.status === "requested").length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Waiting for response",
    },
    {
      title: "In Progress",
      value: bookings.filter((b) => b.status === "in-progress").length,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Currently being serviced",
    },
    {
      title: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Successfully finished",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative min-w-0 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    {stat.value}
                  </h2>

                  <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                <div className={`shrink-0 rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/[0.035] transition-transform duration-500 group-hover:scale-150" />
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight">
              All Bookings
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage and monitor every service booking.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live booking records
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 md:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search by service, customer or technician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full min-w-0 rounded-lg border bg-background pl-10 pr-10 text-xs outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 w-full rounded-lg border bg-background px-3 text-xs font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 md:w-[180px] md:shrink-0"
          >
            <option value="all">All Status</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <EmptyState
            icon={CalendarCheck}
            title="No bookings found"
            description="No bookings match your search or selected filter."
          />
        </div>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold">Booking Records</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">
                A complete overview of customer service requests.
              </p>
            </div>

            <span className="w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
              {filteredBookings.length} Bookings
            </span>
          </div>

          {/* MOBILE AND TABLET HORIZONTAL CARDS */}
          <div className="space-y-3 p-3 lg:hidden">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="min-w-0 overflow-hidden rounded-xl border bg-background p-3 transition-colors hover:bg-muted/20 sm:p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  {/* Service Image */}
                  <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border bg-muted sm:h-24 sm:w-24">
                    {booking.serviceImage ? (
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Wrench className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex max-w-full truncate rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                      {booking.category}
                    </span>

                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-5">
                      {booking.serviceTitle}
                    </h3>

                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      ID: {booking._id}
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      ${booking.finalAmount ?? booking.basePrice}
                    </p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card text-primary transition hover:bg-primary hover:text-primary-foreground sm:h-9 sm:w-9"
                    aria-label="View booking details"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                {/* Information */}
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t pt-3 sm:grid-cols-3">
                  {/* Customer */}
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Customer
                    </p>

                    <div className="flex min-w-0 items-center gap-1.5">
                      <User size={12} className="shrink-0 text-muted-foreground" />
                      <p className="truncate text-xs font-semibold">
                        {booking.customerName}
                      </p>
                    </div>

                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      {booking.customerEmail}
                    </p>
                  </div>

                  {/* Technician */}
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Technician
                    </p>

                    <div className="flex min-w-0 items-center gap-1.5">
                      <Wrench size={12} className="shrink-0 text-muted-foreground" />
                      <p className="truncate text-xs font-semibold">
                        {booking.technicianName}
                      </p>
                    </div>

                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      {booking.technicianEmail}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Date
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="shrink-0 text-muted-foreground" />
                      <p className="truncate text-xs font-medium">
                        {formatDate(booking.preferredDate)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Status */}
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </p>

                    <span
                      className={`inline-flex max-w-full truncate rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                        statusStyle[booking.status] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Payment */}
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Payment
                    </p>

                    <span
                      className={`inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                        booking.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.paymentStatus === "paid" ? (
                        <CheckCircle2 size={10} className="shrink-0" />
                      ) : (
                        <Clock size={10} className="shrink-0" />
                      )}
                      {booking.paymentStatus}
                    </span>
                  </div>

                  {/* View Details */}
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary transition hover:underline"
                    >
                      View Details
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden lg:block">
            <table className="w-full table-fixed text-left">
              <thead className="border-b bg-muted/40">
                <tr className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <th className="w-[19%] px-2 py-3">Service</th>
                  <th className="w-[16%] px-2 py-3">Customer</th>
                  <th className="w-[16%] px-2 py-3">Technician</th>
                  <th className="w-[12%] whitespace-nowrap px-2 py-3">
                    Date
                  </th>
                  <th className="w-[9%] px-2 py-3">Amount</th>
                  <th className="w-[11%] px-2 py-3">Status</th>
                  <th className="w-[10%] px-2 py-3">Payment</th>
                  <th className="w-[7%] px-2 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/70">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-2 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {booking.serviceImage ? (
                          <Image
                            src={booking.serviceImage}
                            alt={booking.serviceTitle}
                            width={36}
                            height={36}
                            unoptimized
                            className="h-9 w-9 shrink-0 rounded-lg border object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Wrench className="h-4 w-4 text-primary" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {booking.serviceTitle}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {booking.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-3">
                      <p className="truncate text-xs font-semibold">
                        {booking.customerName}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {booking.customerEmail}
                      </p>
                    </td>

                    <td className="px-2 py-3">
                      <p className="truncate text-xs font-medium">
                        {booking.technicianName}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {booking.technicianEmail}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground">
                        <Calendar size={12} className="shrink-0" />
                        <span>{formatDate(booking.preferredDate)}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-2 py-3">
                      <span className="text-xs font-bold">
                        ${booking.finalAmount ?? booking.basePrice}
                      </span>
                    </td>

                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                          statusStyle[booking.status] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                          booking.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {booking.paymentStatus === "paid" ? (
                          <CheckCircle2 size={10} className="shrink-0" />
                        ) : (
                          <Clock size={10} className="shrink-0" />
                        )}
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td className="px-2 py-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-[10px] font-semibold transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div
          onClick={() => setSelectedBooking(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-lg font-bold sm:text-xl">
                  Booking Details
                </h2>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Booking ID: {selectedBooking._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="shrink-0 rounded-xl border bg-background p-2 transition hover:bg-muted"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-6">
              {/* Service */}
              <div className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-muted/20 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                {selectedBooking.serviceImage ? (
                  <Image
                    src={selectedBooking.serviceImage}
                    alt={selectedBooking.serviceTitle}
                    width={85}
                    height={85}
                    unoptimized
                    className="h-20 w-20 shrink-0 rounded-xl border object-cover sm:h-[85px] sm:w-[85px]"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-[85px] sm:w-[85px]">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {selectedBooking.category}
                  </span>

                  <h3 className="mt-2 break-words text-base font-bold sm:text-lg">
                    {selectedBooking.serviceTitle}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Base Price: ${selectedBooking.basePrice}
                  </p>
                </div>
              </div>

              {/* Customer and Technician */}
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl border p-3 sm:p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <User size={17} />
                    </div>
                    <h3 className="font-bold">Customer</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <User size={15} className="shrink-0" />
                      <span className="break-all">
                        {selectedBooking.customerName}
                      </span>
                    </p>
                    <p className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <Mail size={15} className="shrink-0" />
                      <span className="break-all">
                        {selectedBooking.customerEmail}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={15} className="shrink-0" />
                      {selectedBooking.customerPhone || "N/A"}
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <MapPin size={15} className="mt-0.5 shrink-0" />
                      <span className="break-words">
                        {selectedBooking.address || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border p-3 sm:p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                      <Wrench size={17} />
                    </div>
                    <h3 className="font-bold">Technician</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User size={15} className="shrink-0" />
                      <span className="break-words">
                        {selectedBooking.technicianName}
                      </span>
                    </p>
                    <p className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <Mail size={15} className="shrink-0" />
                      <span className="break-all">
                        {selectedBooking.technicianEmail}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="rounded-2xl border p-3 sm:p-4">
                <h3 className="mb-4 font-bold">Booking Summary</h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0 rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Preferred Date
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <Calendar size={15} className="shrink-0 text-primary" />
                      <span className="break-words">
                        {formatDate(selectedBooking.preferredDate)}
                      </span>
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Final Amount
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold">
                      <CreditCard size={15} className="shrink-0 text-primary" />
                      ${selectedBooking.finalAmount ?? selectedBooking.basePrice}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Booking Status
                    </p>
                    <span
                      className={`mt-2 inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                        statusStyle[selectedBooking.status]
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="min-w-0 rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">
                      Payment Status
                    </p>
                    <span
                      className={`mt-2 inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                        selectedBooking.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="rounded-2xl border p-3 sm:p-4">
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <FileText size={17} className="text-primary" />
                  Problem Description
                </h3>

                <p className="break-words rounded-xl bg-muted/40 p-3 text-sm leading-7 text-muted-foreground sm:p-4">
                  {selectedBooking.problemDescription ||
                    "No description provided."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t bg-muted/20 p-4 sm:px-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingsSkeleton = () => (
  <div className="grid min-h-[300px] place-items-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading bookings...</p>
    </div>
  </div>
);

const AdminBookingsPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Bookings"
      subtitle="Every booking made on the platform, with its live status."
    >
      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsContent />
      </Suspense>
    </DashboardShell>
  );
};

export default AdminBookingsPage;