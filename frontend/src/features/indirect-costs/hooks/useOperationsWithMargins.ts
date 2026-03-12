import { useQuery } from "@apollo/client";
import { GET_OPERATIONS_WITH_MARGINS_BY_PLANT } from "../../../graphql";
import type { OperationWithMargins } from "../types";

export const PAGE_SIZE_OPTIONS = [10, 25, 30, 50] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export function useOperationsWithMargins(
  plantId: string | null,
  page: number,
  pageSize: number,
  onlyWithMargins: boolean
) {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const { data, loading, error, refetch } = useQuery<{
    operationsWithMarginsByPlant: { items: OperationWithMargins[]; totalCount: number };
  }>(GET_OPERATIONS_WITH_MARGINS_BY_PLANT, {
    skip: !plantId,
    variables: { plantId, limit, offset, onlyWithMargins },
  });

  const rows = data?.operationsWithMarginsByPlant?.items ?? [];
  const totalCount = data?.operationsWithMarginsByPlant?.totalCount ?? 0;

  return {
    rows,
    totalCount,
    loading,
    error,
    refetch,
  };
}
