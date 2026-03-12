import { VolumeRangeKey as PrismaVolumeRangeKey } from "@prisma/client";
import { prisma } from "./client";
import type {
  PlantOperationMarginRecord,
  VolumeRangeKey,
  MarginInput,
  IPlantOperationMarginRepository,
} from "../../domain/repositories";

const prismaToDomain = (r: {
  id: string;
  plantId: string;
  operationId: string;
  volumeRange: PrismaVolumeRangeKey;
  marginPercent: unknown;
}): PlantOperationMarginRecord => ({
  id: r.id,
  plantId: r.plantId,
  operationId: r.operationId,
  volumeRange: r.volumeRange as VolumeRangeKey,
  marginPercent: Number(r.marginPercent),
});

async function findManyByPlantId(plantId: string): Promise<PlantOperationMarginRecord[]> {
  const rows = await prisma.plantOperationMargin.findMany({
    where: { plantId },
  });
  return rows.map(prismaToDomain);
}

async function upsertMany(
  plantId: string,
  operationId: string,
  margins: MarginInput[]
): Promise<PlantOperationMarginRecord[]> {
  const results: PlantOperationMarginRecord[] = [];
  for (const m of margins) {
    const row = await prisma.plantOperationMargin.upsert({
      where: {
        plantId_operationId_volumeRange: { plantId, operationId, volumeRange: m.volumeRange as PrismaVolumeRangeKey },
      },
      create: {
        plantId,
        operationId,
        volumeRange: m.volumeRange as PrismaVolumeRangeKey,
        marginPercent: m.marginPercent,
      },
      update: { marginPercent: m.marginPercent },
    });
    results.push(prismaToDomain(row));
  }
  return results;
}

export const PlantOperationMarginRepository: IPlantOperationMarginRepository = {
  findManyByPlantId,
  upsertMany,
};
