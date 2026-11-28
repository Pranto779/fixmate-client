"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  AlertCircle,
  Clock3,
  Loader2,
  RefreshCw,
  Users,
  Wrench,
} from "lucide-react";

import { AllUser, getallServices } from "@/allapi";
import DashboardShell from "@/app/dashboard/dashboard-component/dashboard-shell";
import StatCard from "@/app/dashboard/dashboard-component/stat-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type UserRecord = Record<string, unknown>;
type ServiceRecord = Record<string, unknown>;

type StatusType = "pending" | "accepted" | "cancelled";

const isRecordArray = (
  value: unknown
): value is Record<string, unknown>[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item)
  );

const chartConfigs: Record<StatusType, ChartConfig> = {
  pending: {
    count: {
      label: "Pending",
      color: "#e87963",
    },
  },
  accepted: {
    count: {
      label: "Accepted",
      color: "#e9ae50",
    },
  },
  cancelled: {
    count: {
      label: "Cancelled",
      color: "#5795dc",
    },
  },
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getChartData = (
  services: ServiceRecord[],
  status: StatusType
) => {
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    return {
      key: getDateKey(date),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: 0,
    };
  });

  services.forEach((service) => {
    if (service.approvalStatus !== status) return;

    const createdAt = service.createdAt;

    if (
      typeof createdAt !== "string" &&
      !(createdAt instanceof Date)
    ) {
      return;
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return;

    const key = getDateKey(date);
    const matchedDate = dates.find((item) => item.key === key);

    if (matchedDate) {
      matchedDate.count += 1;
    }
  });

  return dates;
};

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchOverviewData = async () => {
      try {
        const [usersData, servicesData]: [unknown, unknown] =
          await Promise.all([AllUser(), getallServices()]);

        if (
          !isRecordArray(usersData) ||
          !isRecordArray(servicesData)
        ) {
          throw new Error("Unexpected admin overview response");
        }

        if (cancelled) return;

        setUsers(usersData);
        setServices(servicesData);
        setError(false);
      } catch (fetchError) {
        console.error(
          "Failed to load admin overview:",
          fetchError
        );

        if (cancelled) return;

        setUsers([]);
        setServices([]);
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOverviewData();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(false);
    setReloadKey((key) => key + 1);
  }, []);

  const totalUsers = users.length;

  const totalTechnicians = users.filter(
    (user) => user.role === "technician"
  ).length;

  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const acceptedServices = services.filter(
    (service) => service.approvalStatus === "accepted"
  ).length;

  const cancelledServices = services.filter(
    (service) => service.approvalStatus === "cancelled"
  ).length;

  const formatCount = (count: number) =>
    loading || error ? "—" : count.toLocaleString();

  const chartCards: {
    title: string;
    status: StatusType;
    count: number;
    description: string;
  }[] = [
    {
      title: "Pending Services",
      status: "pending",
      count: pendingServices,
      description: "Awaiting approval",
    },
    {
      title: "Accepted Services",
      status: "accepted",
      count: acceptedServices,
      description: "Approved services",
    },
    {
      title: "Cancelled Services",
      status: "cancelled",
      count: cancelledServices,
      description: "Cancelled services",
    },
  ];

  return (
    <DashboardShell
      role="admin"
      title="Admin Overview"
      subtitle="A real-time summary of users, technicians and service approvals across FixMate."
    >
      <div className="space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c18b60]">
              Dashboard / Overview
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#243b53]">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Monitor your platform activity at a glance.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Statistics
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="transition-all duration-300 hover:-translate-y-1">
            <StatCard
              icon={Users}
              label="Total Users"
              value={formatCount(totalUsers)}
              hint="All registered users"
              tone="navy"
            />
          </div>

          <div className="transition-all duration-300 hover:-translate-y-1">
            <StatCard
              icon={Wrench}
              label="Total Technicians"
              value={formatCount(totalTechnicians)}
              hint="Technician accounts"
              tone="sky"
            />
          </div>

          <div className="transition-all duration-300 hover:-translate-y-1">
            <StatCard
              icon={Clock3}
              label="Pending Services"
              value={formatCount(pendingServices)}
              hint="Awaiting approval"
              tone="tan"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div
            className="flex min-h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm"
            role="status"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#c18b60]" />
              <p className="text-sm font-medium text-stone-500">
                Loading admin overview...
              </p>
            </div>
          </div>
        ) : error ? (
          /* Error */
          <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-2xl bg-red-50 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>

              <h2 className="text-lg font-bold text-[#243b53]">
                Failed to load admin overview
              </h2>

              <p className="max-w-md text-sm text-stone-500">
                User and service statistics could not be retrieved.
                Please try again.
              </p>

              <button
                type="button"
                onClick={retryFetch}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#243b53] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b2f43]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Mini Area Charts */
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#243b53]">
                Service Analytics
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Service approval statistics at a glance.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {chartCards.map((item) => {
                const chartData = getChartData(
                  services,
                  item.status
                );

                const hasDateData = services.some((service) => {
                  if (service.approvalStatus !== item.status) {
                    return false;
                  }

                  const createdAt = service.createdAt;

                  if (
                    typeof createdAt !== "string" &&
                    !(createdAt instanceof Date)
                  ) {
                    return false;
                  }

                  return !Number.isNaN(
                    new Date(createdAt).getTime()
                  );
                });

                return (
                  <div
                    key={item.status}
                    className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="p-5 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-stone-500">
                          {item.title}
                        </p>

                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            item.status === "pending"
                              ? "bg-[#e87963]"
                              : item.status === "accepted"
                              ? "bg-[#e9ae50]"
                              : "bg-[#5795dc]"
                          }`}
                        />
                      </div>

                      <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#243b53]">
                        {item.count.toLocaleString()}
                      </h3>

                      <p className="mt-1 text-xs text-stone-400">
                        {item.description}
                      </p>
                    </div>

                    <div className="px-2 pb-2">
                      {hasDateData ? (
                        <ChartContainer
                          config={chartConfigs[item.status]}
                          className="h-24 w-full aspect-auto"
                        >
                          <AreaChart
                            data={chartData}
                            margin={{
                              top: 8,
                              right: 2,
                              left: 2,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id={`gradient-${item.status}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={
                                    chartConfigs[item.status].count
                                      .color
                                  }
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={
                                    chartConfigs[item.status].count
                                      .color
                                  }
                                  stopOpacity={0.02}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid
                              vertical={false}
                              horizontal={false}
                            />

                            <XAxis
                              dataKey="label"
                              hide
                            />

                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent hideLabel />
                              }
                            />

                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke={
                                chartConfigs[item.status].count.color
                              }
                              strokeWidth={2}
                              fill={`url(#gradient-${item.status})`}
                              fillOpacity={1}
                              dot={false}
                              activeDot={{
                                r: 4,
                                strokeWidth: 0,
                              }}
                            />
                          </AreaChart>
                        </ChartContainer>
                      ) : (
                        <div className="flex h-24 items-center justify-center">
                          <p className="text-xs text-stone-400">
                            No date-based trend data available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </DashboardShell>
  );
};

export default AdminDashboardPage;
