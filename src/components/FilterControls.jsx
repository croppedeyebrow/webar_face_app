import React from "react";

const FILTERS = [
  { id: "none", name: "필터 없음", icon: "🚫" },
  { id: "sunglass", name: "선글라스", icon: "🕶️" },
  { id: "hat", name: "모자", icon: "🎩" },
];

export const FilterControls = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">필터 선택</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200
              ${
                selectedFilter === filter.id
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              }
              font-medium
            `}
          >
            <span className="text-xl">{filter.icon}</span>
            <span>{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
