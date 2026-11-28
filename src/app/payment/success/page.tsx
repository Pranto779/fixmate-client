"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Receipt,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Calendar,
  Hash,
  Mail,
  Wrench,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";

interface PaymentDetails {
  bookingId: string;
  serviceTitle: string;
  customerEmail: string;
  amount: number;
  paymentStatus: string;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Payment session ID not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${serverUrl}/verify-session?session_id=${encodeURIComponent(
            sessionId
          )}`
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Payment verification failed."
          );
        }

        setPayment(data.payment);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify your payment."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, serverUrl]);

  return (
    <DashboardShell
      role="customer"
      title="Payment Success"
      subtitle="Your payment confirmation and receipt."
    >
      <div className="mx-auto max-w-3xl">
        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <Loader2
              size={48}
              className="mx-auto animate-spin text-[#243b53]"
            />

            <h2 className="mt-5 text-xl font-bold text-[#243b53]">
              Verifying Your Payment
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we confirm your transaction.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle size={36} className="text-red-500" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              Payment Verification Failed
            </h2>

            <p className="mt-3 text-sm text-red-500">{error}</p>

            <Link
              href="/dashboard/customer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#243b53] px-6 py-3 font-semibold text-white transition hover:bg-[#344f6b]"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>
          </div>
        ) : payment ? (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* Success Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 px-6 py-12 text-center text-white">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-white/10" />

              <div className="relative">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15">
                  <CheckCircle2 size={58} />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold">
                  Payment Successful!
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-green-50">
                  Thank you for choosing FixMate. Your payment has been
                  successfully completed.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  <ShieldCheck size={17} />
                  Payment Verified
                </div>
              </div>
            </div>

            {/* Receipt */}
            <div className="p-6 sm:p-8">
              <div className="mb-7 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#243b53]/10">
                    <Receipt size={23} className="text-[#243b53]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#243b53]">
                      Payment Receipt
                    </h3>

                    <p className="text-xs text-gray-500">
                      Transaction details
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {payment.paymentStatus}
                </span>
              </div>

              {/* Amount */}
              <div className="rounded-2xl bg-[#f7f8fa] p-6 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Amount Paid
                </p>

                <h2 className="mt-2 text-4xl font-extrabold text-[#243b53]">
                  ${Number(payment.amount).toFixed(2)}
                </h2>

                <p className="mt-2 text-xs text-green-600">
                  Successfully paid through Stripe
                </p>
              </div>

              {/* Details */}
              <div className="mt-7">
                <h4 className="mb-4 font-bold text-[#243b53]">
                  Transaction Information
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <Wrench
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Service Name
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                        {payment.serviceTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <Hash
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Booking ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {payment.bookingId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <Mail
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Customer Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {payment.customerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <CreditCard
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Transaction ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {payment.transactionId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                    <Calendar
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Payment Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {new Date(payment.paymentDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-[#c58a5b]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard/customer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#243b53] px-5 py-3.5 font-semibold text-white transition hover:bg-[#344f6b]"
                >
                  <ArrowLeft size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/customer/bookings"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#243b53] px-5 py-3.5 font-semibold text-[#243b53] transition hover:bg-gray-50"
                >
                  <Receipt size={18} />
                  My Bookings
                </Link>
              </div>

              <p className="mt-6 text-center text-xs text-gray-400">
                Thank you for trusting FixMate. Your payment is securely
                processed by Stripe.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell
          role="customer"
          title="Payment Success"
          subtitle="Loading payment details..."
        >
          <div className="flex justify-center py-16">
            <Loader2
              className="animate-spin text-[#243b53]"
              size={35}
            />
          </div>
        </DashboardShell>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}