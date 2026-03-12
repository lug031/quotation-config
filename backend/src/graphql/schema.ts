export const typeDefs = `#graphql
  enum VolumeRangeKey {
    VOLUME_300KG
    VOLUME_500KG
    VOLUME_1T
    VOLUME_3T
    VOLUME_5T
    VOLUME_10T
    VOLUME_20T
    VOLUME_30T
  }

  type Plant {
    id: ID!
    name: String!
    code: String
  }

  type Operation {
    id: ID!
    name: String!
    description: String
  }

  type PlantOperationMargin {
    id: ID!
    plantId: ID!
    operationId: ID!
    volumeRange: VolumeRangeKey!
    marginPercent: Float!
    hasLowMarginAlert: Boolean!
  }

  type OperationWithMargins {
    operation: Operation!
    margins: [PlantOperationMargin!]!
  }

  type OperationsWithMarginsByPlantResult {
    items: [OperationWithMargins!]!
    totalCount: Int!
  }

  type Query {
    plants: [Plant!]!
    plant(id: ID!): Plant
    operations: [Operation!]!
    operation(id: ID!): Operation
    operationsWithMarginsByPlant(plantId: ID!, limit: Int, offset: Int, onlyWithMargins: Boolean): OperationsWithMarginsByPlantResult!
  }

  input CreateOperationInput {
    name: String!
    description: String
  }

  input UpdateOperationInput {
    name: String
    description: String
  }

  input MarginInput {
    volumeRange: VolumeRangeKey!
    marginPercent: Float!
  }

  input CreatePlantInput {
    name: String!
    code: String
  }

  type Mutation {
    createPlant(input: CreatePlantInput!): Plant!
    createOperation(input: CreateOperationInput!): Operation!
    updateOperation(id: ID!, input: UpdateOperationInput!): Operation!
    saveOperationMargins(plantId: ID!, operationId: ID!, margins: [MarginInput!]!): [PlantOperationMargin!]!
  }
`;
