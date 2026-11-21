import React, { Suspense } from "react";

import {
  Inbox,
  Users,
  Wrench,
  ClipboardList,
} from "lucide-react";

import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import { ServerSession } from "@/serverapi";
import { getTechnicianBookings } from "@/allapi";
import ViewRequestedButton from "./ViewRequestedButton";
interface Booking {
  _id: string;
  serviceId?: string;
  image?: string;
  title?: string;
  category?: string;
  customerName?: string;
  customerEmail?: string;
  technicianEmail?: string;
  location?: string;
  status?: string;
  preferredDate?: string;
  preferredTime?: string;
}

interface ServiceGroup {
  serviceId: string;
  title: string;
  image?: string;
  category?: string;
  applications: Booking[];
}

async function RequestsContent() {
  const session = await ServerSession();
  const email = session?.email;

  if (!email) {
    return (
      <DashboardShell
        role="technician"
        title="Service Requests"
        subtitle="Manage your customer requests"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Inbox className="mx-auto mb-3 text-slate-400" size={36} />

          <h2 className="font-semibold text-[#243b53]">
            Please login first
          </h2>
        </div>
      </DashboardShell>
    );
  }

  const bookings: Booking[] = await getTechnicianBookings({ email });

  // Group bookings by service
  const serviceMap = new Map<string, ServiceGroup>();

  bookings.forEach((booking, index) => {
    const serviceId = String(
      booking.serviceId ||
        booking.title ||
        booking._id ||
        `service-${index}`
    );

    if (!serviceMap.has(serviceId)) {
      serviceMap.set(serviceId, {
        serviceId,
        title: booking.title || "Untitled Service",
        image: booking.image,
        category: booking.category,
        applications: [],
      });
    }

    serviceMap.get(serviceId)!.applications.push(booking);
  });

  const groupedServices = Array.from(serviceMap.values());

  return (
    <DashboardShell
      role="technician"
      title="Service Requests"
      subtitle="Manage customer requests for your services"
    >
      <div className="space-y-5">

        {/* Total Requests */}
        <div className="flex max-w-xs items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#243b53]/10 text-[#243b53]">
            <Inbox size={21} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Requests
            </p>

            <h2 className="text-xl font-bold text-[#243b53]">
              {bookings.length}
            </h2>
          </div>
        </div>

        {/* Service Requests */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#243b53]">
              Your Service Requests
            </h2>

            <span className="rounded-full bg-[#f4e7db] px-3 py-1 text-xs font-semibold text-[#8c6548]">
              {groupedServices.length} Services
            </span>
          </div>

          {groupedServices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <ClipboardList
                className="mx-auto mb-3 text-slate-400"
                size={32}
              />

              <h3 className="font-semibold text-[#243b53]">
                No Requests Found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Customer requests for your services will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedServices.map((service) => (
                <div
                  key={service.serviceId}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#d28b53]/60 hover:shadow-md sm:h-32 sm:flex-row"
                >
                  {/* Service Image */}
                  <div className="h-32 shrink-0 bg-slate-100 sm:h-full sm:w-36">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Wrench size={30} />
                      </div>
                    )}
                  </div>

                  {/* Service Information */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center sm:px-4">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-md bg-[#f4e7db] px-2.5 py-1 text-[11px] font-medium text-[#8c6548]">
                        {service.category || "General Service"}
                      </span>

                      <h3 className="mt-1.5 truncate text-base font-bold text-[#243b53]">
                        {service.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Users size={14} className="text-[#d28b53]" />

                        <span>
                          {service.applications.length} Customer Requests
                        </span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                      <span className="rounded-md bg-[#243b53]/10 px-2.5 py-1.5 text-xs font-bold text-[#243b53]">
                        {service.applications.length} Requests
                      </span>

                      {/* View Requested Modal */}
                      <ViewRequestedButton
                        serviceId={service.serviceId}
                        bookings={service.applications}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function RequestsLoading() {
  return (
    <DashboardShell
      role="technician"
      title="Service Requests"
      subtitle="Loading your customer requests..."
    >
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex h-32 overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="w-36 bg-slate-200" />

            <div className="flex flex-1 flex-col justify-center gap-3 p-4">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="h-3 w-32 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsLoading />}>
      <RequestsContent />
    </Suspense>
  );
}