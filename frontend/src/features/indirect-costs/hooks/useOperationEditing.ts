import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_OPERATION, UPDATE_OPERATION } from "../../../graphql";
import type { Operation } from "../types";

export const NEW_ROW_ID = "__NEW_OPERATION__";

export interface UseOperationEditingOptions {
  plantId: string | null;
  onSaveError?: (message: string | null) => void;
  onSaveSuccess?: (kind: "create" | "update") => void;
  refetch?: () => void | Promise<unknown>;
}

export function useOperationEditing(options: UseOperationEditingOptions) {
  const { plantId, onSaveError, onSaveSuccess, refetch } = options;

  const [createOperation, createState] = useMutation(CREATE_OPERATION);
  const [updateOperation, updateState] = useMutation(UPDATE_OPERATION);

  const [editingOperationId, setEditingOperationId] = useState<string | null>(null);
  const [opDrafts, setOpDrafts] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const [opError, setOpError] = useState<string | null>(null);

  const [opCellEdit, setOpCellEdit] = useState<{ operationId: string; field: "name" | "description" } | null>(null);
  const [opCellValue, setOpCellValue] = useState("");
  const [opCellError, setOpCellError] = useState<string | null>(null);

  useEffect(() => {
    onSaveError?.(null);
    setOpCellError(null);
    setOpCellEdit(null);
    setOpCellValue("");
    setEditingOperationId(null);
    setOpDrafts({ name: "", description: "" });
    setOpError(null);
  }, [plantId, onSaveError]);

  function startAddRow() {
    setOpError(null);
    setEditingOperationId(NEW_ROW_ID);
    setOpDrafts({ name: "", description: "" });
  }

  function cancelEditOperation() {
    setOpError(null);
    setEditingOperationId(null);
    setOpDrafts({ name: "", description: "" });
  }

  function startOpCellEdit(op: Operation, field: "name" | "description") {
    setOpCellError(null);
    setOpCellEdit({ operationId: op.id, field });
    setOpCellValue(field === "name" ? op.name : op.description ?? "");
  }

  function cancelOpCellEdit() {
    setOpCellError(null);
    setOpCellEdit(null);
    setOpCellValue("");
  }

  async function commitOpCellEdit(): Promise<void> {
    if (!opCellEdit) return;
    onSaveError?.(null);
    setOpCellError(null);

    const value = opCellValue.trim();
    if (opCellEdit.field === "name" && !value) {
      setOpCellError("El nombre es requerido");
      return;
    }

    try {
      await updateOperation({
        variables: {
          id: opCellEdit.operationId,
          input:
            opCellEdit.field === "name"
              ? { name: value }
              : { description: value === "" ? null : value },
        },
      });
      await refetch?.();
      onSaveSuccess?.("update");
      cancelOpCellEdit();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error guardando operación";
      onSaveError?.(message);
    }
  }

  async function commitOperationEdit(): Promise<void> {
    onSaveError?.(null);
    setOpError(null);

    const name = opDrafts.name.trim();
    const description = opDrafts.description.trim();
    if (!name) {
      setOpError("El nombre es requerido");
      return;
    }

    try {
      await createOperation({
        variables: { input: { name, description: description === "" ? null : description } },
      });
      await refetch?.();
      onSaveSuccess?.("create");
      cancelEditOperation();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error guardando operación";
      onSaveError?.(message);
    }
  }

  return {
    editingOperationId,
    opDrafts,
    setOpDrafts,
    opError,
    startAddRow,
    cancelEditOperation,
    opCellEdit,
    opCellValue,
    setOpCellValue,
    opCellError,
    startOpCellEdit,
    commitOpCellEdit,
    cancelOpCellEdit,
    commitOperationEdit,
    isSaving: createState.loading || updateState.loading,
  };
}
