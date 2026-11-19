import React from "react";
import type { LucideIcon } from "lucide-react";

// ================= STAT CARD =================
// Small KPI tile used across all role dashboards.

type StatTone = "navy" | "tan" | "emerald" | "sky" | "rose";

const ICON_TONES: Record<StatTone, string> = {
  navy: "bg-[#243b53]/10 text-[#243b53]",
  tan: "bg-[#d28b53]/15 text-[#d28b53]",
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  rose: "bg-rose-50 text-rose-600",
};

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = "navy",
}: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-xl p-3 ${ICON_TONES[tone]}`}>
          <Icon size={20} aria-hidden="true" />
        </div>

        {hint && (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-500">
            {hint}
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#243b53]">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-stone-500">{label}</p>
    </div>
  );
};

export default StatCard;
