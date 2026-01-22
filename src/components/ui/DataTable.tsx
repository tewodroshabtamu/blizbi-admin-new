import React, { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: 'left' | 'center' | 'right';
  width?: string;
  responsiveWidth?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  responsive?: boolean;
  emptyMessage?: string;
}

/**
 * Reusable data table component for displaying tabular data
 * Used in Events and Providers pages
 */
export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  responsive = true,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`${responsive ? 'w-full min-w-full' : 'w-full'}`}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{ width: column.width }}
                  className={`px-3 sm:px-4 lg:px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    style={{ width: column.width }}
                    className={`px-3 sm:px-4 lg:px-6 py-3 text-${column.align || 'left'} text-sm align-top`}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
