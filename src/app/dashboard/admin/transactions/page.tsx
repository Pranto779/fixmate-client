"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Loader2,
  RefreshCw,
  User,
  Wrench,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";
import StatCard from "@/app/dashboard/dashboard-component/stat-card";
import { getAllBookings } from "@/allapi";

// ================= ADMIN · TRANSACTIONS =================
// Paid bookings from the existing `bookings` collection, fetched through
// GET `${NEXT_PUBLIC_SERVER_URL}/booking` (getAllBookings in src/allapi.ts).

interface Booking {
  _id: string;
  serviceTitle: string;
  category?: string;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  basePrice?: number;
  finalAmount?: number;
  paymentStatus: string;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paidAt?: string;
}

// ---------- HELPERS ----------

const formatUSD = (amount: number) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTransactionId = (booking: Booking) =>
  booking.paymentIntentId || booking.stripeSessionId || "N/A";

const LoadingState = () => (
  <div className="flex min-h-[350px] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl bg-primary/10 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">Loading transactions...</p>
    </div>
  </div>
);

// ---------- CONTENT ----------

const TransactionsContent = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchTransactions = async () => {
      try {
        const data = await getAllBookings();

        if (cancelled) return;

        setBookings(Array.isArray(data) ? data : []);
        setError(false);
      } catch (fetchError) {
        console.error("Failed to fetch transactions:", fetchError);

        if (cancelled) return;

        setBookings([]);
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(false);
    setReloadKey((key) => key + 1);
  }, []);

  // Only paid bookings — no email filtering (all customers & technicians).
  const paidBookings = useMemo(
    () => bookings.filter((booking) => booking.paymentStatus === "paid"),
    [bookings]
  );

  const totalRevenue = useMemo(
    () =>
      paidBookings.reduce(
        (total, booking) => total + Number(booking.finalAmount || 0),
        0
      ),
    [paidBookings]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-w-0 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-2xl bg-red-500/10 p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <h3 className="text-base font-bold">Failed to load transactions</h3>

          <p className="max-w-md text-sm text-muted-foreground">
            Something went wrong while fetching transactions from the server.
            Please try again.
          </p>

          <button
            onClick={retryFetch}
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (paidBookings.length === 0) {
    return (
      <EmptyState
        icon={Banknote}
        title="No transactions yet"
        description="Paid bookings will appear here with amount, transaction ID and payment date."
      />
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* ============ TOTAL REVENUE ============ */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="Total Revenue"
          value={formatUSD(totalRevenue)}
          hint={`${paidBookings.length} paid`}
          tone="emerald"
        />
      </div>

      {/* ============ TRANSACTIONS TABLE ============ */}
      <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b px-4 py-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-bold">Transactions</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Every completed payment made across the FixMate platform.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
            {paidBookings.length} Transactions
          </span>
        </div>

        {/* MOBILE AND TABLET CARDS */}
        <div className="space-y-3 p-3 lg:hidden">
          {paidBookings.map((booking) => (
            <div
              key={booking._id}
              className="min-w-0 overflow-hidden rounded-xl border bg-background p-3 transition-colors hover:bg-muted/20 sm:p-4"
            >
              {/* Service */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 break-words text-sm font-bold leading-5">
                    {booking.serviceTitle}
                  </h4>

                  <p className="mt-1 text-lg font-extrabold tracking-tight">
                    {formatUSD(
                      Number(booking.finalAmount || booking.basePrice || 0)
                    )}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold capitalize text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 size={10} className="shrink-0" />
                  {booking.paymentStatus}
                </span>
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t pt-3">
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

                <div className="min-w-0">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Technician
                  </p>

                  <div className="flex min-w-0 items-center gap-1.5">
                    <Wrench
                      size={12}
                      className="shrink-0 text-muted-foreground"
                    />
                    <p className="truncate text-xs font-semibold">
                      {booking.technicianName}
                    </p>
                  </div>

                  <p className="mt-1 truncate text-[10px] text-muted-foreground">
                    {booking.technicianEmail}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Payment Date
                  </p>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays
                      size={12}
                      className="shrink-0 text-muted-foreground"
                    />
                    <p className="truncate text-xs font-medium">
                      {formatDate(booking.paidAt)}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Transaction ID
                  </p>

                  <p
                    className="break-all font-mono text-[10px] text-muted-foreground"
                    title={getTransactionId(booking)}
                  >
                    {getTransactionId(booking)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1024px] table-fixed text-left">
            <thead className="border-b bg-muted/40">
              <tr className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <th className="w-[17%] px-3 py-3">Customer</th>
                <th className="w-[17%] px-3 py-3">Technician</th>
                <th className="w-[17%] px-3 py-3">Service</th>
                <th className="w-[9%] px-3 py-3">Amount</th>
                <th className="w-[18%] px-3 py-3">Transaction ID</th>
                <th className="w-[12%] whitespace-nowrap px-3 py-3">
                  Payment Date
                </th>
                <th className="w-[10%] px-3 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/70">
              {paidBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Customer */}
                  <td className="px-3 py-3">
                    <p className="truncate text-xs font-semibold">
                      {booking.customerName}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {booking.customerEmail}
                    </p>
                  </td>

                  {/* Technician */}
                  <td className="px-3 py-3">
                    <p className="truncate text-xs font-semibold">
                      {booking.technicianName}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {booking.technicianEmail}
                    </p>
                  </td>

                  {/* Service */}
                  <td className="px-3 py-3">
                    <p className="truncate text-xs font-medium">
                      {booking.serviceTitle}
                    </p>
                    {booking.category && (
                      <p className="truncate text-[10px] text-muted-foreground">
                        {booking.category}
                      </p>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="text-xs font-bold">
                      {formatUSD(
                        Number(booking.finalAmount || booking.basePrice || 0)
                      )}
                    </span>
                  </td>

                  {/* Transaction ID — long values truncate instead of stretching the layout */}
                  <td className="px-3 py-3">
                    <span
                      className="block max-w-full truncate font-mono text-[11px] text-muted-foreground"
                      title={getTransactionId(booking)}
                    >
                      {getTransactionId(booking)}
                    </span>
                  </td>

                  {/* Payment Date */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays size={12} className="shrink-0" />
                      <span>{formatDate(booking.paidAt)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold capitalize text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 size={10} className="shrink-0" />
                      {booking.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminTransactionsPage = () => {
  return (
    <DashboardShell
      role="admin"
      title="Transactions"
      subtitle="Payments and payouts across the FixMate platform."
    >
      <TransactionsContent />
    </DashboardShell>
  );
};

export default AdminTransactionsPage;
