"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Clock,
  ShieldCheck,
  Wrench,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getallServices, Service } from "@/allapi";

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getallServices();

        if (Array.isArray(data)) {
          const acceptedServices = data.filter(
            (service: Service) =>
              service.approvalStatus === "accepted"
          );

          setServices(acceptedServices.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-[#faf9f6] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e9d8c5]/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8c6548]">
              <span className="h-2 w-2 rounded-full bg-[#d28b53]" />
              Our Professional Services
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="text-[#d28b53]">Services</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
              Find trusted professionals for your home appliance
              repair and maintenance needs.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-[#243b53]/15 px-5 py-3 text-sm font-bold text-[#243b53] transition hover:border-[#243b53] hover:bg-[#243b53] hover:text-white"
          >
            Explore Services

            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-stone-200" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100" />
                  <div className="h-16 animate-pulse rounded bg-stone-100" />
                  <div className="h-10 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9d8c5]/50 text-[#d28b53]">
              <Wrench size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#243b53]">
              No Featured Services Available
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              New repair services will appear here once they are approved.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#243b53] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d28b53]"
            >
              Explore Services
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => (
              <div
                key={service._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d28b53]/40 hover:shadow-xl hover:shadow-[#243b53]/10"
              >
                {/* Image */}
                <div className="relative h-56 shrink-0 overflow-hidden bg-[#e9d8c5]">

                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#8c6548]">
                      <Wrench size={45} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172b40]/50 via-transparent to-transparent" />

                  {/* Category */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#243b53] shadow-sm">
                    {service.category}
                  </span>

                  {/* Approval Badge */}
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                    <ShieldCheck size={13} />
                    Verified
                  </span>

                  {/* Service Mode */}
                  <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-[#243b53]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    <MapPin size={12} />
                    {service.serviceMode}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">

                  {/* Title */}
                  <div className="min-h-[76px]">
                    <h3 className="line-clamp-2 text-xl font-bold text-[#243b53] transition-colors group-hover:text-[#d28b53]">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">
                      {service.description}
                    </p>
                  </div>

                  {/* Technician */}
                  <div className="my-5 flex items-center gap-3 border-y border-stone-100 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9d8c5] text-sm font-extrabold text-[#8c6548]">
                      {service.technicianName?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-stone-400">
                        Service Technician
                      </p>

                      <p className="truncate text-sm font-bold text-[#243b53]">
                        {service.technicianName}
                      </p>
                    </div>

                    <ShieldCheck
                      size={19}
                      className="shrink-0 text-green-600"
                    />
                  </div>

                  {/* Duration & Availability */}
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock size={15} className="text-[#d28b53]" />
                      <span>{service.estimatedDuration}</span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        service.isAvailable
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Price & Button */}
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                    <div>
                      <p className="text-[11px] font-medium text-stone-400">
                        Starting from
                      </p>

                      <p className="text-xl font-extrabold text-[#d28b53]">
                        ${service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="group/btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#243b53] px-4 py-3 text-xs font-bold text-white transition-all duration-300 hover:bg-[#d28b53]"
                    >
                      View Details

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Bottom Note */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-stone-500">
          <Clock size={16} className="text-[#d28b53]" />

          <span>
            Quality service, trusted technicians, and reliable repairs.
          </span>
        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;