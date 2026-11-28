"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Wrench,
  DollarSign,
  FileText,
  MapPin,
  Clock,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import { ServiceDatails, UpdateService } from "@/allapi";
import ImageUpload from "@/components/image-upload";

type FormField = 
  | "title"
  | "category"
  | "price"
  | "description"
  | "image"
  | "location"
  | "estimatedDuration"
  | "isAvailable";

interface PendingField {
  key: string;
  label: string;
  type: "New" | "Updated";
}

const fieldLabels: Record<string, string> = {
  title: "Service Title",
  category: "Category",
  basePrice: "Price",
  price: "Price",
  description: "Description",
  image: "Service Image",
  serviceArea: "Location",
  location: "Location",
  estimatedDuration: "Estimated Duration",
  isAvailable: "Availability",
};

const formToDatabase: Record<string, string> = {
  title: "title",
  category: "category",
  price: "basePrice",
  description: "description",
  image: "image",
  location: "serviceArea",
  estimatedDuration: "estimatedDuration",
  isAvailable: "isAvailable",
};

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

  const [originalData, setOriginalData] = useState<Record<string, unknown>>(
    {}
  );

  const [touchedFields, setTouchedFields] = useState<Set<FormField>>(
    new Set()
  );

  const [pendingFields, setPendingFields] = useState<PendingField[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasPendingUpdate, setHasPendingUpdate] = useState(false);

  // Check whether a field is new or updated
  const getFieldType = (
    field: string,
    currentValue: unknown
  ): "New" | "Updated" => {
    const isEmpty =
      currentValue === undefined ||
      currentValue === null ||
      currentValue === "";

    return isEmpty ? "New" : "Updated";
  };

  // Load Existing Service Data
  useEffect(() => {
    const loadService = async () => {
      try {
        if (!id) return;

        setFetching(true);

        const service = await ServiceDatails({ id });

        if (!service) {
          toast.error("Service not found!");
          return;
        }

        setFormData({
          title: service.title || "",
          category: service.category || "",
          price: String(service.basePrice ?? ""),
          description: service.description || "",
          image: service.image || "",
          location: service.serviceArea || "",
          estimatedDuration: service.estimatedDuration || "",
          isAvailable: service.isAvailable ?? true,
        });

        setOriginalData({
          title: service.title,
          category: service.category,
          basePrice: service.basePrice,
          description: service.description,
          image: service.image,
          serviceArea: service.serviceArea,
          estimatedDuration: service.estimatedDuration,
          isAvailable: service.isAvailable,
        });

        const pending = service.pendingUpdates || {};

        setHasPendingUpdate(service.hasPendingUpdate ?? false);

        // Dynamic pending field names from database
        const dynamicFields: PendingField[] = Object.keys(pending).map(
          (key) => ({
            key,
            label: fieldLabels[key] || key,
            type: getFieldType(key, service[key as keyof typeof service]),
          })
        );

        setPendingFields(dynamicFields);
      } catch (error) {
        console.error("Service fetch error:", error);
        toast.error("Failed to load service!");
      } finally {
        setFetching(false);
      }
    };

    loadService();
  }, [id]);

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
      updated.add(name as FormField);
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

  // Dynamic fields currently being changed
  const currentChangedFields: PendingField[] = Array.from(
    touchedFields
  ).map((field) => {
    const databaseField = formToDatabase[field];

    return {
      key: databaseField,
      label: fieldLabels[databaseField] || field,
      type: getFieldType(databaseField, originalData[databaseField]),
    };
  });

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

      const updatedData: Record<string, unknown> = {};

      touchedFields.forEach((field) => {
        const value = formData[field];
        const databaseField = formToDatabase[field];

        updatedData[databaseField] =
          field === "price" ? Number(value) : value;
      });

      const result = await UpdateService({
        id,
        data: updatedData,
      });

      if (result.success) {
        toast.success(
          "Your changes have been submitted! Waiting for admin approval."
        );

        router.push("/dashboard/technician/my-services");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to submit update!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to submit service update!");
    } finally {
      setLoading(false);
    }
  };

  // Loading Existing Service
  if (fetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-[#243b53]">
          <Loader2 size={20} className="animate-spin text-[#d28b53]" />
          Loading service information...
        </div>
      </div>
    );
  }

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
          Update your service information. Changes will be sent to admin
          for approval before going live.
        </p>
      </div>

      {/* Existing Pending Update Notice */}
      {hasPendingUpdate && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Clock size={19} className="mt-0.5 shrink-0 text-amber-600" />

            <div className="w-full">
              <p className="text-sm font-bold text-amber-800">
                Update Waiting for Admin Approval
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Your previous approved information is still visible to
                customers. These changes will be added or updated only
                after admin approval.
              </p>

              {/* Dynamic Pending Fields */}
              {pendingFields.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-amber-800">
                    Fields Waiting for Approval:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {pendingFields.map((field) => (
                      <span
                        key={field.key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800"
                      >
                        {field.label}

                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold">
                          {field.type}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Notice */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Clock size={19} className="mt-0.5 shrink-0 text-amber-600" />

        <div>
          <p className="text-sm font-bold text-amber-800">
            Admin Approval Required
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            Your updated information will not be visible to customers
            until an admin reviews and approves your changes.
          </p>
        </div>
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
        <ImageUpload
          label="Service Image"
          value={formData.image}
          onChange={(url) => {
            setFormData((prev) => ({ ...prev, image: url }));

            // Must be marked touched or the change is dropped from
            // the admin pending-update diff.
            setTouchedFields((prev) => {
              const updated = new Set(prev);
              updated.add("image");
              return updated;
            });
          }}
          allowRemove
          hint="JPG, PNG, WEBP or GIF up to 5 MB. Changes go live after admin approval."
          className="rounded-lg"
        />

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
              formData.isAvailable ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                formData.isAvailable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Live Changed Fields Preview */}
        {currentChangedFields.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
              <CheckCircle2 size={17} />
              Fields You Are Changing
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {currentChangedFields.map((field) => (
                <span
                  key={field.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-800"
                >
                  {field.label}

                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold">
                    {field.type}
                  </span>
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs leading-5 text-blue-700">
              These fields will be added or updated after admin approval.
              Until then, customers will continue to see the previously
              approved information.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || fetching}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#243b53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#304f70] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {loading ? "Submitting for Approval..." : "Submit for Approval"}
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