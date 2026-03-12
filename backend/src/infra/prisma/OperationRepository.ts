import { prisma } from "./client";
import type { IOperationRepository, Operation } from "../../domain/repositories";

async function findAll(): Promise<Operation[]> {
  const rows = await prisma.operation.findMany({
    select: { id: true, name: true, description: true },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, description: r.description }));
}

async function findMany(skip: number, take: number): Promise<Operation[]> {
  const rows = await prisma.operation.findMany({
    skip,
    take,
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, description: r.description }));
}

async function count(): Promise<number> {
  return prisma.operation.count();
}

async function findManyWithMarginsByPlant(
  plantId: string,
  skip: number,
  take: number
): Promise<Operation[]> {
  const rows = await prisma.operation.findMany({
    where: { margins: { some: { plantId } } },
    orderBy: { name: "asc" },
    skip,
    take,
    select: { id: true, name: true, description: true },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, description: r.description }));
}

async function countWithMarginsByPlant(plantId: string): Promise<number> {
  return prisma.operation.count({
    where: { margins: { some: { plantId } } },
  });
}

async function findById(id: string): Promise<Operation | null> {
  const row = await prisma.operation.findUnique({
    where: { id },
    select: { id: true, name: true, description: true },
  });
  return row ? { id: row.id, name: row.name, description: row.description } : null;
}

async function create(data: { name: string; description?: string | null }): Promise<Operation> {
  const row = await prisma.operation.create({
    data: { name: data.name, description: data.description ?? undefined },
    select: { id: true, name: true, description: true },
  });
  return { id: row.id, name: row.name, description: row.description };
}

async function update(
  id: string,
  data: { name?: string; description?: string | null }
): Promise<Operation> {
  const row = await prisma.operation.update({
    where: { id },
    data: { name: data.name, description: data.description },
    select: { id: true, name: true, description: true },
  });
  return { id: row.id, name: row.name, description: row.description };
}

export const OperationRepository: IOperationRepository = {
  findAll,
  findMany,
  count,
  findManyWithMarginsByPlant,
  countWithMarginsByPlant,
  findById,
  create,
  update,
};
