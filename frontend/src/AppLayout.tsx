import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PlantsProvider } from "./contexts/PlantsContext";
import { Sidebar } from "./features/indirect-costs/components/Sidebar";
import { usePlants } from "./features/indirect-costs/hooks/usePlants";
import { SIDEBAR_ITEMS } from "./routes";

export function AppLayout() {
  const plantsState = usePlants();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <PlantsProvider value={plantsState}>
      <div className="flex h-screen overflow-hidden bg-[#f4f6f8] text-slate-900">
        <Sidebar
          plants={plantsState.plants}
          plantId={plantsState.plantId}
          onSelectPlant={plantsState.setSelectedPlantId}
          loadingPlants={plantsState.loading}
          items={SIDEBAR_ITEMS}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        />
        <Outlet />
      </div>
    </PlantsProvider>
  );
}
