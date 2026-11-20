"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    id: "1",
    title: "Air Conditioner Repair",
    category: "AC Repair",
    mode: "On-site Service",
    price: 800,
    technician: "Rahim Ahmed",
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "2",
    title: "Refrigerator Repair",
    category: "Fridge Repair",
    mode: "On-site Service",
    price: 600,
    technician: "Karim Hasan",
    rating: 4.8,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "3",
    title: "Washing Machine Service",
    category: "Home Appliance",
    mode: "On-site Service",
    price: 500,
    technician: "Sabbir Hossain",
    rating: 4.9,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "4",
    title: "Electrical Wiring & Repair",
    category: "Electrical",
    mode: "On-site Service",
    price: 400,
    technician: "Tanvir Islam",
    rating: 4.7,
    reviews: 72,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "5",
    title: "Microwave Oven Repair",
    category: "Kitchen Appliance",
    mode: "Workshop Service",
    price: 450,
    technician: "Rashed Mia",
    rating: 4.8,
    reviews: 65,
    image:
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "6",
    title: "Home Plumbing Service",
    category: "Plumbing",
    mode: "On-site Service",
    price: 350,
    technician: "Mahmud Rahman",
    rating: 4.9,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=85",
  },
];

const FeaturedServices = () => {
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <div
              key={service.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d28b53]/40 hover:shadow-xl hover:shadow-[#243b53]/10"
            >
              {/* Image */}
              <div className="relative h-56 shrink-0 overflow-hidden bg-[#e9d8c5]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172b40]/50 via-transparent to-transparent" />

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#243b53] shadow-sm">
                  {service.category}
                </span>

                {/* Service Mode */}
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-[#243b53]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <MapPin size={12} />
                  {service.mode}
                </span>

                {/* Rating */}
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-[#243b53] shadow-sm">
                  <Star size={13} className="fill-[#d28b53] text-[#d28b53]" />
                  {service.rating}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-5">

                {/* Title */}
                <div className="min-h-[64px]">
                  <h3 className="line-clamp-2 text-xl font-bold text-[#243b53] transition-colors group-hover:text-[#d28b53]">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-xs text-stone-400">
                    {service.reviews} customer reviews
                  </p>
                </div>

                {/* Technician */}
                <div className="my-5 flex items-center gap-3 border-y border-stone-100 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9d8c5] text-sm font-extrabold text-[#8c6548]">
                    {service.technician.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-stone-400">
                      Service Technician
                    </p>

                    <p className="truncate text-sm font-bold text-[#243b53]">
                      {service.technician}
                    </p>
                  </div>

                  <ShieldCheck
                    size={19}
                    className="shrink-0 text-green-600"
                  />
                </div>

                {/* Price & Button */}
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-stone-400">
                      Starting from
                    </p>

                    <p className="text-xl font-extrabold text-[#d28b53]">
                      ৳{service.price}
                    </p>
                  </div>

                  <Link
                    href={`/services/${service.id}`}
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
