import { prisma } from "./client";
import type { IPlantRepository, Plant } from "../../domain/repositories";

async function findAll(): Promise<Plant[]> {
  const rows = await prisma.plant.findMany({
    select: { id: true, name: true, code: true },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, code: r.code }));
}

async function findById(id: string): Promise<Plant | null> {
  const row = await prisma.plant.findUnique({
    where: { id },
    select: { id: true, name: true, code: true },
  });
  return row ? { id: row.id, name: row.name, code: row.code } : null;
}

async function create(data: { name: string; code?: string | null }): Promise<Plant> {
  const row = await prisma.plant.create({
    data: { name: data.name, code: data.code ?? undefined },
    select: { id: true, name: true, code: true },
  });
  return { id: row.id, name: row.name, code: row.code };
}

export const PlantRepository: IPlantRepository = { findAll, findById, create };
