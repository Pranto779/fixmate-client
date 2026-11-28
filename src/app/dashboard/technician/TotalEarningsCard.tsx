"use client";

import React, { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

import { getTechnicianBookings } from "@/allapi";

// Same tokens as the THEME object in page.tsx (this file is a client
// component, so the palette is repeated here rather than imported).
const THEME = {
  navy: "#243b53",
  border: "#eee5dc",
};

type PaidBooking = {
  _id: string;
  paymentStatus?: string;
  technicianEmail?: string;
  finalAmount?: number;
  basePrice?: number;
};

type EarningsStatus = "loading" | "error" | "ready";

const formatAmount = (amount: number) =>
  `৳ ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * "Total Earnings" summary card: the paid total for this technician only.
 * Payments live on booking documents, scoped by technicianEmail server-side
 * and re-checked here before summing.
 */
const TotalEarningsCard = ({ email }: { email: string }) => {
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<EarningsStatus>(
    email ? "loading" : "ready"
  );

  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    const fetchEarnings = async () => {
      try {
        const data = await getTechnicianBookings({ email });

        if (cancelled) return;

        const paidBookings = (Array.isArray(data) ? data : []).filter(
          (booking: PaidBooking) =>
            booking.paymentStatus === "paid" &&
            booking.technicianEmail === email
        );

        const paidTotal = paidBookings.reduce(
          (sum, booking) =>
            sum + Number(booking.finalAmount ?? booking.basePrice ?? 0),
          0
        );

        setTotal(paidTotal);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("error");
      }
    };

    fetchEarnings();

    return () => {
      cancelled = true;
    };
  }, [email]);

  return (
    <div
      className="rounded-xl border bg-white p-4 transition hover:shadow-sm"
      style={{ borderColor: THEME.border }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500">
          Total Earnings
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4e7db]">
          <Wallet size={18} className="text-[#d28b53]" />
        </div>
      </div>

      {status === "loading" ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-[#eee5dc]" />
      ) : (
        <>
          <h3
            className="mt-3 text-2xl font-bold"
            style={{ color: status === "error" ? "#a0aec0" : THEME.navy }}
          >
            {status === "error" ? "৳ —" : formatAmount(total)}
          </h3>

          {status === "error" && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              Couldn&apos;t load earnings
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TotalEarningsCard;
