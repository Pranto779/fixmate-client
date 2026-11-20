import { ServiceDatails } from "@/allapi";
import { connection } from "next/server";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  UserRound,
  CheckCircle2,
  ShieldCheck,
  Truck,
  AlertCircle,
} from "lucide-react";

import RequestRepairButton from "../requestbutton";

// Details Content
const DetailsContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await connection();

  const { id } = await params;

  // Get Service
  let service;

  try {
    service = await ServiceDatails({ id });
  } catch {
    notFound();
  }

  if (!service || !service._id) {
    notFound();
  }

  // Get Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = String(session?.user?.role || "")
    .trim()
    .toLowerCase();

  // Role Check
  const isAdmin = userRole === "admin";
  const isTechnician = userRole === "technician";

  const isCustomer =
    !!session?.user && !isAdmin && !isTechnician;

  // Availability Check
  const isAvailable =
    service.isAvailable === true ||
    String(service.isAvailable).toLowerCase() === "true";

  // Technician Information
  const technicianName = service.technicianName || "Technician";

  const technicianPhoto =
    service.technicianPhoto ||
    service.technicianImage ||
    service.technician?.image;

  const technicianArea =
    service.technicianArea ||
    service.technician?.area ||
    service.serviceArea;

  const technicianBio =
    service.technicianBio ||
    service.technician?.bio ||
    "Experienced technician dedicated to providing reliable and quality repair services.";

  // Request Repair Data
  const data = {
    _id: String(service._id),
    image: service.image,
    title: service.title,
    category: service.category,
    isAvailable: isAvailable,
    estimatedDuration: service.estimatedDuration,
    description: service.description,
    customerName: session?.user?.name || "",
    customerEmail: session?.user?.email || "",
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#243b53]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-5">

          {/* Left Section */}
          <div className="space-y-8 lg:col-span-3">

            {/* Service Image */}
            <div className="relative h-[300px] overflow-hidden rounded-3xl bg-gray-200 sm:h-[420px]">
              {service.image && (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              )}

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-[#243b53] shadow-sm">
                  {service.category}
                </span>
              </div>

              <div
                className={`absolute bottom-5 left-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${
                  isAvailable
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 size={16} />
                    Available
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Not Available
                  </>
                )}
              </div>
            </div>

            {/* Service Title */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#243b53]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#243b53]">
                  {service.category}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <ShieldCheck size={15} />
                  Verified Service
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-[#243b53] sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>

              <p className="mt-5 text-base leading-8 text-gray-600">
                {service.description}
              </p>
            </div>

            {/* Service Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-7 text-xl font-bold text-[#243b53]">
                Service Information
              </h2>

              <div className="grid gap-7 sm:grid-cols-2">

                {/* Duration */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#d28b53]">
                    <Clock size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Estimated Duration
                    </p>

                    <p className="mt-1 font-bold text-[#243b53]">
                      {service.estimatedDuration}
                    </p>
                  </div>
                </div>

                {/* Service Mode */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Truck size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Service Mode
                    </p>

                    <p className="mt-1 font-bold text-[#243b53]">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>

                {/* Service Area */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Service Area
                    </p>

                    <p className="mt-1 font-bold text-[#243b53]">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <Wrench size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Service Category
                    </p>

                    <p className="mt-1 font-bold text-[#243b53]">
                      {service.category}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Technician Summary */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <UserRound size={21} className="text-[#d28b53]" />

                <h2 className="text-xl font-bold text-[#243b53]">
                  Technician Summary
                </h2>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row">

                {/* Technician Image */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#243b53]/10">
                  {technicianPhoto ? (
                    <Image
                      src={technicianPhoto}
                      alt={technicianName}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#243b53]">
                      {technicianName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Technician Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[#243b53]">
                      {technicianName}
                    </h3>

                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600">
                      <CheckCircle2 size={12} />
                      Technician
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={15} className="text-[#d28b53]" />
                    {technicianArea}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-gray-500">
                    {technicianBio}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-5">

              {/* Price Card */}
              <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold text-gray-400">
                  Starting Price
                </p>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#243b53]">
                    ৳{service.basePrice}
                  </span>

                  <span className="text-sm text-gray-400">
                    / starting
                  </span>
                </div>

                <div className="my-7 border-t border-dashed border-gray-200" />

                {/* Quick Details */}
                <div className="space-y-5">

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={17} />
                      Duration
                    </span>

                    <span className="text-sm font-bold text-[#243b53]">
                      {service.estimatedDuration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={17} />
                      Location
                    </span>

                    <span className="max-w-[55%] text-right text-sm font-bold text-[#243b53]">
                      {service.serviceArea}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Truck size={17} />
                      Service Mode
                    </span>

                    <span className="text-right text-sm font-bold text-[#243b53]">
                      {service.serviceMode}
                    </span>
                  </div>

                </div>

                {/* Request Repair Button - Only Customer */}
                {isCustomer && (
                  isAvailable ? (
                    <RequestRepairButton service={data} />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-4 text-sm font-bold text-gray-500 opacity-80"
                    >
                      <Wrench size={18} />
                      Service Not Available
                    </button>
                  )
                )}

                <p className="mt-4 text-center text-xs text-gray-400">
                  Final pricing may vary depending on the repair requirements.
                </p>
              </div>

              {/* Trust Card */}
              <div className="rounded-3xl bg-[#243b53] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Trusted Service
                    </h3>

                    <p className="text-xs text-white/60">
                      Quality service you can rely on.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};

// Main Page
const DetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#243b53]" />
        </div>
      }
    >
      <DetailsContent params={params} />
    </Suspense>
  );
};

export default DetailsPage;