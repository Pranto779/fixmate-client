"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Smartphone,
  Laptop,
  AirVent,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ShieldCheck,
  Users,
  Wallet,
  Clock,
  Star,
  ArrowUpRight,
  Wrench,
  BadgeCheck,
  Headphones,
} from "lucide-react";

import { getallServices, Service } from "@/allapi";

const categories = [
  {
    id: "smartphone",
    name: "Smartphone",
    description: "Mobile repair & servicing",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-600",
    dbCategories: ["smartphone", "mobile", "mobile phone"],
  },
  {
    id: "laptop-pc",
    name: "Laptop & PC",
    description: "Computer repair solutions",
    icon: Laptop,
    color: "bg-purple-50 text-purple-600",
    dbCategories: ["laptop & pc", "laptop", "pc", "computer"],
  },
  {
    id: "ac",
    name: "Air Conditioner",
    description: "AC repair & installation",
    icon: AirVent,
    color: "bg-cyan-50 text-cyan-600",
    dbCategories: ["ac", "air conditioner", "air conditioning"],
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    description: "Fridge repair & maintenance",
    icon: Refrigerator,
    color: "bg-green-50 text-green-600",
    dbCategories: ["refrigerator", "fridge"],
  },
  {
    id: "tv",
    name: "Television",
    description: "LED, LCD & Smart TV repair",
    icon: Tv,
    color: "bg-orange-50 text-orange-600",
    dbCategories: ["tv", "television"],
  },
  {
    id: "washing-machine",
    name: "Washing Machine",
    description: "Washer repair & servicing",
    icon: WashingMachine,
    color: "bg-pink-50 text-pink-600",
    dbCategories: ["washing machine", "washer"],
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Home electrical solutions",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
    dbCategories: ["electrical", "electric"],
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "Every technician goes through a verification process to ensure safe and reliable service.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Pay After Service",
    description:
      "Get your repair completed first and pay after you are satisfied with the service.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock,
    title: "Quick & Easy Booking",
    description:
      "Book your preferred repair service in just a few simple steps.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    description:
      "Our support team is ready to help you throughout your service journey.",
    color: "bg-purple-50 text-purple-600",
  },
];

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Verified Technicians",
  },
  {
    icon: Wrench,
    value: "10K+",
    label: "Jobs Completed",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Customer Rating",
  },
];

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    review:
      "I booked an AC repair service through FixMate. The technician was professional, arrived on time, and fixed the issue perfectly.",
  },
  {
    name: "Rakib Hasan",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    review:
      "My refrigerator had stopped working. FixMate helped me find a skilled technician quickly. The whole experience was smooth.",
  },
  {
    name: "Sadia Islam",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=44",
    rating: 5,
    review:
      "Great platform for finding trusted repair professionals. Easy booking and transparent pricing made everything convenient.",
  },
];

const PopularCategories = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getallServices();

        if (Array.isArray(data)) {
          setServices(
            data.filter(
              (service: Service) =>
                service.approvalStatus === "accepted"
            )
          );
        }
      } catch (error) {
        console.error("Failed to load category counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* POPULAR CATEGORIES */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9d8c5]/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8c6548]">
              <Wrench size={14} />
              Explore Our Categories
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#243b53] sm:text-4xl lg:text-5xl">
              What Do You Need{" "}
              <span className="text-[#d28b53]">Fixed?</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-stone-500 sm:text-base">
              From smartphones to home appliances, find the right
              professional for every repair need.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              const count = services.filter((service) =>
                category.dbCategories.includes(
                  service.category?.trim().toLowerCase()
                )
              ).length;

              return (
                <Link
                  key={category.id}
                  href={`/services?category=${encodeURIComponent(category.id)}`}
                  className="group relative flex min-h-[190px] flex-col items-start rounded-2xl border border-stone-200 bg-[#faf9f6] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#d28b53]/50 hover:shadow-xl sm:p-6"
                >
                  {/* Icon */}
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${category.color}`}
                  >
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-extrabold text-[#243b53] sm:text-lg">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    {category.description}
                  </p>

                  <div className="mt-auto flex w-full items-center justify-between pt-4">
                    <span className="text-[10px] font-bold text-[#8c6548] sm:text-xs">
                      {loading ? "Loading..." : `${count} Services`}
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9d8c5]/60 text-[#8c6548] transition-all group-hover:bg-[#d28b53] group-hover:text-white">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden bg-[#243b53] px-4 py-20 sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[55px] border-white/[0.04]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#e9c09d]">
              <ShieldCheck size={15} />
              Why Choose FixMate
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Repair Services You Can{" "}
              <span className="text-[#e4a878]">Trust</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
              We make appliance repair simple, secure, and stress-free
              with trusted professionals and customer-first service.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point, index) => {
              const Icon = point.icon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-white/[0.07] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#e4a878]/50 hover:bg-white/[0.11]"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${point.color}`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {point.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {point.description}
                  </p>

                  <div className="mt-5 h-1 w-10 rounded-full bg-[#d28b53] transition-all duration-300 group-hover:w-20" />
                </div>
              );
            })}
          </div>

          {/* Platform Stats */}
          <div className="mt-16 grid grid-cols-1 gap-5 border-t border-white/15 pt-10 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-4 py-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d28b53]/15 text-[#e4a878]">
                    <Icon size={25} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                      {stat.value}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-white/55">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="bg-[#faf9f6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9d8c5]/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8c6548]">
              <Star size={14} />
              Customer Experiences
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-[#243b53] sm:text-4xl">
              What Our Customers{" "}
              <span className="text-[#d28b53]">Say</span>
            </h2>

            <p className="mt-4 text-sm text-stone-500 sm:text-base">
              Real experiences from people who trust FixMate.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-[#d28b53] text-[#d28b53]"
                    />
                  ))}
                </div>

                <p className="my-6 flex-1 text-sm leading-7 text-stone-600">
                  “{testimonial.review}”
                </p>

                <div className="flex items-center gap-3 border-t border-stone-100 pt-5">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-[#243b53]">
                      {testimonial.name}
                    </h4>

                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                      <BadgeCheck
                        size={13}
                        className="text-green-600"
                      />
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default PopularCategories;