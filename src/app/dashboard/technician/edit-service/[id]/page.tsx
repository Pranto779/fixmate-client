
"use client";

import React, { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Wrench,
  Image as ImageIcon,
  DollarSign,
  FileText,
  MapPin,
  Clock,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { UpdateService } from "@/allapi";

const UpdateMyserviceForm = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
    location: "",
    estimatedDuration: "",
    isAvailable: true,
  });

  // কোন কোন field পরিবর্তন হয়েছে
  const [touchedFields, setTouchedFields] = useState<
    Set<keyof typeof formData>
  >(new Set());

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouchedFields((prev) => {
      const updated = new Set(prev);
      updated.add(name as keyof typeof formData);
      return updated;
    });
  };

  // Handle Availability
  const handleAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      isAvailable: !prev.isAvailable,
    }));

    setTouchedFields((prev) => {
      const updated = new Set(prev);
      updated.add("isAvailable");
      return updated;
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toast.error("Service ID not found!");
      return;
    }

    if (touchedFields.size === 0) {
      toast.info("Please change at least one field!");
      return;
    }

    try {
      setLoading(true);

      // শুধু পরিবর্তিত field পাঠানো হবে
      const updatedData: Record<string, string | number | boolean> = {};

      touchedFields.forEach((field) => {
        const value = formData[field];

        updatedData[field] =
          field === "price" ? Number(value) : value;
      });

      const result = await UpdateService({
        id,
        data: updatedData,
      });

      if (result.modifiedCount > 0) {
        toast.success("Service updated successfully!");
        router.back();
      } else if (result.matchedCount > 0) {
        toast.info("No changes were made.");
      } else {
        toast.error("Service not found!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update service!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-[#d28b53]">
          <Wrench size={20} />
          <span className="text-sm font-semibold">
            Service Management
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#243b53]">
          Update Your Service
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update only the information you want to change.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        {/* Service Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#243b53]">
            Service Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter service title"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/20"
          />
        </div>

        {/* Category and Price */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243b53]">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#d28b53]"
            >
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Painting">Painting</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Carpentry">Carpentry</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243b53]">
              Price
            </label>

            <div className="relative">
              <DollarSign
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d28b53]"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#243b53]">
            <ImageIcon size={17} />
            Service Image URL
          </label>

          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#d28b53]"
          />
        </div>

        {/* Location and Duration */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#243b53]">
              <MapPin size={17} />
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#d28b53]"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#243b53]">
              <Clock size={17} />
              Estimated Duration
            </label>

            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 2 hours"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#d28b53]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#243b53]">
            <FileText size={17} />
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your service..."
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#d28b53]"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#243b53]">
                Service Availability
              </p>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  formData.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formData.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {formData.isAvailable
                ? "Your service is currently available."
                : "Your service is currently unavailable."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAvailability}
            role="switch"
            aria-checked={formData.isAvailable}
            aria-label="Toggle service availability"
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d28b53]/30 ${
              formData.isAvailable
                ? "bg-green-500"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                formData.isAvailable
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#243b53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#304f70] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={18} />
          )}

          {loading ? "Updating..." : "Update Service"}
        </button>
      </form>
    </div>
  );
};

// Suspense Wrapper
const UpdateMyservice = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-[#243b53]">
            Loading service...
          </p>
        </div>
      }
    >
      <UpdateMyserviceForm />
    </Suspense>
  );
};

export default UpdateMyservice;
