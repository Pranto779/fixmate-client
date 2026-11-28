import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowUpRight,
  Clock,
  Wrench,
  MapPin,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { getallServices, Service } from "@/allapi";
import { connection } from "next/server";

// Category Mapping
const categoryMap: Record<string, string[]> = {
  smartphone: ["Smartphone"],
  "laptop-pc": ["Laptop & PC"],
  ac: ["AC", "Air Conditioner"],
  refrigerator: ["Refrigerator"],
  tv: ["TV", "Television"],
  "washing-machine": ["Washing Machine"],
  electrical: ["Electrical"],
};

// Category Display Names
const categoryNames: Record<string, string> = {
  smartphone: "Smartphone",
  "laptop-pc": "Laptop & PC",
  ac: "Air Conditioner",
  refrigerator: "Refrigerator",
  tv: "TV",
  "washing-machine": "Washing Machine",
  electrical: "Electrical",
};

// Services Content
interface ServicesContentProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const ServicesContent = async ({
  searchParams,
}: ServicesContentProps) => {
  await connection();

  const params = await searchParams;
  const category = params.category?.toLowerCase();

  const allservices = await getallServices();

  // Only Accepted and Available Services
  const acceptedServices: Service[] = Array.isArray(allservices)
    ? allservices.filter(
        (service: Service) =>
          service.approvalStatus === "accepted" &&
          service.isAvailable === true
      )
    : [];

  // Category Filtering
  const selectedCategories = category
    ? categoryMap[category]
    : undefined;

  const services: Service[] = selectedCategories
    ? acceptedServices.filter((service) =>
        selectedCategories.some(
          (item) =>
            service.category?.trim().toLowerCase() ===
            item.toLowerCase()
        )
      )
    : acceptedServices;

  const selectedCategoryName = category
    ? categoryNames[category]
    : undefined;

  return (
    <>
      {/* Selected Category Heading */}
      {selectedCategoryName && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e9d8c5] bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#d28b53]">
              Selected Category
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#243b53]">
              {selectedCategoryName} Services
            </h3>
          </div>

          <Link
            href="/services"
            className="rounded-lg bg-[#243b53] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d28b53]"
          >
            View All Services
          </Link>
        </div>
      )}

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <div
              key={service._id}
              className="group overflow-hidden rounded-2xl border border-[#eee5dc] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#30251e]/10"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-[#f1ece6]">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title || "Service"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Category */}
                <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#8c6548] shadow-sm">
                  {service.category}
                </div>

                {/* Approval Status */}
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                  <CheckCircle2 size={13} />
                  Accepted
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 rounded-xl bg-[#243b53] px-4 py-2 text-sm font-bold text-white shadow-lg">
                  From ${service.basePrice}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#243b53] transition-colors group-hover:text-[#d28b53]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-3 min-h-[48px] line-clamp-2 text-sm leading-6 text-[#718096]">
                  {service.description}
                </p>

                {/* Service Information */}
                <div className="mt-4 space-y-3">
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <Clock
                      size={15}
                      className="shrink-0 text-[#d28b53]"
                    />
                    <span>{service.estimatedDuration}</span>
                  </div>

                  {/* Service Area */}
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <MapPin
                      size={15}
                      className="shrink-0 text-[#d28b53]"
                    />
                    <span className="line-clamp-1">
                      {service.serviceArea}
                    </span>
                  </div>

                  {/* Service Mode */}
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <Truck
                      size={15}
                      className="shrink-0 text-[#d28b53]"
                    />
                    <span>{service.serviceMode}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>

                  <Link
                    href={`/services/${service._id}`}
                    className="group/link flex items-center gap-2 text-sm font-bold text-[#243b53] transition-colors hover:text-[#d28b53]"
                  >
                    View Details

                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Wrench
            className="mx-auto mb-4 text-[#d28b53]"
            size={40}
          />

          <h3 className="text-xl font-bold text-[#243b53]">
            No Services Available
          </h3>

          <p className="mt-2 text-sm text-[#718096]">
            {selectedCategoryName
              ? `No accepted and available ${selectedCategoryName} services found.`
              : "New services will appear here soon."}
          </p>

          {selectedCategoryName && (
            <Link
              href="/services"
              className="mt-5 inline-flex rounded-lg bg-[#243b53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d28b53]"
            >
              Browse All Services
            </Link>
          )}
        </div>
      )}
    </>
  );
};

// Loading UI
const ServicesLoading = () => {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-[#eee5dc] bg-white p-5 shadow-sm"
        >
          <div className="h-56 animate-pulse rounded-xl bg-stone-200" />
          <div className="mt-5 h-5 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
};

// Main Services Section
interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const ServicesSection = ({ searchParams }: PageProps) => {
  return (
    <section className="relative overflow-hidden bg-[#faf9f6] px-5 py-20 lg:px-8">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#e9d8c5]/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#f4e7db]/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8d7c5] bg-white px-4 py-2 shadow-sm">
            <Wrench size={15} className="text-[#d28b53]" />

            <span className="text-xs font-bold tracking-wider text-[#8c6548]">
              OUR SERVICES
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl lg:text-5xl">
            Professional Services,
            <span className="text-[#d28b53]">
              {" "}Trusted Results.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#718096] sm:text-base">
            From everyday appliance issues to complex repairs, our skilled
            technicians are ready to bring comfort back to your home.
          </p>
        </div>

        {/* Suspense */}
        <Suspense fallback={<ServicesLoading />}>
          <ServicesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
};

export default ServicesSection;