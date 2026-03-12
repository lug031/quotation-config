import { LOW_MARGIN_ALERT_THRESHOLD_PERCENT } from "./constants";
import { ValidationError } from "./errors";
import type {
  IPlantRepository,
  IOperationRepository,
  IPlantOperationMarginRepository,
  Plant,
  Operation,
  PlantOperationMarginRecord,
  MarginInput,
} from "./repositories";

export interface OperationWithMargins {
  operation: Operation;
  margins: PlantOperationMarginRecord[];
}

export async function getPlants(plantRepo: IPlantRepository): Promise<Plant[]> {
  return plantRepo.findAll();
}

export async function getPlant(plantRepo: IPlantRepository, id: string): Promise<Plant | null> {
  return plantRepo.findById(id);
}

export async function createPlant(
  plantRepo: IPlantRepository,
  data: { name: string; code?: string | null }
): Promise<Plant> {
  return plantRepo.create(data);
}

export async function getOperations(operationRepo: IOperationRepository): Promise<Operation[]> {
  return operationRepo.findAll();
}

export async function getOperation(
  operationRepo: IOperationRepository,
  id: string
): Promise<Operation | null> {
  return operationRepo.findById(id);
}

export interface OperationsWithMarginsByPlantResult {
  items: OperationWithMargins[];
  totalCount: number;
}

export async function getOperationsWithMarginsByPlant(
  operationRepo: IOperationRepository,
  marginRepo: IPlantOperationMarginRepository,
  plantId: string,
  limit: number,
  offset: number,
  onlyWithMargins: boolean
): Promise<OperationsWithMarginsByPlantResult> {
  const [operations, totalCount, marginsForPlant] = await Promise.all([
    onlyWithMargins
      ? operationRepo.findManyWithMarginsByPlant(plantId, offset, limit)
      : operationRepo.findMany(offset, limit),
    onlyWithMargins
      ? operationRepo.countWithMarginsByPlant(plantId)
      : operationRepo.count(),
    marginRepo.findManyByPlantId(plantId),
  ]);
  const marginsByOperationId = new Map<string, PlantOperationMarginRecord[]>();
  for (const m of marginsForPlant) {
    const list = marginsByOperationId.get(m.operationId) ?? [];
    list.push(m);
    marginsByOperationId.set(m.operationId, list);
  }
  const items = operations.map((operation) => ({
    operation,
    margins: marginsByOperationId.get(operation.id) ?? [],
  }));
  return { items, totalCount };
}

export async function createOperation(
  operationRepo: IOperationRepository,
  data: { name: string; description?: string | null }
): Promise<Operation> {
  return operationRepo.create(data);
}

export async function updateOperation(
  operationRepo: IOperationRepository,
  id: string,
  data: { name?: string; description?: string | null }
): Promise<Operation> {
  return operationRepo.update(id, data);
}

export async function saveOperationMargins(
  marginRepo: IPlantOperationMarginRepository,
  plantId: string,
  operationId: string,
  margins: MarginInput[]
): Promise<PlantOperationMarginRecord[]> {
  for (const m of margins) {
    if (m.marginPercent < 0 || m.marginPercent > 100) {
      throw new ValidationError("El margen debe estar entre 0 y 100.");
    }
    if (m.marginPercent < LOW_MARGIN_ALERT_THRESHOLD_PERCENT) {
      throw new ValidationError(
        `El margen no puede ser menor a ${LOW_MARGIN_ALERT_THRESHOLD_PERCENT}%.`
      );
    }
  }
  return marginRepo.upsertMany(plantId, operationId, margins);
}
