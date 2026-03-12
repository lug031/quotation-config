import { VOLUME_RANGE_KEYS } from "../../../graphql";
import { formatVolumeHeader } from "../utils/formatVolumeHeader";

const SKELETON_ROW_COUNT = 8;

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-auto">
        <table className="min-w-[1200px] w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-[#1f1f1f] text-xs font-semibold text-white">
              <th className="w-52 border-r border-white/10 px-4 py-3 text-left">Operación</th>
              <th className="w-52 border-r border-white/10 px-4 py-3 text-left">Descripción</th>
              {VOLUME_RANGE_KEYS.map((k) => (
                <th key={k} className="border-r border-white/10 px-3 py-3 text-center last:border-r-0">
                  {formatVolumeHeader(k).replace(" kg", "...")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-b-0">
                <td className="border-r border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-r border-slate-100 px-4 py-3">
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                </td>
                {VOLUME_RANGE_KEYS.map((k) => (
                  <td key={k} className="border-r border-slate-100 px-3 py-2 text-center last:border-r-0">
                    <div className="mx-auto h-9 w-20 animate-pulse rounded-sm bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
