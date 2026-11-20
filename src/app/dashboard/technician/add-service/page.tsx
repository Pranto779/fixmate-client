"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { Wrench, Image as ImageIcon, Plus } from "lucide-react";
import { useSession } from "@/lib/auth-client";

import type { Role } from "@/lib/roles";
import DashboardShell from "../../dashboard-component/dashboard-shell";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Postservice } from "@/allapi";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const AddServiceForm = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const router=useRouter()

  const { data: session } = useSession();
  const user = session?.user;

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Handle input changes here
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formdata = new FormData(form);

  const data = {
    ...Object.fromEntries(formdata.entries()),
    basePrice: Number(formdata.get("basePrice")),
    isAvailable,
    technicianName: user?.name,
    technicianEmail: user?.email,
    approvalStatus: "pending",
    createdAt: new Date(),
  };

  const post = await Postservice(data);
  console.log(post);
  

  if (post.insertedId) {
    toast.success("Service added successfully!");
    form.reset();
    setIsAvailable(true);
    router.push('/dashboard/technician/my-services')
  } else {
    toast.error("Service add failed!");
  }
};
  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#243b53] outline-none transition focus:border-[#d28b53] focus:ring-2 focus:ring-[#d28b53]/10";

  const labelClass =
    "mb-1 block text-xs font-semibold text-[#243b53]";

  return (
    <DashboardShell
      role={"technician" as Role}
      title="Add New Service"
      subtitle="Create and manage your repair services."
    >
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

        {/* Header */}
        <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4e7db] text-[#d28b53]">
            <Wrench size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#243b53]">
              Add New Service
            </h2>
            <p className="text-xs text-gray-500">
              Provide details about your repair service.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Service Title */}
            <div>
              <label className={labelClass}>Service Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. iPhone Screen Replacement"
                className={inputClass}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                className={inputClass}
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select category
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className={labelClass}>Service Image URL *</label>

              <div className="relative">
                <ImageIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="url"
                  name="image"
                  placeholder="Enter ImgBB image URL"
                  className={`${inputClass} pl-9`}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Base Price */}
            <div>
              <label className={labelClass}>Base Price (USD) *</label>
              <input
                type="number"
                name="basePrice"
                placeholder="e.g. 50"
                min="0"
                className={inputClass}
                onChange={handleChange}
                required
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <label className={labelClass}>Estimated Duration *</label>
              <input
                type="text"
                name="estimatedDuration"
                placeholder="e.g. 1-2 hours"
                className={inputClass}
                onChange={handleChange}
                required
              />
            </div>

            {/* Service Mode */}
            <div>
              <label className={labelClass}>Service Mode *</label>
              <select
                name="serviceMode"
                defaultValue=""
                className={inputClass}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select service mode
                </option>
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>
            </div>

            {/* Service Area */}
            <div>
              <label className={labelClass}>Service Area *</label>
              <input
                type="text"
                name="serviceArea"
                placeholder="e.g. Dhaka, Gazipur"
                className={inputClass}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Service Description *</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe your repair service..."
                className={`${inputClass} resize-none`}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-100 bg-[#faf9f6] px-3 py-2.5">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="peer sr-only"
              />

              <div className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-[#d28b53] after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-300 peer-checked:after:translate-x-5"></div>
            </label>

            <div>
              <p className="text-xs font-semibold text-[#243b53]">
                Service Availability
              </p>

              <p
                className={`text-[11px] font-semibold ${
                  isAvailable ? "text-green-600" : "text-red-500"
                }`}
              >
                {isAvailable ? "ON" : "OFF"}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 border-t border-gray-100 pt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#243b53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d28b53] sm:w-auto sm:min-w-40"
            >
              <Plus size={17} />
              Add Service
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
};

export default AddServiceForm;
