import { gql } from "@apollo/client";

export const VOLUME_RANGE_KEYS = [
  "VOLUME_300KG",
  "VOLUME_500KG",
  "VOLUME_1T",
  "VOLUME_3T",
  "VOLUME_5T",
  "VOLUME_10T",
  "VOLUME_20T",
  "VOLUME_30T",
] as const;

export type VolumeRangeKey = (typeof VOLUME_RANGE_KEYS)[number];

export const GET_PLANTS = gql`
  query GetPlants {
    plants {
      id
      name
      code
    }
  }
`;

export const GET_OPERATIONS_WITH_MARGINS_BY_PLANT = gql`
  query GetOperationsWithMarginsByPlant($plantId: ID!, $limit: Int, $offset: Int, $onlyWithMargins: Boolean) {
    operationsWithMarginsByPlant(plantId: $plantId, limit: $limit, offset: $offset, onlyWithMargins: $onlyWithMargins) {
      items {
        operation {
          id
          name
          description
        }
        margins {
          id
          volumeRange
          marginPercent
          hasLowMarginAlert
        }
      }
      totalCount
    }
  }
`;

export const SAVE_OPERATION_MARGINS = gql`
  mutation SaveOperationMargins($plantId: ID!, $operationId: ID!, $margins: [MarginInput!]!) {
    saveOperationMargins(plantId: $plantId, operationId: $operationId, margins: $margins) {
      id
      volumeRange
      marginPercent
      hasLowMarginAlert
    }
  }
`;

export const CREATE_OPERATION = gql`
  mutation CreateOperation($input: CreateOperationInput!) {
    createOperation(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_OPERATION = gql`
  mutation UpdateOperation($id: ID!, $input: UpdateOperationInput!) {
    updateOperation(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

