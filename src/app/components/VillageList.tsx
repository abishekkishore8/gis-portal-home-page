import { useState, useMemo } from "react";
import { villages, Village } from "../data/villages";
import { MapPin, Search, Users, Home, ChevronRight, Eye, Image } from "lucide-react";

interface VillageListProps {
  selectedVillageId: string | null;
  onSelectVillage: (village: Village) => void;
  onViewDetails: (village: Village) => void;
  onShowImages?: (village: Village) => void;
}

const getScoreColor = (score: number) => {
  if (score <= 1) return "bg-red-100 text-red-700 border-red-200";
  if (score <= 2) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score <= 3) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (score <= 4) return "bg-green-100 text-green-700 border-green-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
};

const getScoreLabel = (score: number) => {
  if (score <= 1) return "Very Low";
  if (score <= 2) return "Low";
  if (score <= 3) return "Medium";
  if (score <= 4) return "Good";
  return "Excellent";
};

export function VillageList({ selectedVillageId, onSelectVillage, onViewDetails, onShowImages }: VillageListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("all");

  const states = [...new Set(villages.map((v) => v.state))];

  const filteredVillages = useMemo(() => {
    const filtered = villages.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = filterState === "all" || v.state === filterState;
      return matchesSearch && matchesState;
    });

    // Move selected village to top
    if (selectedVillageId) {
      const selectedIdx = filtered.findIndex((v) => v.id === selectedVillageId);
      if (selectedIdx > 0) {
        const [selected] = filtered.splice(selectedIdx, 1);
        filtered.unshift(selected);
      }
    }

    return filtered;
  }, [searchQuery, filterState, selectedVillageId]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="flex items-center gap-2 text-gray-800 mb-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          Microplan Villages
        </h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search villages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <span className="text-[13px] text-blue-700">
          {filteredVillages.length} village{filteredVillages.length !== 1 ? "s" : ""} found
        </span>
        <span className="text-[12px] text-blue-500">
          Total Population: {filteredVillages.reduce((s, v) => s + v.population, 0).toLocaleString()}
        </span>
      </div>

      {/* Village Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredVillages.map((village) => {
          const isSelected = village.id === selectedVillageId;
          return (
            <div
              key={village.id}
              className={`rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100 ring-1 ring-indigo-300"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
              onClick={() => onSelectVillage(village)}
            >
              {/* Selected banner */}
              {isSelected && (
                <div className="bg-indigo-500 text-white px-3 py-1 text-[11px] flex items-center gap-1.5 rounded-t-[10px]">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Currently Selected Village
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`text-[15px] flex items-center gap-1.5 ${isSelected ? "text-indigo-800" : "text-gray-800"}`}>
                      {village.name}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      {village.district}, {village.state}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] border ${getScoreColor(
                      village.overallScore
                    )}`}
                  >
                    {getScoreLabel(village.overallScore)} ({village.overallScore}/5)
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {village.population.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    {village.households} HH
                  </span>
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[13px] transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(village);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {onShowImages && (
                    <button
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowImages(village);
                      }}
                    >
                      <Image className="w-3.5 h-3.5" />
                      Photos
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
