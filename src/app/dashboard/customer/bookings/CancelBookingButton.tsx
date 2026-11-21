"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { BookingDelete } from "@/allapi";

const CancelBookingButton = ({ id, status }: { id: string; status?: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {

    setLoading(true);

    try {
      const result = await BookingDelete({ id });

      if (result.success) {
        toast.success("Booking cancelled successfully!");
        router.refresh();
      } else {
        toast.error("Failed to cancel booking!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (
    status?.toLowerCase() === "cancelled" ||
    status?.toLowerCase() === "completed"
  ) {
    return null;
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <XCircle size={16} />
      {loading ? "Cancelling..." : "Cancel Booking"}
    </button>
  );
};

export default CancelBookingButton;