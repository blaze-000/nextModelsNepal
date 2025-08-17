"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showPagination?: boolean;
}

export default function DataTable<T extends { _id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = "No data available",
  searchPlaceholder = "Search...",
  itemsPerPage = 5,
  showPagination = true,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);

   const getValue = (item: T, key: string): unknown => {
    if (key.includes(".")) {
      return key.split(".").reduce((obj: unknown, k: string) => {
        return obj && typeof obj === "object" && k in obj
          ? (obj as Record<string, unknown>)[k]
          : undefined;
      }, item);
    }
    return (item as Record<string, unknown>)[key];
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = getValue(a, sortColumn);
    const bValue = getValue(b, sortColumn);

    // Convert to string for safe comparison
    const aStr = String(aValue || "");
    const bStr = String(bValue || "");

    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = showPagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage]);

 

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted-background border border-gray-600 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gold-500 
                     focus:ring-1 focus:ring-gold-500/20 transition-colors"
          />
        </div>
        {/* Filter Button here - in future */}
      </div>

      {/* Table Container */}
      <div className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-background2 border-b border-gray-600">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-300 ${column.sortable
                        ? "cursor-pointer hover:text-gold-400"
                        : ""
                      }`}
                    style={{ width: column.width }}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <i
                            className={`ri-arrow-up-s-line text-xs ${sortColumn === column.key &&
                                sortDirection === "asc"
                                ? "text-gold-400"
                                : "text-gray-500"
                              }`}
                          />
                          <i
                            className={`ri-arrow-down-s-line text-xs -mt-1 ${sortColumn === column.key &&
                                sortDirection === "desc"
                                ? "text-gold-400"
                                : "text-gray-500"
                              }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 w-32">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-600">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length + (onEdit || onDelete || onView ? 1 : 0)
                      }
                      className="px-4 py-8"
                    >
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500"></div>
                        <span className="ml-2 text-gray-400">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length + (onEdit || onDelete || onView ? 1 : 0)
                      }
                      className="px-4 py-8"
                    >
                      <div className="text-center text-gray-400">
                        <i className="ri-inbox-line text-3xl mb-2 block" />
                        {emptyMessage}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.01 }}
                      className="hover:bg-background2/50 transition-colors"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-3 text-sm text-gray-100"
                        >
                          {column.render
                            ? column.render(
                              getValue(item, String(column.key)),
                              item
                            )
                            : String(getValue(item, String(column.key)) || "")}
                        </td>
                      ))}

                      {(onEdit || onDelete || onView) && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-4">
                            {onView && (
                              <button
                                onClick={() => onView(item)}
                                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                title="View"
                              >
                                <i className="ri-eye-line text-sm" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(item)}
                                className=""
                                title="Edit"
                              >
                                <i
                                  className="ri-edit-line text-md border p-2  border-gold-600 hover:bg-gold-500/20  cursor-pointer rounded transition-colors "
                                />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item)}

                                className=" "

                                title="Delete"
                              >
                                <i
                                  className="ri-delete-bin-line text-md border p-2 bg-red-700 border-red-700 hover:bg-transparent  cursor-pointer rounded transition-colors"
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>

            {/* Pagination Footer Row */}
            {showPagination && totalItems > 0 && (
              <tfoot className="bg-background2 border-t border-gray-600">
                <tr>
                  <td
                    colSpan={
                      columns.length + (onEdit || onDelete || onView ? 1 : 0)
                    }
                    className="px-6 py-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Items per page selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Show</span>
                        <select
                          value={perPage}
                          onChange={(e) => setPerPage(Number(e.target.value))}
                          className="bg-muted-background border border-gray-600 rounded px-3 py-1 text-sm text-gray-100 
                                   focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-400">per page</span>
                      </div>

                      {/* Pagination info and controls */}
                      <div className="flex items-center gap-4">
                        {/* Info */}
                        <div className="text-sm text-gray-400">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, totalItems)} of {totalItems} items
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center gap-1">
                          {/* First page */}
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-100 
                                     disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                            title="First page"
                          >
                            <i className="ri-skip-back-line" />
                          </button>

                          {/* Previous page */}
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-100 
                                     disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                            title="Previous page"
                          >
                            <i className="ri-arrow-left-s-line" />
                          </button>

                          {/* Page numbers */}
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${currentPage === pageNum
                                      ? "bg-gold-500 text-black"
                                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-700"
                                    }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          {/* Next page */}
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-100 
                                     disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                            title="Next page"
                          >
                            <i className="ri-arrow-right-s-line" />
                          </button>

                          {/* Last page */}
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-gray-100 
                                     disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                            title="Last page"
                          >
                            <i className="ri-skip-forward-line" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
