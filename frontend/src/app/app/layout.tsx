import type { ReactNode } from "react";

import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { DashboardStateProvider } from "@/components/dashboard/DashboardStateProvider";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardStateProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </DashboardStateProvider>
  );
}
