export interface OperationNameCellProps {
  displayText: string;
  isEditing: boolean;
  editValue: string;
  onEditChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  error: string | null;
  onStartEdit: () => void;
  editDisabled: boolean;
}

export function OperationNameCell({
  displayText,
  isEditing,
  editValue,
  onEditChange,
  onCommit,
  onCancel,
  error,
  onStartEdit,
  editDisabled,
}: OperationNameCellProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isEditing ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <input
                autoFocus
                className="h-9 w-full min-w-0 rounded-sm border border-slate-200 bg-white px-2 text-sm font-semibold outline-none focus:border-sky-300"
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCommit();
                  if (e.key === "Escape") onCancel();
                }}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded p-1 text-slate-700 hover:text-slate-900"
                title="Guardar"
                onClick={onCommit}
              >
                ✓
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded p-1 text-slate-700 hover:text-slate-900"
                title="Cancelar"
                onClick={onCancel}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="truncate font-semibold">{displayText}</div>
          )}
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="invisible inline-flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 group-hover:visible"
            title="Editar operación"
            onClick={onStartEdit}
            disabled={editDisabled}
          >
            ✎
          </button>
        ) : null}
      </div>
      {isEditing && error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </>
  );
}
