"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Wrench,
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { BookingPost } from "@/allapi";
import { useRouter } from "next/navigation";

interface SProps {
  serviceId: string;
  image: string;
  title: string;
  category: string;
  basePrice: number;
  isAvailable: boolean;
  estimatedDuration: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  technicianName?: string;
  technicianEmail?: string;
}

type Props = {
  service: SProps;
};

const RequestRepairButton = ({ service }: Props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: service.customerName || "",
    customerPhone: "",
    address: "",
    date: "",
    problemDescription: "",
  });

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Repair Request
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.customerName.trim() ||
      !formData.customerPhone.trim() ||
      !formData.address.trim() ||
      !formData.date ||
      !formData.problemDescription.trim()
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!service.customerEmail) {
      toast.error("Customer email not found. Please login again.");
      return;
    }

    if (!service.technicianEmail) {
      toast.error("Technician information not found!");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        // Service Information
        serviceId: service.serviceId,
        serviceTitle: service.title,
        serviceImage: service.image,
        category: service.category,
        basePrice: service.basePrice,

        // Technician Information
        technicianName: service.technicianName || "",
        technicianEmail: service.technicianEmail,

        // Customer Information
        customerName: formData.customerName,
        customerEmail: service.customerEmail,
        customerPhone: formData.customerPhone,

        // Booking Information
        address: formData.address,
        preferredDate: formData.date,
        problemDescription: formData.problemDescription,

        // Booking Status
        status: "requested",
        finalAmount: service.basePrice,
        paymentStatus: "unpaid",
      };

      const result = await BookingPost({
        data: requestData,
      });

      console.log("Booking Data:", requestData);
      console.log("Booking Result:", result);

      if (!result) {
        toast.error("Failed to submit repair request!");
        return;
      }

      toast.success("Repair request submitted successfully!");

      setOpen(false);

      setFormData({
        customerName: service.customerName || "",
        customerPhone: "",
        address: "",
        date: "",
        problemDescription: "",
      });

      router.push("/dashboard/customer/bookings");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Request Button */}

      <button
        onClick={() => setOpen(true)}
        disabled={!service.isAvailable}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#264566] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Wrench size={18} />

        {!service.isAvailable ? "Not Available" : "Request Repair"}
      </button>

      {/* Modal */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-[#171c25]">
            {/* Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Request Repair
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Fill in your details to book this service.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Service Info */}

            <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-100 p-3 dark:bg-[#222a36]">
              <img
                src={service.image}
                alt={service.title}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {service.category}
                </p>

                <p className="text-sm font-semibold text-green-600">
                  ${service.basePrice}
                </p>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleRequest} className="space-y-4">
              {/* Customer Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Customer Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-transparent py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-[#243b53] dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Customer Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-transparent py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-[#243b53] dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Address */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service Address
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows={2}
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 bg-transparent py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-[#243b53] dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Preferred Date */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Date
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-transparent py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-[#243b53] dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Problem Description */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Problem Description
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

               <textarea
  name="problemDescription"
  value={formData.problemDescription}
  onChange={handleChange}
  placeholder="Describe your device problem... (minimum 20 characters)"
  rows={3}
  required
  minLength={20}
  className="w-full resize-none rounded-xl border border-gray-300 bg-transparent py-3 pl-10 pr-4 text-gray-900 outline-none focus:border-[#243b53] dark:border-gray-700 dark:text-white"
/>
                </div>
              </div>

              {/* Submit Buttons */}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="w-1/2 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-[#243b53] px-4 py-3 font-semibold text-white transition hover:bg-[#264566] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Wrench size={17} />

                  {loading ? "Submitting..." : "Confirm Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestRepairButton;