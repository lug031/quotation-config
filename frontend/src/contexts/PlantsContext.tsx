import { createContext, useContext, type ReactNode } from "react";
import type { Plant } from "../features/indirect-costs/types";

export interface PlantsContextValue {
  plants: Plant[];
  plantId: string | null;
  setSelectedPlantId: (id: string) => void;
  loading: boolean;
  error: Error | undefined;
}

const PlantsContext = createContext<PlantsContextValue | null>(null);

export function PlantsProvider({
  value,
  children,
}: {
  value: PlantsContextValue;
  children: ReactNode;
}) {
  return <PlantsContext.Provider value={value}>{children}</PlantsContext.Provider>;
}

export function usePlantsContext(): PlantsContextValue {
  const ctx = useContext(PlantsContext);
  if (!ctx) throw new Error("usePlantsContext must be used within PlantsProvider");
  return ctx;
}
