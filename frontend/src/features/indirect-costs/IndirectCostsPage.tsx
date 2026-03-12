import { useCallback, useEffect, useState } from "react";
import { IndirectCostsTable } from "./components/IndirectCostsTable";
import { TablePagination } from "./components/TablePagination";
import { TableSkeleton } from "./components/TableSkeleton";
import { useMarginEditing } from "./hooks/useMarginEditing";
import { useOperationEditing } from "./hooks/useOperationEditing";
import { useOperationsWithMargins, PAGE_SIZE_OPTIONS } from "./hooks/useOperationsWithMargins";
import { usePlantsContext } from "../../contexts/PlantsContext";
import { useSnackbar } from "../../contexts/SnackbarContext";

const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
const GENERIC_ERROR_MESSAGE = "Ha ocurrido un error. Inténtelo de nuevo.";

function formatErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  const looksInternal =
    /[\\/].*\.(ts|js)\b|prisma\.|invocation|must not be null|failed to fetch|network error/.test(lower) ||
    message.length > 200;
  return looksInternal ? GENERIC_ERROR_MESSAGE : message;
}

export function IndirectCostsPage() {
  const { plants, plantId, loading: plantsLoading, error: plantsError } = usePlantsContext();
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [showOnlyOverwritten, setShowOnlyOverwritten] = useState(false);
  const { rows, totalCount, loading: opsLoading, error: opsError, refetch: refetchOperations } =
    useOperationsWithMargins(plantId, page, pageSize, showOnlyOverwritten);

  useEffect(() => {
    setPage(1);
  }, [plantId]);

  useEffect(() => {
    setPage(1);
  }, [showOnlyOverwritten]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleOperationSaveError = useCallback((msg: string | null) => {
    setSaveError(msg);
    if (msg) showSnackbar(formatErrorMessage(msg), { variant: "error" });
  }, [showSnackbar]);

  const handleOperationSaveSuccess = useCallback(
    (kind: "create" | "update") =>
      showSnackbar(kind === "create" ? "Operación creada." : "Operación actualizada.", {
        variant: "success",
      }),
    [showSnackbar]
  );

  const handleMarginSaveSuccess = useCallback(
    () => showSnackbar("Margen guardado.", { variant: "success" }),
    [showSnackbar]
  );

  const getOperationsQueryVariables = useCallback((): { plantId: string; limit: number; offset: number; onlyWithMargins: boolean } | null => {
    if (!plantId) return null;
    return {
      plantId,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      onlyWithMargins: showOnlyOverwritten,
    };
  }, [plantId, page, pageSize, showOnlyOverwritten]);

  const marginEditing = useMarginEditing(plantId, rows, {
    onSaveError: setSaveError,
    onSaveSuccess: handleMarginSaveSuccess,
    refetch: refetchOperations,
    getOperationsQueryVariables,
  });
  const operationEditing = useOperationEditing({
    plantId,
    onSaveError: handleOperationSaveError,
    onSaveSuccess: handleOperationSaveSuccess,
    refetch: refetchOperations,
  });

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setPage(1);
  }

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-auto px-4 pb-4">
          <div className="sticky top-0 z-10 -mx-4 flex justify-end bg-[#f4f6f8] px-4 py-3">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
              <span className="whitespace-nowrap">Solo operaciones con márgenes guardados</span>
              <button
                type="button"
                role="switch"
                aria-checked={showOnlyOverwritten}
                onClick={() => setShowOnlyOverwritten((v) => !v)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                  showOnlyOverwritten ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    showOnlyOverwritten ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {plantsLoading ? (
            <div className="text-sm text-slate-600">Cargando plantas…</div>
          ) : plantsError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Error cargando plantas: {formatErrorMessage(plantsError.message)}
            </div>
          ) : plants.length === 0 ? (
            <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
              No hay plantas.
            </div>
          ) : opsLoading ? (
            <TableSkeleton />
          ) : opsError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Error cargando operaciones: {formatErrorMessage(opsError.message)}
            </div>
          ) : (
            <>
              <IndirectCostsTable
                saveError={saveError ? formatErrorMessage(saveError) : null}
                rows={rows}
                totalCount={totalCount}
                plantId={plantId}
                marginByOperationAndRange={marginEditing.marginByOperationAndRange}
                getDisplayValue={marginEditing.getDisplayValue}
                drafts={marginEditing.drafts}
                setDrafts={marginEditing.setDrafts}
                fieldError={marginEditing.fieldError}
                setFieldError={marginEditing.setFieldError}
                activeCell={marginEditing.activeCell}
                setActiveCell={marginEditing.setActiveCell}
                commitCell={marginEditing.commitCell}
                opCellEdit={operationEditing.opCellEdit}
                opCellValue={operationEditing.opCellValue}
                setOpCellValue={operationEditing.setOpCellValue}
                opCellError={operationEditing.opCellError}
                startOpCellEdit={operationEditing.startOpCellEdit}
                commitOpCellEdit={operationEditing.commitOpCellEdit}
                cancelOpCellEdit={operationEditing.cancelOpCellEdit}
                editingOperationId={operationEditing.editingOperationId}
                opDrafts={operationEditing.opDrafts}
                setOpDrafts={operationEditing.setOpDrafts}
                opError={operationEditing.opError}
                commitOperationEdit={operationEditing.commitOperationEdit}
                cancelEditOperation={operationEditing.cancelEditOperation}
                startAddRow={operationEditing.startAddRow}
                isSaving={marginEditing.isSaving || operationEditing.isSaving}
              />
              <div className="mt-3">
                <TablePagination
                  page={page}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onPageSizeChange={handlePageSizeChange}
                  disabled={opsLoading}
                />
              </div>
            </>
          )}
    </main>
  );
}
