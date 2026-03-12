import { DEFAULT_QUERY_LIMIT, hasLowMarginAlert } from "../domain/constants";
import { ValidationError } from "../domain/errors";
import type { MarginInput, PlantOperationMarginRecord } from "../domain/repositories";
import * as useCases from "../domain/useCases";
import { PlantOperationMarginRepository } from "../infra/prisma/PlantOperationMarginRepository";
import { OperationRepository } from "../infra/prisma/OperationRepository";
import { PlantRepository } from "../infra/prisma/PlantRepository";
import { GraphQLError } from "graphql";
import { logger } from "../logger";

function marginToGraphQL(m: PlantOperationMarginRecord) {
  return {
    id: m.id,
    plantId: m.plantId,
    operationId: m.operationId,
    volumeRange: m.volumeRange,
    marginPercent: m.marginPercent,
    hasLowMarginAlert: hasLowMarginAlert(m.marginPercent),
  };
}

export function buildResolvers() {
  return {
    Query: {
      plants: () => useCases.getPlants(PlantRepository),
      plant: (_: unknown, { id }: { id: string }) => useCases.getPlant(PlantRepository, id),
      operations: () => useCases.getOperations(OperationRepository),
      operation: (_: unknown, { id }: { id: string }) => useCases.getOperation(OperationRepository, id),
      operationsWithMarginsByPlant: (
        _: unknown,
        {
          plantId,
          limit,
          offset,
          onlyWithMargins,
        }: {
          plantId: string;
          limit?: number | null;
          offset?: number | null;
          onlyWithMargins?: boolean | null;
        }
      ) => {
        const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || DEFAULT_QUERY_LIMIT)));
        const safeOffset = Math.max(0, Math.floor(Number(offset) || 0));
        const filterOnlyWithMargins = Boolean(onlyWithMargins);
        logger.info("operationsWithMarginsByPlant", {
          plantId,
          limit: safeLimit,
          offset: safeOffset,
          onlyWithMargins: filterOnlyWithMargins,
        });
        return useCases.getOperationsWithMarginsByPlant(
          OperationRepository,
          PlantOperationMarginRepository,
          plantId,
          safeLimit,
          safeOffset,
          filterOnlyWithMargins
        );
      },
    },
    OperationWithMargins: {
      operation: (parent: { operation: { id: string; name: string; description: string | null } }) =>
        parent.operation,
      margins: (parent: { margins: PlantOperationMarginRecord[] }) =>
        parent.margins.map(marginToGraphQL),
    },
    Mutation: {
      createPlant: (_: unknown, { input }: { input: { name: string; code?: string } }) =>
        useCases.createPlant(PlantRepository, input),
      createOperation: (_: unknown, { input }: { input: { name: string; description?: string } }) =>
        useCases.createOperation(OperationRepository, input),
      updateOperation: (
        _: unknown,
        { id, input }: { id: string; input: { name?: string; description?: string } }
      ) => useCases.updateOperation(OperationRepository, id, input),
      saveOperationMargins: (
        _: unknown,
        {
          plantId,
          operationId,
          margins,
        }: { plantId: string; operationId: string; margins: MarginInput[] }
      ) => {
        logger.info("saveOperationMargins", { plantId, operationId, marginsCount: margins.length });
        return useCases
          .saveOperationMargins(PlantOperationMarginRepository, plantId, operationId, margins)
          .then((list) => list.map(marginToGraphQL))
          .catch((err: unknown) => {
            if (err instanceof ValidationError) {
              throw new GraphQLError(err.message, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
            throw err;
          });
      },
    },
  };
}
