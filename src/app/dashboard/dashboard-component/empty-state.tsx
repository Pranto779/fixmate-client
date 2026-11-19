import React from "react";
import type { LucideIcon } from "lucide-react";

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

// ================= EMPTY STATE =================
// Friendly placeholder for pages that have no data yet.

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Empty className="rounded-2xl border border-stone-200 bg-white p-14 shadow-sm">
      <EmptyMedia
        variant="icon"
        className="size-14 rounded-2xl bg-[#d28b53]/15 text-[#d28b53]"
      >
        <Icon className="size-6" aria-hidden="true" />
      </EmptyMedia>

      <EmptyHeader>
        <EmptyTitle className="text-base font-extrabold text-[#243b53]">
          {title}
        </EmptyTitle>

        <EmptyDescription className="max-w-md text-stone-500">
          {description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
