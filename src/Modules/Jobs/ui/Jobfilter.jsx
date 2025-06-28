import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterJob({ onFilterChange, Applied }) {
  const [filters, setFilters] = useState({
    status: 0,
  });

  const statusLabels = Applied
    ? {
        0: "Default",
        1: "Price: High to Low",
        2: "Price: Low to High",
        3: "Reput: High to Low",
        4: "Reput: Low to High",
      }
    : {
        0: "Open",
        1: "Assigned",
        2: "Completed",
        3: "Disputed",
        4: "Cancelled",
      };
  const handleStatusChange = (value) => {
    const statusValue = value === "all" ? undefined : parseInt(value);
    const newFilters = { ...filters, status: statusValue };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const hasActiveFilters = filters.status !== undefined && filters.status !== 0;

  return (
    <Select
      value={filters.status?.toString() || "0"}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 focus:ring-cyan-500 focus:border-cyan-500">
        <SelectValue placeholder="Open" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectGroup>
          <SelectLabel className="text-slate-400">Job Status</SelectLabel>
          <SelectItem
            value="all"
            className="text-white hover:bg-slate-700 focus:bg-slate-700"
          >
            All Statuses
          </SelectItem>
          {Object.entries(statusLabels).map(([value, label]) => (
            <SelectItem
              key={value}
              value={value}
              className="text-white hover:bg-slate-700 focus:bg-slate-700"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    value === "0"
                      ? "bg-blue-400"
                      : value === "1"
                      ? "bg-orange-400"
                      : value === "2"
                      ? "bg-green-400"
                      : value === "3"
                      ? "bg-red-400"
                      : "bg-gray-400"
                  }`}
                />
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
