import React from "react";

// ================= LIST CARD =================
// Generic "recent items" panel: title + rows with an optional badge.

export type ListTone = "default" | "success" | "warning" | "danger";

export type ListItem = {
  id: string;
  title: string;
  meta?: string;
  badge?: string;
  badgeTone?: ListTone;
};

const BADGE_TONES: Record<ListTone, string> = {
  default: "bg-stone-100 text-stone-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-rose-600",
};

type ListCardProps = {
  title: string;
  items: ListItem[];
  emptyText?: string;
};

const ListCard = ({
  title,
  items,
  emptyText = "Nothing here yet.",
}: ListCardProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Heading */}
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <h2 className="text-base font-extrabold text-[#243b53]">{title}</h2>

        <span className="text-xs font-bold text-stone-400">
          {items.length} total
        </span>
      </div>

      {/* Rows */}
      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-stone-400">
          {emptyText}
        </p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#faf9f6]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#243b53]">
                  {item.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-stone-500">
                  {item.id}
                  {item.meta ? ` · ${item.meta}` : ""}
                </p>
              </div>

              {item.badge && (
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${BADGE_TONES[item.badgeTone ?? "default"]}`}
                >
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ListCard;
