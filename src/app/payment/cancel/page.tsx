"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  RefreshCcw,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";

function CancelContent() {
  return (
    <DashboardShell
      role="customer"
      title="Payment Cancelled"
      subtitle="Your payment was not completed."
    >
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 px-6 py-12 text-center text-white">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15">
              <XCircle size={58} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold">
              Payment Cancelled
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-orange-50">
              Your payment process was cancelled. No payment has been
              completed through this checkout session.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={23}
                  className="mt-0.5 shrink-0 text-orange-500"
                />

                <div>
                  <h3 className="font-bold text-orange-800">
                    Payment Not Completed
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-orange-700">
                    You have not completed your payment. Your booking
                    information has not been changed by this cancellation.
                    You can return and try again whenever you are ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="mt-7 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#243b53]/10">
                  <CreditCard
                    size={22}
                    className="text-[#243b53]"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-[#243b53]">
                    Secure Payment
                  </h4>

                  <p className="text-xs text-gray-500">
                    Your payment is securely handled by Stripe.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <ShieldCheck
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-[#243b53]">
                    Your Booking
                  </h4>

                  <p className="text-xs text-gray-500">
                    You can return to your bookings and try payment again.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/customer/bookings"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#243b53] px-5 py-3.5 font-semibold text-white transition hover:bg-[#344f6b]"
              >
                <RefreshCcw size={18} />
                Try Again
              </Link>

              <Link
                href="/dashboard/customer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#243b53] px-5 py-3.5 font-semibold text-[#243b53] transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Need help? Please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell
          role="customer"
          title="Payment Cancelled"
          subtitle="Loading page..."
        >
          <div className="flex justify-center py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#243b53]" />
          </div>
        </DashboardShell>
      }
    >
      <CancelContent />
    </Suspense>
  );
}