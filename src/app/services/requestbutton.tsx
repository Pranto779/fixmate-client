"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import { BookingPost } from "@/allapi";
import { useRouter } from "next/navigation";

interface SProps {
  image: string;
  title: string;
  category: string;
  isAvailable: boolean;
  estimatedDuration: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
}

type Props = {
  service: SProps;
};

const RequestRepairButton = ({ service }: Props) => {
  const [loading, setLoading] = useState(false);
  const router=useRouter()

  const handleRequest = async () => {
    setLoading(true);

    try {
      const requestData = {
        image: service.image,
        title: service.title,
        category: service.category,
        isAvailable: service.isAvailable,
        estimatedDuration: service.estimatedDuration,
        description: service.description,
        customerName: service.customerName,
        customerEmail: service.customerEmail,
      };

      const result = await BookingPost({data:requestData});

      if (!result) {
        toast.error("Failed to submit repair request!");
        return;
      }

      toast.success("Repair request submitted successfully!");
      router.push('/dashboard/customer/bookings')
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#264566] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Wrench size={18} />
      {loading ? "Processing..." : "Request Repair"}
    </button>
  );
};

export default RequestRepairButton;