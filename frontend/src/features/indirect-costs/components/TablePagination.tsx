import { PAGE_SIZE_OPTIONS } from "../hooks/useOperationsWithMargins";

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export function TablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span>Mostrar</span>
        <select
          className="h-8 rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:border-sky-300 focus:outline-none"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          aria-label="Registros por página"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>por página</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-slate-500">
          {from}-{to} de {totalCount}
        </span>
        <button
          type="button"
          className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded border border-slate-200 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          onClick={() => onPageChange(1)}
          disabled={disabled || !canPrev}
          aria-label="Primera página"
        >
          &laquo;
        </button>
        <button
          type="button"
          className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded border border-slate-200 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || !canPrev}
          aria-label="Página anterior"
        >
          &lsaquo;
        </button>
        <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded border border-sky-200 bg-sky-50 px-2 text-sky-800">
          {page}
        </span>
        <span className="px-1 text-slate-400">/</span>
        <span className="inline-flex h-8 min-w-[2rem] items-center justify-center px-2">{totalPages}</span>
        <button
          type="button"
          className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded border border-slate-200 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canNext}
          aria-label="Siguiente página"
        >
          &rsaquo;
        </button>
        <button
          type="button"
          className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded border border-slate-200 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || !canNext}
          aria-label="Última página"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
