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
  DollarSign,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import EmptyState from "@/app/dashboard/dashboard-component/empty-state";

import { getService, Service } from "@/allapi";
import { ServerSession } from "@/serverapi";



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
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#243b53]">
                Your Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                All your listed services in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#f0e5da] bg-[#fffaf5] px-4 py-2.5">
              <BriefcaseBusiness size={17} className="text-[#c58a5b]" />
              <span className="text-sm font-bold text-[#243b53]">
                {data.length} Services
              </span>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_3px_15px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ead8c8] hover:shadow-[0_12px_30px_rgba(36,59,83,0.10)]"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-[#f5f1ed]">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Wrench size={42} className="text-[#c7b6a7]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                  {/* Availability */}
                  <div className="absolute right-3 top-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-[10px] font-bold shadow-sm backdrop-blur-md ${
                        service.isAvailable
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-lg border border-white/30 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#8c6548] shadow-sm backdrop-blur-sm">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Title & Approval */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-[#243b53] transition-colors group-hover:text-[#c58a5b]">
                      {service.title}
                    </h3>

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
                        <CheckCircle2 size={11} />
                      ) : service.approvalStatus === "rejected" ? (
                        <XCircle size={11} />
                      ) : (
                        <AlertCircle size={11} />
                      )}
                      {service.approvalStatus}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 line-clamp-2 min-h-8 text-xs leading-relaxed text-gray-500">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#faf7f3] px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-medium text-gray-500">
                        Starting Price
                      </p>

                      <div className="mt-0.5 flex items-center gap-1">
                        <span className="text-lg font-extrabold text-[#243b53]">
                          <span className="mr-0.5 text-sm text-[#c58a5b]">
                            ৳
                          </span>
                          {service.basePrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#c58a5b] shadow-sm">
                      <DollarSign size={18} />
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {/* Duration */}
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
                        <Clock size={14} className="text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400">Duration</p>
                        <p className="break-words text-[11px] font-semibold text-gray-700">
                          {service.estimatedDuration}
                        </p>
                      </div>
                    </div>

                    {/* Service Area - Full Location */}
                    <div className="flex min-w-0 items-start gap-2 rounded-lg border border-gray-100 p-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-50">
                        <MapPin size={14} className="text-orange-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-400">
                          Service Area
                        </p>
                        <p className="break-words text-[11px] font-semibold leading-snug text-gray-700">
                          {service.serviceArea}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Mode */}
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-50">
                      <Wrench size={14} className="text-purple-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400">Service Mode</p>
                      <p className="break-words text-[11px] font-semibold capitalize text-gray-700">
                        {service.serviceMode}
                      </p>
                    </div>
                  </div>

                  {/* Technician */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5e9de]">
                        <Wrench size={14} className="text-[#a87851]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400">Technician</p>
                        <p className="break-words text-xs font-bold text-[#243b53]">
                          {service.technicianName}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-[10px] font-medium text-gray-400">
                      Service Provider
                    </span>
                  </div>

                  {/* Edit Button */}
                  <Link
                    href={`/dashboard/technician/edit-service/${service._id}`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243b53] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#c58a5b]"
                  >
                    <Pencil size={13} />
                    Edit Service
                    <ArrowUpRight
                      size={14}
                      className="ml-auto transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-gray-100"
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