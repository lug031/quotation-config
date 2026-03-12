import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { useMutation } from "@apollo/client";
import {
  GET_OPERATIONS_WITH_MARGINS_BY_PLANT,
  SAVE_OPERATION_MARGINS,
  type VolumeRangeKey,
} from "../../../graphql";
import type { Margin, OperationWithMargins } from "../types";
import { MARGIN_MAX_PERCENT, MARGIN_MIN_PERCENT } from "../constants";
import { cellKey } from "../utils/cellKey";

export interface OperationsQueryVariables {
  plantId: string;
  limit: number;
  offset: number;
  onlyWithMargins: boolean;
}

export interface UseMarginEditingOptions {
  onSaveError?: (message: string | null) => void;
  onSaveSuccess?: () => void;
  refetch?: () => void | Promise<unknown>;
  /** Variables actuales de la query de operaciones; se usan en refetchQueries tras guardar margen para actualizar totalCount del toggle. */
  getOperationsQueryVariables?: () => OperationsQueryVariables | null;
}

export function useMarginEditing(
  plantId: string | null,
  rows: OperationWithMargins[],
  options: UseMarginEditingOptions = {}
) {
  const { onSaveError, onSaveSuccess, refetch, getOperationsQueryVariables } = options;

  const [saveMargins, saveState] = useMutation(SAVE_OPERATION_MARGINS, {
    refetchQueries: () => {
      const vars = getOperationsQueryVariables?.();
      if (!vars) return [];
      return [{ query: GET_OPERATIONS_WITH_MARGINS_BY_PLANT, variables: vars }];
    },
  });

  const marginByOperationAndRange = useMemo(() => {
    const map = new Map<string, Margin>();
    if (!plantId) return map;
    for (const row of rows) {
      for (const m of row.margins) {
        map.set(cellKey(plantId, row.operation.id, m.volumeRange), m);
      }
    }
    return map;
  }, [rows, plantId]);

  const [draftsByPlant, setDraftsByPlant] = useState<Record<string, Record<string, string>>>({});
  const [fieldErrorByPlant, setFieldErrorByPlant] = useState<Record<string, Record<string, string>>>({});
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const drafts = plantId ? draftsByPlant[plantId] ?? {} : {};
  const fieldError = plantId ? fieldErrorByPlant[plantId] ?? {} : {};

  function setDrafts(updater: SetStateAction<Record<string, string>>) {
    if (!plantId) return;
    setDraftsByPlant((prev) => ({
      ...prev,
      [plantId]: typeof updater === "function" ? updater(prev[plantId] ?? {}) : updater,
    }));
  }

  function setFieldError(updater: SetStateAction<Record<string, string>>) {
    if (!plantId) return;
    setFieldErrorByPlant((prev) => ({
      ...prev,
      [plantId]: typeof updater === "function" ? updater(prev[plantId] ?? {}) : updater,
    }));
  }

  useEffect(() => {
    setActiveCell(null);
  }, [plantId]);

  function getDisplayValue(operationId: string, volumeRange: VolumeRangeKey): string {
    if (!plantId) return "";
    const key = cellKey(plantId, operationId, volumeRange);
    if (key in drafts) return drafts[key];
    const current = marginByOperationAndRange.get(key)?.marginPercent;
    return current === undefined ? "" : String(current);
  }

  async function commitCell(operationId: string, volumeRange: VolumeRangeKey): Promise<void> {
    if (!plantId) return;
    const key = cellKey(plantId, operationId, volumeRange);
    if (!(key in drafts)) return;

    onSaveError?.(null);
    const raw = drafts[key].trim();
    if (raw === "") {
      setFieldError((prev) => ({ ...prev, [key]: "Requerido" }));
      return;
    }

    const value = Number(raw);
    if (!Number.isFinite(value)) {
      setFieldError((prev) => ({ ...prev, [key]: "Debe ser un número" }));
      return;
    }

    if (value < MARGIN_MIN_PERCENT) {
      setFieldError((prev) => ({ ...prev, [key]: `El margen no puede ser menor a ${MARGIN_MIN_PERCENT}%` }));
      return;
    }

    if (value > MARGIN_MAX_PERCENT) {
      setFieldError((prev) => ({ ...prev, [key]: `Máximo ${MARGIN_MAX_PERCENT}%` }));
      return;
    }

    setFieldError((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    try {
      await saveMargins({
        variables: {
          plantId,
          operationId,
          margins: [{ volumeRange, marginPercent: value }],
        },
      });
      await refetch?.();
      onSaveSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error guardando cambios";
      onSaveError?.(message);
      return;
    }

    setDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return {
    marginByOperationAndRange,
    getDisplayValue,
    drafts,
    setDrafts,
    fieldError,
    setFieldError,
    activeCell,
    setActiveCell,
    commitCell,
    isSaving: saveState.loading,
  };
}
