import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import {
  Wrench,
  MapPin,
  Clock,
  Pencil,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

import { getService, Service } from "@/allapi";
import { ServerSession } from "@/serverapi";
import DeleteServiceButton from "./delete-service-button";

const TechnicianMyServicesContent = async () => {
  await connection();

  const user = await ServerSession();
  const email = user?.email;

  const data: Service[] = email ? await getService({ email }) : [];

  return (
    <DashboardShell
      role="technician"
      title="My Services"
      subtitle="Manage your services and keep your business running smoothly."
    >
      {data.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Services you create will be listed here for customers to book."
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#243b53]">
                Your Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor all your listed services.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#f0e5da] bg-[#fffaf5] px-4 py-2.5">
              <BriefcaseBusiness size={17} className="text-[#c58a5b]" />
              <span className="text-sm font-bold text-[#243b53]">
                {data.length} Services
              </span>
            </div>
          </div>

          
{/* Horizontal Services List */}
<div className="space-y-4">
  {data.map((service) => (
    <div
      key={service._id}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#d9c1aa] hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row">

        {/* Image */}
        <div className="relative h-44 shrink-0 overflow-hidden bg-[#f5f1ed] sm:h-auto sm:w-48 lg:w-52">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Wrench size={35} className="text-[#c7b6a7]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute left-2.5 top-2.5">
            <span
              className={`rounded-md px-2.5 py-1 text-[9px] font-bold text-white ${
                service.isAvailable ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {service.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5">
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-[9px] font-bold text-[#8c6548]">
              {service.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4">

          {/* Title */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#243b53] transition-colors group-hover:text-[#c58a5b]">
                {service.title}
              </h3>

              <p className="mt-1 line-clamp-1 text-[11px] text-gray-500">
                {service.description}
              </p>
            </div>

            <span
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[9px] font-bold capitalize ${
                service.approvalStatus === "approved"
                  ? "bg-green-50 text-green-700"
                  : service.approvalStatus === "rejected"
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {service.approvalStatus === "approved" ? (
                <CheckCircle2 size={10} />
              ) : service.approvalStatus === "rejected" ? (
                <XCircle size={10} />
              ) : (
                <AlertCircle size={10} />
              )}
              {service.approvalStatus}
            </span>
          </div>

          {/* Information */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">

            {/* Price */}
            <div className="rounded-lg bg-[#fffaf5] px-3 py-2">
              <p className="text-[9px] text-gray-400">Starting Price</p>
              <p className="mt-0.5 text-base font-extrabold text-[#243b53]">
                <span className="mr-0.5 text-xs text-[#c58a5b]">৳</span>
                {service.basePrice}
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-lg border border-gray-100 px-3 py-2">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={11} />
                <span className="text-[9px]">Duration</span>
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-gray-700">
                {service.estimatedDuration}
              </p>
            </div>

            {/* Area */}
            <div className="rounded-lg border border-gray-100 px-3 py-2">
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={11} />
                <span className="text-[9px]">Service Area</span>
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-gray-700">
                {service.serviceArea}
              </p>
            </div>

            {/* Mode */}
            <div className="rounded-lg border border-gray-100 px-3 py-2">
              <div className="flex items-center gap-1 text-gray-400">
                <Wrench size={11} />
                <span className="text-[9px]">Service Mode</span>
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] font-semibold capitalize text-gray-700">
                {service.serviceMode}
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Technician */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5e9de]">
                <Wrench size={13} className="text-[#a87851]" />
              </div>

              <div>
                <p className="text-[9px] text-gray-400">Technician</p>
                <p className="text-[11px] font-bold text-[#243b53]">
                  {service.technicianName}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">

              {/* Delete */}
              <div className="[&_button]:!w-auto [&_button]:!rounded-lg [&_button]:!border-red-100 [&_button]:!bg-red-50 [&_button]:!px-3 [&_button]:!py-2 [&_button]:!text-[10px] [&_button]:!font-semibold [&_button]:!shadow-none [&_button]:hover:!bg-red-100">
                <DeleteServiceButton id={service._id.toString()} />
              </div>

              {/* Edit */}
              <Link
                href={`/dashboard/technician/edit-service/${service._id}`}
                className="flex items-center gap-1.5 rounded-lg bg-[#243b53] px-3.5 py-2 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#c58a5b] hover:shadow-md"
              >
                <Pencil size={11} />
                Edit
                <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      )}
    </DashboardShell>
  );
};

const TechnicianMyServicesPage = () => {
  return (
    <Suspense
      fallback={
        <DashboardShell
          role="technician"
          title="My Services"
          subtitle="Loading your services..."
        >
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </DashboardShell>
      }
    >
      <TechnicianMyServicesContent />
    </Suspense>
  );
};

export default TechnicianMyServicesPage;