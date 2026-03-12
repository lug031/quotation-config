export const LOW_MARGIN_ALERT_THRESHOLD_PERCENT = 5;

export const DEFAULT_QUERY_LIMIT = 50;

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

export type VolumeRangeKeyConstant = (typeof VOLUME_RANGE_KEYS)[number];

export function hasLowMarginAlert(marginPercent: number): boolean {
  return marginPercent <= LOW_MARGIN_ALERT_THRESHOLD_PERCENT;
}
