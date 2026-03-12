-- CreateEnum
CREATE TYPE "VolumeRangeKey" AS ENUM ('VOLUME_300KG', 'VOLUME_500KG', 'VOLUME_1T', 'VOLUME_3T', 'VOLUME_5T', 'VOLUME_10T', 'VOLUME_20T', 'VOLUME_30T');

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantOperationMargin" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "volumeRange" "VolumeRangeKey" NOT NULL,
    "marginPercent" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "PlantOperationMargin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_code_key" ON "Plant"("code");

-- CreateIndex
CREATE INDEX "PlantOperationMargin_plantId_idx" ON "PlantOperationMargin"("plantId");

-- CreateIndex
CREATE INDEX "PlantOperationMargin_operationId_idx" ON "PlantOperationMargin"("operationId");

-- CreateIndex
CREATE UNIQUE INDEX "PlantOperationMargin_plantId_operationId_volumeRange_key" ON "PlantOperationMargin"("plantId", "operationId", "volumeRange");

-- AddForeignKey
ALTER TABLE "PlantOperationMargin" ADD CONSTRAINT "PlantOperationMargin_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantOperationMargin" ADD CONSTRAINT "PlantOperationMargin_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
