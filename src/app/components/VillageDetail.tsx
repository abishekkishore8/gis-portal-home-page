"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { formatIndianWholeNumber } from "../data/number-format";
import type { Village, CategoryScore } from "../data/village-types";
import type { SiteContent } from "../data/site-content";
import { getSolutionsForCategory, getSolutionLevel } from "../data/site-content-helpers";
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
  Building2,
} from "lucide-react";

interface VillageDetailProps {
  village: Village;
  siteContent: SiteContent;
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

const formatScore = (value: number, maxFractionDigits = 2) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: Math.min(2, maxFractionDigits),
    maximumFractionDigits: maxFractionDigits,
  }).format(value);

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
  siteContent,
  scoreOnScale10,
  onClose,
}: {
  category: CategoryScore;
  siteContent: SiteContent;
  scoreOnScale10: number;
  onClose: () => void;
}) {
  const hasCustomActivities = category.activities && category.activities.length > 0;
  const [activeTab, setActiveTab] = useState<"custom" | "standard">(
    hasCustomActivities ? "custom" : "standard"
  );

  const solutionEntries = getSolutionsForCategory(siteContent, category.category);
  const level = getSolutionLevel(scoreOnScale10);
  const levelLabel = level === "low" ? "Low (0-2.0)" : level === "medium" ? "Medium (2.01-3.5)" : "High (3.51-5.0)";
  const levelColor =
    level === "low"
      ? "text-red-600 bg-red-50 animate-pulse"
      : level === "medium"
      ? "text-yellow-600 bg-yellow-50"
      : "text-green-600 bg-green-50";

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-250">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-gray-800 flex items-center gap-2 text-lg font-bold">
              <Lightbulb className="w-5.5 h-5.5 text-amber-500 fill-amber-100" />
              Solutions - {category.category}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[13px] text-gray-500">Village Score: {formatScore(scoreOnScale10)}/5</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${levelColor}`}>
                Level: {levelLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Tabs Bar if custom activities exist */}
        {hasCustomActivities && (
          <div className="flex border-b border-gray-200 bg-gray-50 px-5 pt-2">
            <button
              onClick={() => setActiveTab("custom")}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-all relative ${
                activeTab === "custom"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 Village-Specific Microplan ({category.activities?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("standard")}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-all relative ${
                activeTab === "standard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              💡 Standard Recommendations
            </button>
          </div>
        )}

        {/* Solutions Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
          {activeTab === "custom" && category.activities && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-start gap-3.5">
                <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] text-blue-800 font-bold">Custom Village-Level Microplan Actions</p>
                  <p className="text-[12px] text-blue-600 mt-0.5">
                    The following actions have been proposed based on the local field surveys and are paired with specific implementing line departments.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {category.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-[12px] shrink-0 mt-0.5 border border-blue-100">
                          {idx + 1}
                        </span>
                        <p className="text-[14px] text-gray-800 leading-relaxed font-semibold">
                          {act.activity}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50/80 px-4 py-2.5 border-t border-gray-100 flex flex-wrap items-center gap-2 text-[12.5px] text-gray-600">
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-semibold text-gray-500">Suggested Implementing Agency:</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded text-[11.5px] font-bold">
                        {act.agency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "standard" && (
            <div>
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
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50 font-semibold">
                                {entry.subIndicatorCode}
                              </span>
                              <h4 className="text-[14px] text-gray-800 mt-1 font-semibold">{entry.subIndicator}</h4>
                            </div>
                            <span className="text-[12px] text-gray-500 font-mono font-medium">{entry.indicatorCode}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-[12px] text-gray-500 mb-2 font-medium">
                            Recommended Actions ({levelLabel}):
                          </p>
                          <div className="space-y-2">
                            {activeSolutions.map((solution, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50/30 border border-blue-100/50 hover:bg-blue-50/50 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-[13px] text-gray-700 leading-relaxed">{solution}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}

export function VillageDetail({ village, siteContent, onBack, onShowImages }: VillageDetailProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [solutionsCategory, setSolutionsCategory] = useState<CategoryScore | null>(null);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-5 sm:px-5 sm:py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 text-[13px] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Villages
        </button>
        <div className="min-w-0">
          <h2 className="text-white text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
            {village.name}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-2 flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{village.district}, {village.state}</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-sm text-blue-50">
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-blue-100">Population:</span>
            <span className="text-white">{formatIndianWholeNumber(village.population)}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-sm text-blue-50">
            <Home className="w-4 h-4 shrink-0" />
            <span className="text-blue-100">Households:</span>
            <span className="text-white">{formatIndianWholeNumber(village.households)}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-2 text-sm text-blue-50">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span className="text-blue-100">Overall:</span>
            <span className="text-white">{formatScore(village.overallScore)}/5</span>
          </div>

          {onShowImages && (
            <button
              onClick={onShowImages}
              className="group inline-flex items-center gap-2 rounded-full bg-[#E8D9C8] px-4 py-2 text-sm text-[#5C4632] shadow-[0_8px_20px_rgba(92,70,50,0.12)] hover:bg-[#E2D0BC] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(92,70,50,0.18)] active:translate-y-0 active:shadow-[0_6px_14px_rgba(92,70,50,0.14)] transition-all duration-200"
            >
              <Images className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
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
                  <span className="text-xl shrink-0">{getCategoryIcon(catScore.category)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] text-gray-800 leading-snug">{catScore.category}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] border ${getOutputBadge(
                          catScore.output
                        )}`}
                      >
                        {catScore.output}
                      </span>
                      <span className="text-[12px] text-gray-500 whitespace-nowrap">
                        Score: {formatScore(catScore.scoreOnScale10)}/5
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${getScoreBg(catScore.scoreOnScale10, 5)}`}
                          style={{ width: `${(catScore.scoreOnScale10 / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1.5 text-[12px] bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSolutionsCategory(catScore);
                    }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    Solutions
                  </button>
                  <div className="shrink-0 text-gray-400">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
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
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                            {sub.formulaValue !== undefined && (
                              <span className="bg-white border border-gray-200 rounded px-2 py-1">
                                Formula Value: {formatScore(sub.formulaValue)}
                              </span>
                            )}
                            {sub.formulaExpression && (
                              <span className="bg-white border border-gray-200 rounded px-2 py-1">
                                {sub.formulaExpression}
                              </span>
                            )}
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
                                    <span className="text-gray-700">{formatScore(ind.individualScore)}</span>
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
            siteContent={siteContent}
            scoreOnScale10={solutionsCategory.scoreOnScale10}
            onClose={() => setSolutionsCategory(null)}
          />,
          document.body
        )}
    </div>
  );
}