export interface Plant {
  id: string;
  name: string;
  code: string | null;
}

export interface Operation {
  id: string;
  name: string;
  description: string | null;
}

export type VolumeRangeKey =
  | "VOLUME_300KG"
  | "VOLUME_500KG"
  | "VOLUME_1T"
  | "VOLUME_3T"
  | "VOLUME_5T"
  | "VOLUME_10T"
  | "VOLUME_20T"
  | "VOLUME_30T";

export interface PlantOperationMarginRecord {
  id: string;
  plantId: string;
  operationId: string;
  volumeRange: VolumeRangeKey;
  marginPercent: number;
}

export interface IPlantRepository {
  findAll(): Promise<Plant[]>;
  findById(id: string): Promise<Plant | null>;
  create(data: { name: string; code?: string | null }): Promise<Plant>;
}

export interface IOperationRepository {
  findAll(): Promise<Operation[]>;
  findMany(skip: number, take: number): Promise<Operation[]>;
  count(): Promise<number>;
  findManyWithMarginsByPlant(plantId: string, skip: number, take: number): Promise<Operation[]>;
  countWithMarginsByPlant(plantId: string): Promise<number>;
  findById(id: string): Promise<Operation | null>;
  create(data: { name: string; description?: string | null }): Promise<Operation>;
  update(id: string, data: { name?: string; description?: string | null }): Promise<Operation>;
}

export interface MarginInput {
  volumeRange: VolumeRangeKey;
  marginPercent: number;
}

export interface IPlantOperationMarginRepository {
  findManyByPlantId(plantId: string): Promise<PlantOperationMarginRecord[]>;
  upsertMany(plantId: string, operationId: string, margins: MarginInput[]): Promise<PlantOperationMarginRecord[]>;
}
