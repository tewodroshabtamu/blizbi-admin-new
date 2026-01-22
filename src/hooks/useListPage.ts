import { useState, useCallback, useMemo } from 'react';

export interface UseListPageOptions<T> {
  items: T[];
  searchFields?: (keyof T)[];
  itemsPerPage?: number;
  initialSearchTerm?: string;
}

export interface UseListPageReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredItems: T[];
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

/**
 * Reusable hook for list pages with search and pagination
 */
export function useListPage<T extends Record<string, any>>({
  items,
  searchFields = [],
  itemsPerPage = 10,
  initialSearchTerm = '',
}: UseListPageOptions<T>): UseListPageReturn<T> {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search term changes
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) {
      return items;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [items, searchTerm, searchFields]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage,
    setCurrentPage,
    filteredItems,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex,
    totalCount: filteredItems.length,
  };
}
