"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

        <div className="text-sm text-gray-400">
          {filteredData.length} of {data.length} items
        </div>
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
                ) : sortedData.length === 0 ? (
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
                  sortedData.map((item, index) => (
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
                          <div className="flex items-center justify-end gap-2">
                            {onView && (
                              <button
                                onClick={() => onView(item)}
                                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 
                                         rounded transition-colors"
                                title="View"
                              >
                                <i className="ri-eye-line text-sm" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(item)}
                                className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 
                                         rounded transition-colors"
                                title="Edit"
                              >
                                <i className="ri-edit-line text-sm" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item)}
                                className="cursor-pointer p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 
                                         rounded transition-colors"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line text-sm" />
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
          </table>
        </div>
      </div>
    </div>
  );
}
