import type { VolumeRangeKey } from "../../../graphql";

export function formatVolumeHeader(key: VolumeRangeKey): string {
  switch (key) {
    case "VOLUME_300KG":
      return "300 kg";
    case "VOLUME_500KG":
      return "500 kg";
    case "VOLUME_1T":
      return "1T";
    case "VOLUME_3T":
      return "3T";
    case "VOLUME_5T":
      return "5T";
    case "VOLUME_10T":
      return "10T";
    case "VOLUME_20T":
      return "20T";
    case "VOLUME_30T":
      return "30T";
  }
}
