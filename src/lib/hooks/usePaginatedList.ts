import { useEffect, useMemo, useState } from "react";

export const PAGE_SIZE_OPTIONS = [10, 15, 20, 50] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

interface IUsePaginatedListOptions {
  pageSize?: PageSizeOption;
  /** When any dependency changes, reset to page 1 (search, filters, tabs). */
  resetDeps?: readonly unknown[];
}

export interface IPaginatedListResult<T> {
  page: number;
  setPage: (page: number) => void;
  pageSize: PageSizeOption;
  setPageSize: (size: PageSizeOption) => void;
  totalItems: number;
  totalPages: number;
  paginatedItems: T[];
  rangeStart: number;
  rangeEnd: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export function usePaginatedList<T>(
  items: T[],
  options: IUsePaginatedListOptions = {}
): IPaginatedListResult<T> {
  const { pageSize: initialPageSize = 10, resetDeps = [] } = options;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState<PageSizeOption>(initialPageSize);

  useEffect(() => {
    setPage(1);
  }, [pageSize, ...resetDeps]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);

  const setPageSize = (size: PageSizeOption): void => {
    setPageSizeState(size);
  };

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
    goToNextPage: () => setPage((current) => Math.min(current + 1, totalPages)),
    goToPrevPage: () => setPage((current) => Math.max(current - 1, 1)),
  };
}
