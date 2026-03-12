import { MARGIN_MIN_PERCENT } from "../../constants";

export interface MarginCellProps {
  value: string;
  errorMsg: string | undefined;
  isAlert: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCancel: () => void;
}

export function MarginCell({
  value,
  errorMsg,
  isAlert,
  isEditing,
  onStartEdit,
  onChange,
  onBlur,
  onCancel,
}: MarginCellProps) {
  const showErrorTooltip =
    errorMsg || (isAlert && isEditing && value.trim() !== "" && Number(value) < MARGIN_MIN_PERCENT);

  return (
    <div className="relative inline-block">
      {isEditing ? (
        <input
          autoFocus
          className={`h-9 w-20 rounded-sm border bg-white px-2 text-center text-sm outline-none ${
            errorMsg || isAlert ? "border-red-300" : "border-slate-200"
          }`}
          value={value}
          inputMode="decimal"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") onCancel();
          }}
        />
      ) : (
        <button
          type="button"
          className={`h-9 w-20 rounded-sm border px-2 text-sm ${
            isAlert ? "border-red-200 text-red-600" : "border-transparent text-slate-600"
          } hover:border-slate-200 hover:bg-slate-50`}
          onClick={onStartEdit}
        >
          {value.trim() === "" ? "—" : `${value} %`}
        </button>
      )}

      {showErrorTooltip ? (
        <div className="absolute left-1/2 top-[42px] z-20 w-56 -translate-x-1/2 rounded-sm border border-red-300 bg-white px-2 py-1 text-xs text-red-700 shadow">
          {errorMsg ?? `El margen no puede ser menor a ${MARGIN_MIN_PERCENT}%`}
        </div>
      ) : null}
    </div>
  );
}
