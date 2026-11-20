"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Star,
  Clock,
  Wrench,
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "AC Repair & Servicing",
    category: "Home Appliance",
    description:
      "Professional AC repair, installation, gas refill and regular servicing.",
    image:
      "https://images.pexels.com/photos/5463580/pexels-photo-5463580.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "৳800",
    rating: "4.9",
    reviews: 124,
    duration: "1-2 Hours",
  },
  {
    id: 2,
    title: "Refrigerator Repair",
    category: "Home Appliance",
    description:
      "Fix cooling problems, compressor issues and refrigerator leaks.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=85",
    price: "৳600",
    rating: "4.8",
    reviews: 98,
    duration: "1-3 Hours",
  },
  {
    id: 3,
    title: "TV Repair Service",
    category: "Electronics",
    description:
      "Expert LED, LCD and Smart TV troubleshooting and repair services.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=85",
    price: "৳500",
    rating: "4.9",
    reviews: 86,
    duration: "1-2 Hours",
  },
  {
    id: 4,
    title: "Washing Machine Repair",
    category: "Home Appliance",
    description:
      "Reliable washing machine repair for all major brands and models.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=85",
    price: "৳700",
    rating: "4.7",
    reviews: 76,
    duration: "1-2 Hours",
  },
  {
    id: 5,
    title: "Microwave Oven Repair",
    category: "Electronics",
    description:
      "Professional microwave repair, heating issues and component replacement.",
    image:
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=85",
    price: "৳450",
    rating: "4.8",
    reviews: 65,
    duration: "1 Hour",
  },
  {
    id: 6,
    title: "Laptop & Computer Repair",
    category: "Electronics",
    description:
      "Hardware troubleshooting, software installation and laptop servicing.",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85",
    price: "৳500",
    rating: "4.9",
    reviews: 112,
    duration: "1-3 Hours",
  },
];

const ServicesSection = () => {
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
            <span className="text-[#d28b53]"> Trusted Results.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#718096] sm:text-base">
            From everyday appliance issues to complex repairs, our skilled
            technicians are ready to bring comfort back to your home.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group overflow-hidden rounded-2xl border border-[#eee5dc] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#30251e]/10"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-[#f1ece6]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Category */}
                <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#8c6548] shadow-sm">
                  {service.category}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 rounded-xl bg-[#243b53] px-4 py-2 text-sm font-bold text-white shadow-lg">
                  From {service.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[#d28b53]">
                    <Star size={15} fill="currentColor" />
                    <span className="text-sm font-bold text-[#243b53]">
                      {service.rating}
                    </span>
                  </div>

                  <span className="text-xs text-stone-400">
                    ({service.reviews} reviews)
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#243b53] transition-colors group-hover:text-[#d28b53]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#718096]">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <Clock size={15} className="text-[#d28b53]" />
                    {service.duration}
                  </div>

                  <Link
                    href={`/services/${service.id}`}
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

      </div>
    </section>
  );
};

export default ServicesSection;