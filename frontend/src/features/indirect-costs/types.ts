import type { VolumeRangeKey } from "../../graphql";

export type Plant = { id: string; name: string; code: string | null };
export type Operation = { id: string; name: string; description: string | null };
export type Margin = {
  id: string;
  volumeRange: VolumeRangeKey;
  marginPercent: number;
  hasLowMarginAlert: boolean;
};

export type OperationWithMargins = {
  operation: Operation;
  margins: Margin[];
};
