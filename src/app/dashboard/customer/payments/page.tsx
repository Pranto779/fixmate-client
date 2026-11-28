"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Receipt,
  CalendarDays,
  User,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";
import { authClient } from "@/lib/auth-client";
import { getBookingEmail } from "@/allapi";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category?: string;
  technicianName?: string;
  finalAmount?: number;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paidAt?: string;
  paymentStatus: string;
}

const PaymentsLoading = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading payments...</span>
      </div>
    </div>
  );
};

const CustomerPaymentsContent = () => {
  const { data: session, isPending } = authClient.useSession();

  const email = session?.user?.email;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await getBookingEmail({ email });

        const paidBookings = Array.isArray(data)
          ? data.filter(
              (booking: Booking) => booking.paymentStatus === "paid"
            )
          : [];

        setBookings(paidBookings);
      } catch (error) {
        console.error("Payment fetch error:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [email, isPending]);

  if (isPending || isLoading) {
    return <PaymentsLoading />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-semibold text-red-500">
          Failed to load payments
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while fetching your payment history.
        </p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Once you pay for a service, your payment history will show up here."
      />
    );
  }

  const totalAmount = bookings.reduce(
    (total, booking) => total + Number(booking.finalAmount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171717]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <h2 className="mt-2 text-2xl font-bold">
                {bookings.length}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-500/10 p-3">
              <Receipt className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171717]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount Paid</p>
              <h2 className="mt-2 text-2xl font-bold">
                ${totalAmount.toLocaleString("en-BD")}
              </h2>
            </div>

            <div className="rounded-lg bg-green-500/10 p-3">
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#171717]">
        <div className="border-b border-gray-200 p-5 dark:border-white/10">
          <h2 className="text-lg font-semibold">Payment History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your completed service payments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-white/5">
              <tr>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Service
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Technician
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Amount
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Payment Date
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="transition hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="min-w-[200px] px-5 py-4">
                    <div className="flex items-center gap-3">
                      {booking.serviceImage ? (
                        <img
                          src={booking.serviceImage}
                          alt={booking.serviceTitle}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10">
                          <CreditCard className="h-5 w-5 text-purple-500" />
                        </div>
                      )}

                      <div>
                        <p className="font-medium">
                          {booking.serviceTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.category || "Service"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {booking.technicianName || "N/A"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    ${Number(booking.finalAmount || 0).toLocaleString("en-BD")}
                  </td>

                  <td className="max-w-[180px] px-5 py-4">
                    <p
                      className="truncate text-xs text-gray-500"
                      title={
                        booking.paymentIntentId ||
                        booking.stripeSessionId ||
                        "N/A"
                      }
                    >
                      {booking.paymentIntentId ||
                        booking.stripeSessionId ||
                        "N/A"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      {booking.paidAt
                        ? new Date(booking.paidAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Paid
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

const CustomerPaymentsPage = () => {
  return (
    <DashboardShell
      role="customer"
      title="Payments"
      subtitle="Invoices, payment history and your saved payment methods."
    >
      <Suspense fallback={<PaymentsLoading />}>
        <CustomerPaymentsContent />
      </Suspense>
    </DashboardShell>
  );
};

export default CustomerPaymentsPage;