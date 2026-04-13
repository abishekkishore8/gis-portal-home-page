import { useState } from "react";
import { createPortal } from "react-dom";
import { Village, CategoryScore } from "../data/villages";
import { getSolutionsForCategory, getSolutionLevel } from "../data/solutions";
import {
  ArrowLeft,
  MapPin,
  Users,
  Home,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Images,
} from "lucide-react";

interface VillageDetailProps {
  village: Village;
  onBack: () => void;
  onShowImages?: () => void;
}

const getOutputBadge = (output: string) => {
  switch (output) {
    case "Low":
      return "bg-red-100 text-red-700 border-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "High":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getScoreBg = (score: number, max: number) => {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct <= 25) return "bg-red-500";
  if (pct <= 50) return "bg-orange-500";
  if (pct <= 75) return "bg-yellow-500";
  return "bg-green-500";
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Community Awareness": "🌿",
    "Community Based Institution": "🏛️",
    "Livelihood and Skill Development": "💼",
    "Hygiene and Sanitation": "🧹",
    "Renewable Energy": "⚡",
    "Biodiversity Conservation Plan": "🦋",
    "Agriculture": "🌾",
    "Animal Husbandry": "🐄",
    "Fishery": "🐟",
  };
  return icons[category] || "📋";
};

function SolutionsModal({
  category,
  scoreOnScale5,
  onClose,
}: {
  category: CategoryScore;
  scoreOnScale5: number;
  onClose: () => void;
}) {
  const solutionEntries = getSolutionsForCategory(category.category, scoreOnScale5);
  const level = getSolutionLevel(scoreOnScale5);
  const levelLabel = level === "low" ? "Low (1-2)" : level === "medium" ? "Medium (3-4)" : "High (5-6)";
  const levelColor =
    level === "low"
      ? "text-red-600 bg-red-50"
      : level === "medium"
      ? "text-yellow-600 bg-yellow-50"
      : "text-green-600 bg-green-50";

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Solutions - {category.category}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[13px] text-gray-500">Village Score: {scoreOnScale5}/5</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${levelColor}`}>
                Level: {levelLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Solutions Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {solutionEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
              <p>No solutions available for this category.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {solutionEntries.map((entry, idx) => {
                const activeSolutions =
                  level === "low"
                    ? entry.solutionsLow
                    : level === "medium"
                    ? entry.solutionsMedium
                    : entry.solutionsHigh;

                return (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {entry.subIndicatorCode}
                          </span>
                          <h4 className="text-[14px] text-gray-800 mt-1">{entry.subIndicator}</h4>
                        </div>
                        <span className="text-[12px] text-gray-500">{entry.indicatorCode}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[12px] text-gray-500 mb-2">
                        Recommended Actions ({levelLabel}):
                      </p>
                      <div className="space-y-2">
                        {activeSolutions.map((solution, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-700">{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VillageDetail({ village, onBack, onShowImages }: VillageDetailProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [solutionsCategory, setSolutionsCategory] = useState<CategoryScore | null>(null);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-blue-200 hover:text-white mb-3 text-[13px] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Villages
        </button>
        <h2 className="text-white">{village.name}</h2>
        <p className="text-blue-200 text-[13px] mt-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {village.district}, {village.state}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[13px] text-blue-100">
            <Users className="w-3.5 h-3.5" />
            Pop: {village.population.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-blue-100">
            <Home className="w-3.5 h-3.5" />
            {village.households} Households
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-[13px]">
            Overall: {village.overallScore}/5
          </span>
          {onShowImages && (
            <button
              onClick={onShowImages}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] bg-white/20 hover:bg-white/30 transition-colors ml-auto"
            >
              <Images className="w-3.5 h-3.5" />
              Show Images
            </button>
          )}
        </div>
      </div>

      {/* Assessment Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Village Assessment Details
        </h3>

        {/* Overall Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-gray-200 rounded-t-lg text-[12px] text-gray-600">
          <div className="col-span-3">Category</div>
          <div className="col-span-3">Sub Category</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-2">Indicator</div>
          <div className="col-span-1 text-center">Max</div>
          <div className="col-span-1 text-center">Output</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="space-y-1">
          {village.scores.map((catScore) => {
            const isExpanded = expandedCategory === catScore.category;
            return (
              <div
                key={catScore.category}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : catScore.category)
                  }
                >
                  <span className="text-xl">{getCategoryIcon(catScore.category)}</span>
                  <div className="flex-1">
                    <h4 className="text-[14px] text-gray-800">{catScore.category}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] border ${getOutputBadge(
                          catScore.output
                        )}`}
                      >
                        {catScore.output}
                      </span>
                      <span className="text-[12px] text-gray-500">
                        Score: {catScore.scoreOnScale5}/5
                      </span>
                      {/* Mini progress bar */}
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreBg(catScore.scoreOnScale5, 5)}`}
                          style={{ width: `${(catScore.scoreOnScale5 / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1.5 text-[12px] bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSolutionsCategory(catScore);
                    }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    Solutions
                  </button>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {catScore.subCategories.map((sub, idx) => (
                      <div
                        key={idx}
                        className={`${idx > 0 ? "border-t border-gray-100" : ""}`}
                      >
                        <div className="px-4 py-3 bg-gray-50/50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[13px] text-gray-700">{sub.subCategory}</p>
                            <span className="text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Weight: {sub.score}
                            </span>
                          </div>
                          {/* Indicators table */}
                          <div className="mt-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-3 gap-0 text-[11px] text-gray-500 bg-gray-100 px-3 py-1.5">
                              <div>Indicator</div>
                              <div className="text-center">Max Score</div>
                              <div className="text-center">Individual Score</div>
                            </div>
                            {sub.indicators.map((ind, iIdx) => (
                              <div
                                key={iIdx}
                                className="grid grid-cols-3 gap-0 px-3 py-2 text-[12px] border-t border-gray-100"
                              >
                                <div className="text-gray-700">{ind.name}</div>
                                <div className="text-center text-gray-500">
                                  {ind.maxIndividualScore}
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${getScoreBg(
                                          ind.individualScore,
                                          ind.maxIndividualScore
                                        )}`}
                                        style={{
                                          width: `${
                                            ind.maxIndividualScore > 0
                                              ? (ind.individualScore / ind.maxIndividualScore) * 100
                                              : 0
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-gray-700">{ind.individualScore}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Solutions Modal */}
      {solutionsCategory &&
        createPortal(
          <SolutionsModal
            category={solutionsCategory}
            scoreOnScale5={solutionsCategory.scoreOnScale5}
            onClose={() => setSolutionsCategory(null)}
          />,
          document.body
        )}
    </div>
  );
}