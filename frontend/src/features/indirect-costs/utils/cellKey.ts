import type { VolumeRangeKey } from "../../../graphql";

export function cellKey(plantId: string, operationId: string, volumeRange: VolumeRangeKey): string {
  return `${plantId}__${operationId}__${volumeRange}`;
}
