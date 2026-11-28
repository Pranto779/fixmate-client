"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Receipt,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";

interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  customerEmail: string;
  finalAmount?: number;
  basePrice?: number;
}

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

function PaymentsContent() {
  const searchParams = useSearchParams();

  const bookingData = searchParams.get("booking");
  const sessionId = searchParams.get("session_id");

  let booking: Booking | null = null;

  try {
    if (bookingData) {
      booking = JSON.parse(bookingData);
    }
  } catch {
    booking = null;
  }

  // MongoDB Booking ID
  const bookingId = booking?._id || searchParams.get("bookingId");

  const serviceTitle = booking?.serviceTitle || "";
  const customerEmail = booking?.customerEmail || "";
  const amount = booking?.finalAmount ?? booking?.basePrice ?? 0;

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  // Verify Stripe Payment
  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        setVerifying(true);
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
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, serverUrl]);

  // Start Stripe Checkout
  const handlePayment = async () => {
    if (!bookingId) {
      setError("Booking information not found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${serverUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(
          data.message || "Unable to start payment."
        );
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  };

  return (
    <DashboardShell
      role="customer"
      title="Payments"
      subtitle="Securely complete your service payment."
    >
      <div className="mx-auto max-w-3xl">
        {verifying ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Loader2
              className="mx-auto mb-4 animate-spin text-[#243b53]"
              size={40}
            />

            <h2 className="text-xl font-bold text-[#243b53]">
              Verifying Payment
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we confirm your payment.
            </p>
          </div>
        ) : payment ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-green-50 px-6 py-10 text-center">
              <CheckCircle2
                className="mx-auto mb-3 text-green-600"
                size={58}
              />

              <h2 className="text-2xl font-bold text-green-700">
                Payment Successful!
              </h2>

              <p className="mt-2 text-sm text-green-700">
                Your payment has been successfully completed.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Receipt className="text-[#c58a5b]" size={24} />

                <h3 className="text-lg font-bold text-[#243b53]">
                  Payment Receipt
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Service
                  </span>

                  <span className="text-right text-sm font-semibold text-gray-800">
                    {payment.serviceTitle}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Booking ID
                  </span>

                  <span className="break-all text-right text-sm font-medium text-gray-800">
                    {payment.bookingId}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Customer Email
                  </span>

                  <span className="break-all text-right text-sm font-medium text-gray-800">
                    {payment.customerEmail}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Transaction ID
                  </span>

                  <span className="break-all text-right text-sm font-medium text-gray-800">
                    {payment.transactionId}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Payment Date
                  </span>

                  <span className="text-right text-sm font-medium text-gray-800">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b pb-3">
                  <span className="text-sm text-gray-500">
                    Payment Method
                  </span>

                  <span className="text-right text-sm font-medium text-gray-800">
                    {payment.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {payment.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#f7f8fa] p-5">
                <p className="text-sm text-gray-500">
                  Total Paid
                </p>

                <h2 className="mt-1 text-3xl font-bold text-[#243b53]">
                  ${Number(payment.amount).toFixed(2)}
                </h2>
              </div>

              <Link
                href="/dashboard/customer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] px-5 py-3 font-semibold text-white transition hover:bg-[#344f6b]"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#243b53] px-6 py-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <CreditCard size={34} />
              </div>

              <h2 className="text-2xl font-bold">
                Complete Your Payment
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Secure payment powered by Stripe.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    Service Title
                  </p>

                  <p className="font-semibold text-[#243b53]">
                    {serviceTitle || "Service not found"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    Booking ID
                  </p>

                  <p className="break-all font-semibold text-[#243b53]">
                    {bookingId || "Booking ID not found"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    Customer Email
                  </p>

                  <p className="break-all font-semibold text-[#243b53]">
                    {customerEmail || "Email not found"}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <p className="text-2xl font-bold text-[#243b53]">
                    ${Number(amount).toFixed(2)}
                  </p>
                </div>
              </div>

              <h3 className="mb-4 text-lg font-bold text-[#243b53]">
                Choose Payment Method
              </h3>

              <div className="flex items-center justify-between rounded-xl border-2 border-[#243b53] bg-[#243b53]/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                    <img
                      src="/stripe-logo.png"
                      alt="Stripe Logo"
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-[#243b53]">
                      Stripe Checkout
                    </h4>

                    <p className="text-xs text-gray-500">
                      Card and other supported payment methods
                    </p>
                  </div>
                </div>

                <CheckCircle2
                  className="text-[#243b53]"
                  size={22}
                />
              </div>

              {error && (
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle
                    className="mt-0.5 shrink-0"
                    size={18}
                  />

                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading || !bookingId || amount <= 0}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] px-5 py-4 font-bold text-white transition hover:bg-[#344f6b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay with Stripe
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck
                  size={17}
                  className="text-green-600"
                />

                Secure payment processing by Stripe
              </div>

              <p className="mt-3 text-center text-xs text-gray-400">
                Your payment information is securely handled by Stripe.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function CustomerPaymentsPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell
          role="customer"
          title="Payments"
          subtitle="Loading payment page..."
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
      <PaymentsContent />
    </Suspense>
  );
}