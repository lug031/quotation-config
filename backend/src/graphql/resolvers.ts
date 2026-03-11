import { hasLowMarginAlert } from "../domain/constants";
import * as useCases from "../domain/useCases";
import { PlantRepository } from "../infra/prisma/PlantRepository";
import { OperationRepository } from "../infra/prisma/OperationRepository";
import { PlantOperationMarginRepository } from "../infra/prisma/PlantOperationMarginRepository";
import type { MarginInput, PlantOperationMarginRecord } from "../domain/repositories";
import { ValidationError } from "../domain/errors";
import { GraphQLError } from "graphql";

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
      operationsWithMarginsByPlant: (_: unknown, { plantId }: { plantId: string }) =>
        useCases.getOperationsWithMarginsByPlant(OperationRepository, PlantOperationMarginRepository, plantId),
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
      ) =>
        useCases
          .saveOperationMargins(PlantOperationMarginRepository, plantId, operationId, margins)
          .then((list) => list.map(marginToGraphQL))
          .catch((err: unknown) => {
            if (err instanceof ValidationError) {
              throw new GraphQLError(err.message, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
            throw err;
          }),
    },
  };
}
