import { VOLUME_RANGE_KEYS, type VolumeRangeKey } from "../../../graphql";
import type { Operation, OperationWithMargins, Margin } from "../types";
import { MARGIN_MIN_PERCENT } from "../constants";
import { NEW_ROW_ID } from "../hooks/useOperationEditing";
import { formatVolumeHeader } from "../utils/formatVolumeHeader";
import { cellKey } from "../utils/cellKey";
import { MarginCell } from "./cells/MarginCell";
import { OperationDescriptionCell } from "./cells/OperationDescriptionCell";
import { OperationNameCell } from "./cells/OperationNameCell";

export interface IndirectCostsTableProps {
  saveError: string | null;
  rows: OperationWithMargins[];
  totalCount: number;
  plantId: string | null;
  marginByOperationAndRange: Map<string, Margin>;
  getDisplayValue: (operationId: string, volumeRange: VolumeRangeKey) => string;
  drafts: Record<string, string>;
  setDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fieldError: Record<string, string>;
  setFieldError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeCell: string | null;
  setActiveCell: (key: string | null) => void;
  commitCell: (operationId: string, volumeRange: VolumeRangeKey) => Promise<void>;
  opCellEdit: { operationId: string; field: "name" | "description" } | null;
  opCellValue: string;
  setOpCellValue: (value: string) => void;
  opCellError: string | null;
  startOpCellEdit: (op: Operation, field: "name" | "description") => void;
  commitOpCellEdit: () => Promise<void>;
  cancelOpCellEdit: () => void;
  editingOperationId: string | null;
  opDrafts: { name: string; description: string };
  setOpDrafts: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  opError: string | null;
  commitOperationEdit: () => Promise<void>;
  cancelEditOperation: () => void;
  startAddRow: () => void;
  isSaving: boolean;
}

export function IndirectCostsTable({
  saveError,
  rows,
  totalCount,
  plantId,
  marginByOperationAndRange,
  getDisplayValue,
  drafts,
  setDrafts,
  fieldError,
  setFieldError,
  activeCell,
  setActiveCell,
  commitCell,
  opCellEdit,
  opCellValue,
  setOpCellValue,
  opCellError,
  startOpCellEdit,
  commitOpCellEdit,
  cancelOpCellEdit,
  editingOperationId,
  opDrafts,
  setOpDrafts,
  opError,
  commitOperationEdit,
  cancelEditOperation,
  startAddRow,
  isSaving,
}: IndirectCostsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      {saveError ? (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{saveError}</div>
      ) : null}

      <div className="overflow-auto">
        <table className="min-w-[1200px] w-full table-fixed border-collapse text-sm">
          <thead className="sticky top-0 z-0">
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
            {rows.map((row) => (
              <tr key={row.operation.id} className="border-b border-slate-100 last:border-b-0">
                <td className="group border-r border-slate-100 bg-slate-50 px-4 py-3">
                  <OperationNameCell
                    displayText={row.operation.name}
                    isEditing={opCellEdit?.operationId === row.operation.id && opCellEdit.field === "name"}
                    editValue={opCellValue}
                    onEditChange={setOpCellValue}
                    onCommit={commitOpCellEdit}
                    onCancel={cancelOpCellEdit}
                    error={opCellError}
                    onStartEdit={() => startOpCellEdit(row.operation, "name")}
                    editDisabled={opCellEdit !== null || editingOperationId !== null}
                  />
                </td>

                <td className="group border-r border-slate-100 px-4 py-3 text-slate-600">
                  <OperationDescriptionCell
                    displayText={row.operation.description ?? "—"}
                    isEditing={opCellEdit?.operationId === row.operation.id && opCellEdit.field === "description"}
                    editValue={opCellValue}
                    onEditChange={setOpCellValue}
                    onCommit={commitOpCellEdit}
                    onCancel={cancelOpCellEdit}
                    onStartEdit={() => startOpCellEdit(row.operation, "description")}
                    editDisabled={opCellEdit !== null || editingOperationId !== null}
                  />
                </td>

                {VOLUME_RANGE_KEYS.map((vr) => {
                  if (!plantId) return null;
                  const key = cellKey(plantId, row.operation.id, vr);
                  const margin = marginByOperationAndRange.get(key);
                  const value = getDisplayValue(row.operation.id, vr);
                  const errorMsg = fieldError[key];
                  const numeric = value.trim() === "" ? NaN : Number(value);
                  const isAlert =
                    Boolean(margin?.hasLowMarginAlert) || (Number.isFinite(numeric) && numeric <= MARGIN_MIN_PERCENT);
                  const isEditing = activeCell === key;

                  return (
                    <td
                      key={vr}
                      className={`border-r border-slate-100 px-3 py-2 last:border-r-0 ${
                        isAlert ? "bg-red-50" : ""
                      }`}
                    >
                      <div className="flex justify-center w-full">
                        <MarginCell
                          value={value}
                        errorMsg={errorMsg}
                        isAlert={isAlert}
                        isEditing={isEditing}
                        onStartEdit={() => {
                          setActiveCell(key);
                          setDrafts((prev) => {
                            if (key in prev) return prev;
                            const current = margin?.marginPercent;
                            return { ...prev, [key]: current === undefined ? "" : String(current) };
                          });
                        }}
                        onChange={(next) => setDrafts((prev) => ({ ...prev, [key]: next }))}
                        onBlur={async () => {
                          await commitCell(row.operation.id, vr);
                          setActiveCell(null);
                        }}
                        onCancel={() => {
                          setDrafts((prev) => {
                            const next = { ...prev };
                            delete next[key];
                            return next;
                          });
                          setFieldError((prev) => {
                            const next = { ...prev };
                            delete next[key];
                            return next;
                          });
                          setActiveCell(null);
                        }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr className="bg-white">
              {editingOperationId === NEW_ROW_ID ? (
                <>
                  <td className="border-r border-slate-100 bg-slate-50 px-4 py-3">
                    <input
                      autoFocus
                      className="h-9 w-full rounded-sm border border-slate-200 bg-white px-2 text-sm outline-none focus:border-sky-300"
                      placeholder="Nueva operación"
                      value={opDrafts.name}
                      onChange={(e) => setOpDrafts((p) => ({ ...p, name: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitOperationEdit();
                        if (e.key === "Escape") cancelEditOperation();
                      }}
                    />
                    {opError ? <div className="mt-1 text-xs text-red-600">{opError}</div> : null}
                  </td>
                  <td className="border-r border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="h-9 min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-2 text-sm outline-none focus:border-sky-300"
                        placeholder="Descripción (opcional)"
                        value={opDrafts.description}
                        onChange={(e) => setOpDrafts((p) => ({ ...p, description: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitOperationEdit();
                          if (e.key === "Escape") cancelEditOperation();
                        }}
                      />
                      <button
                        type="button"
                        className="inline-flex flex-shrink-0 items-center justify-center rounded p-1 text-slate-700 hover:text-slate-900 disabled:opacity-50"
                        title="Guardar"
                        onClick={() => commitOperationEdit()}
                        disabled={isSaving}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="inline-flex flex-shrink-0 items-center justify-center rounded p-1 text-slate-700 hover:text-slate-900"
                        title="Cancelar"
                        onClick={cancelEditOperation}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                  {VOLUME_RANGE_KEYS.map((vr) => (
                    <td key={vr} className="border-r border-slate-100 px-3 py-2 text-center last:border-r-0">
                      <span className="text-slate-300">—</span>
                    </td>
                  ))}
                </>
              ) : (
                <td colSpan={2 + VOLUME_RANGE_KEYS.length} className="border-t border-slate-100 px-4 py-3">
                  <button
                    type="button"
                    className="text-sm font-medium text-sky-700 hover:text-sky-800"
                    onClick={startAddRow}
                    disabled={opCellEdit !== null}
                  >
                    + Agregar operación
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-500">
        <div>
          {isSaving ? "Guardando…" : " "}
          Total: {totalCount}
        </div>
        <div className="hidden sm:block">
          Edición por celda (clic → editar, Enter/TAB → guardar, Esc → salir sin guardar)
        </div>
      </div>
    </div>
  );
}
