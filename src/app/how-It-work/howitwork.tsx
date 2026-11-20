"use client";

import React from "react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

import {
  ArrowRight,
  Wrench,
  MoveHorizontal,
  ShieldCheck,
  Clock,
  Headphones,
} from "lucide-react";

const slides = [
  {
    title: "Mobile Repair Service",
    highlight: "Mobile Repair",
    subtitle: "Fast and reliable smartphone repair service.",
    description:
      "We provide expert smartphone repair services, including display replacement, battery issues, charging problems and more.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=90",
  },
  {
    title: "Refrigerator Repair Service",
    highlight: "Fridge Repair",
    subtitle: "Keep your refrigerator cool and running perfectly.",
    description:
      "Our experienced technicians provide reliable refrigerator repair and maintenance services for all major brands.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1920&q=90",
  },
  {
    title: "Air Conditioner Repair Service",
    highlight: "AC Repair",
    subtitle: "Professional AC servicing and repair at your doorstep.",
    description:
      "Get expert AC installation, servicing and repair. We help you enjoy a cool and comfortable home.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1758798157512-f0a864c696c9?auto=format&fit=crop&w=1920&q=90",
  },
  {
    title: "Television Repair Service",
    highlight: "TV Repair",
    subtitle: "Expert solutions for your Smart TV and LED TV.",
    description:
      "We repair TV display, sound, motherboard and connectivity issues with professional care.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1920&q=90",
  },
  {
    title: "Washing Machine Repair Service",
    highlight: "Washing Machine",
    subtitle: "Get your washing machine working like new.",
    description:
      "Reliable washing machine repair for drainage, spinning, water supply and other technical problems.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1920&q=90",
  },
  {
    title: "Laptop Repair Service",
    highlight: "Laptop Repair",
    subtitle: "Complete laptop troubleshooting and repair.",
    description:
      "From hardware problems to software issues, our technicians help restore your laptop's performance.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1920&q=90",
  },
  {
    title: "Microwave Oven Repair Service",
    highlight: "Microwave Repair",
    subtitle: "Quick and dependable kitchen appliance repair.",
    description:
      "Get professional microwave oven repair and maintenance to keep your kitchen running smoothly.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1920&q=90",
  },
];
export default function HowitWorks() {
  const plugin = React.useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
    })
  );

  const steps = [
    {
      number: "01",
      title: "Choose a Service",
      description:
        "Explore our services and choose the repair service you need.",
      icon: "🔍",
    },
    {
      number: "02",
      title: "Book Your Service",
      description:
        "Submit your repair request with a few simple details.",
      icon: "📋",
    },
    {
      number: "03",
      title: "Meet Technician",
      description:
        "Connect with a skilled technician for your repair needs.",
      icon: "👨‍🔧",
    },
    {
      number: "04",
      title: "Get It Fixed",
      description:
        "Get your appliance repaired and enjoy hassle-free service.",
      icon: "🔧",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Trusted Technicians",
      description:
        "Connect with experienced technicians who understand your repair needs.",
    },
    {
      icon: Clock,
      title: "Save Your Time",
      description:
        "Book your service online without wasting time searching for technicians.",
    },
    {
      icon: Headphones,
      title: "Reliable Support",
      description:
        "Get assistance throughout your repair journey whenever you need it.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f6]">
<div className=" text-center">
  <span className="mb-2 mt-2 inline-flex items-center gap-2 rounded-full bg-[#e9d8c5]/50 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#8c6548]">
    <Wrench size={14} />
    Simple Process
  </span>

  <h2 className="text-3xl mb-2 font-extrabold tracking-tight text-[#243b53] sm:text-4xl lg:text-5xl">
    How It <span className="relative text-[#d28b53]">
      Works
      <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-[#d28b53]/30" />
    </span>
  </h2>
</div>
      <section className="bg-[#30251e]">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            loop: true,
            duration: 35,
          }}
          className="relative w-full"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">

                <div
                  className="relative flex h-[450px] items-center justify-center overflow-hidden bg-cover bg-center px-5 md:h-[500px]"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                  }}
                >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Brown Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#30251e]/65 via-[#30251e]/25 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 mx-auto w-full max-w-7xl text-center text-white">

                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-2 text-xs font-medium text-[#f1d1af] backdrop-blur-sm">
                      <Wrench size={16} />
                      {slide.subtitle}
                    </span>

                    <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                      <span className="mt-1 block text-[#e8b98e]">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white drop-shadow-md md:text-base">
                      {slide.description}
                    </p>

                    <Link
                      href="/services"
                      className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#c18b5e] px-7 py-3 text-sm font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#a97549]"
                    >
                      {slide.button}
                      <ArrowRight size={18} />
                    </Link>

                  </div>
                </div>

              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Previous */}
          <CarouselPrevious className="left-4 z-20 border-white/40 bg-black/30 text-white backdrop-blur-md hover:bg-[#c18b5e] hover:text-white md:left-10" />

          {/* Next */}
          <CarouselNext className="right-4 z-20 border-white/40 bg-black/30 text-white backdrop-blur-md hover:bg-[#c18b5e] hover:text-white md:right-10" />

        </Carousel>
      </section>

      {/* SWIPE INDICATOR */}
      <div className="flex items-center justify-center gap-3 border-b border-[#eae3dc] bg-white py-4 text-sm text-gray-500">
        <MoveHorizontal size={18} className="animate-pulse text-[#ad8059]" />
        <span>Swipe or use arrows to explore our services</span>
      </div>

      {/* HOW IT WORKS */}
      <section className="bg-[#faf9f6] px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-[3px] text-[#ad8059]">
              How It Works
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#30251e] md:text-5xl">
              Get Your Repair Done in 4 Easy Steps
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-500">
              FixMate makes appliance repair simple and convenient.
              Follow these four easy steps to get your problem solved.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-[#eae3dc] bg-white p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5eee7] text-3xl transition group-hover:bg-[#30251e]">
                    {step.icon}
                  </div>

                  <span className="text-4xl font-bold text-[#eee8e1]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#30251e]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

    </main>
  );
}