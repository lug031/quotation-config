import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PLANTS } from "../../../graphql";
import type { Plant } from "../types";

export function usePlants() {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const { data, loading, error } = useQuery<{ plants: Plant[] }>(GET_PLANTS);

  const plants = data?.plants ?? [];
  const plantId = selectedPlantId ?? plants[0]?.id ?? null;

  return {
    plants,
    plantId,
    setSelectedPlantId,
    loading,
    error,
  };
}
