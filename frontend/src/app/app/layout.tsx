import type { ReactNode } from "react";

import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { demoAccountData } from "@/data/demo-data";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <DashboardFrame mode={demoAccountData.mode}>{children}</DashboardFrame>;
}
