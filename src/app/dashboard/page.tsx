"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { dashboardPathFor } from "@/lib/roles";

// Entry point of /dashboard → sends each user to their own
// role-based dashboard (or to sign-in when logged out).
const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      router.replace(dashboardPathFor(session.user.role));
    } else {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={34}
          className="animate-spin text-[#d28b53]"
          aria-label="Loading dashboard"
        />

        <p className="text-sm font-semibold text-stone-500">
          Taking you to your dashboard…
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
