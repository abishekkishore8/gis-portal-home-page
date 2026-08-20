"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Droplets,
  Globe,
  Home,
  Leaf,
  List,
  Map,
  MapPin,
  Target,
  TreePine,
  Users,
  Wheat,
  Factory,
  Waves,
  GraduationCap,
  Fish,
  Dog,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MapView } from "../components/MapView";
import { formatIndianWholeNumber } from "../data/number-format";
import type { SiteContent } from "../data/site-content";
import type { Village } from "../data/village-types";

type HomePageProps = {
  initialVillages: Village[];
  siteContent: SiteContent;
};

const focusAreaIcons = {
  "Community Awareness": Leaf,
  "Community Based Institution": Users,
  "Hygiene and Sanitation": Droplets,
  "Livelihood and Skill Development": GraduationCap,
  "Renewable Energy": Target,
  "Agriculture": Wheat,
  "Animal Husbandry": Dog,
  "Fishery": Fish,
  "Biodiversity Conservation Plan": TreePine,
} as const;

export function HomePage({ initialVillages, siteContent }: HomePageProps) {
  const router = useRouter();
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);

  const villages = initialVillages;
  const totalPop = villages.reduce((sum, village) => sum + village.population, 0);
  const totalHH = villages.reduce((sum, village) => sum + village.households, 0);
  const statesSet = new Set(villages.map((village) => village.state));
  const avgScore = (
    villages.reduce((sum, village) => sum + village.overallScore, 0) / Math.max(villages.length, 1)
  ).toFixed(2);

  const handleVillageClick = (village: Village) => {
    setSelectedVillageId(village.id);
    router.push(`/villages?selected=${village.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3">
          <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[15px] sm:text-[16px] md:text-[18px] text-white leading-tight font-semibold">Digital Village Microplan Portal</h1>
                <p className="text-[10.5px] md:text-[11px] text-blue-200">Ganga River Basin Village Assessment</p>
              </div>
            </div>
            
            <nav className="flex md:hidden items-center gap-1 shrink-0 ml-2">
              <button className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/20 text-white text-[12px] font-medium shadow-sm">
                <Map className="w-3.5 h-3.5 mr-1" />
                Home
              </button>
              <button
                className="flex items-center justify-center px-3 py-1.5 rounded-lg text-blue-200 hover:bg-white/10 text-[12px] transition-colors"
                onClick={() => router.push("/villages")}
              >
                <List className="w-3.5 h-3.5 mr-1" />
                All Villages
              </button>
            </nav>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 text-white text-[13px] font-medium shadow-sm">
              <Map className="w-4 h-4" />
              Home
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-blue-200 hover:bg-white/10 text-[13px] transition-colors"
              onClick={() => router.push("/villages")}
            >
              <List className="w-4 h-4" />
              All Villages
            </button>
          </nav>

          <div className="hidden lg:flex items-center justify-end gap-2.5 shrink-0">
            {siteContent.partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="h-9 w-20 md:w-24 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center px-2 py-1 shadow-sm border border-white/20 hover:bg-white transition-colors"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-7 w-full object-contain"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="relative h-[340px] overflow-hidden">
        <ImageWithFallback
          src={siteContent.heroImage}
          alt="Ganga River Basin"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-screen-2xl mx-auto px-6 w-full">
            <div className="max-w-lg">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-[12px] rounded-full mb-3 backdrop-blur-sm">
                {siteContent.heroEyebrow}
              </span>
              <h2 className="text-white text-[32px]" style={{ lineHeight: 1.2 }}>
                {siteContent.heroTitle}
              </h2>
              <p className="text-blue-100 text-[14px] mt-3 leading-relaxed">
                {siteContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={() => router.push("/villages")}
                  className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white text-blue-800 rounded-lg text-[14px] sm:text-[13px] hover:bg-blue-50 transition-colors w-full sm:w-auto"
                >
                  Explore Villages
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#map-section"
                  className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-[14px] sm:text-[13px] hover:bg-white/30 transition-colors w-full sm:w-auto"
                >
                  <MapPin className="w-4 h-4" />
                  View Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[22px] text-blue-800">{villages.length}</p>
              <p className="text-[12px] text-gray-500">Villages Surveyed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[22px] text-green-800">{formatIndianWholeNumber(totalPop)}</p>
              <p className="text-[12px] text-gray-500">Total Population</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[22px] text-amber-800">{formatIndianWholeNumber(totalHH)}</p>
              <p className="text-[12px] text-gray-500">Households Covered</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[22px] text-purple-800">{avgScore}/5</p>
              <p className="text-[12px] text-gray-500">Avg. Village Score</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 py-8 grid md:grid-cols-[1fr_2fr] gap-8 items-start">
        <div className="md:sticky md:top-24 bg-gray-50 z-[5] pb-4 md:pb-0">
          <h3 className="text-gray-800 text-[18px] mb-3">{siteContent.aboutTitle}</h3>
          <p className="text-[14px] text-gray-600 leading-relaxed mb-4">{siteContent.aboutBody}</p>
          <p className="text-[14px] text-gray-600 leading-relaxed">
            Spanning across {statesSet.size} states - {Array.from(statesSet).join(", ")} - this portal
            provides an interactive GIS-based view to explore village-level data, view assessment scores,
            and access recommended solutions based on each village's unique profile.
          </p>
        </div>
        <div>
          <h3 className="text-gray-800 text-[18px] mb-3">{siteContent.focusTitle}</h3>
          <p className="text-[14px] text-gray-600 mb-4">{siteContent.focusBlurb}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {siteContent.focusAreas.map((area) => {
              const Icon = focusAreaIcons[area.label as keyof typeof focusAreaIcons] ?? Target;

              return (
                <div
                  key={area.label}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${area.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] text-gray-700">{area.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <p className="text-[13px] text-blue-700">
              <strong>9 Assessment Categories</strong> with expandable sub-indicators and tailored
              solutions mapped to Low / Medium / High score levels.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <h3 className="text-gray-800 text-[18px] mb-4">{siteContent.galleryTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {siteContent.photoGallery.map((photo, index) => (
              <div key={`${photo.src}-${index}`} className="relative group rounded-xl overflow-hidden aspect-[4/3]">
                <ImageWithFallback
                  src={photo.src}
                  alt={photo.alt ?? photo.caption ?? "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2.5 left-3 right-3 text-[12px] text-white">{photo.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="map-section" className="max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800 text-[18px]">{siteContent.mapTitle}</h3>
            <p className="text-[13px] text-gray-500 mt-0.5">{siteContent.mapDescription}</p>
          </div>
          <button
            onClick={() => router.push("/villages")}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] hover:bg-blue-700 transition-colors"
          >
            <List className="w-4 h-4" />
            View All Villages
          </button>
        </div>
        <div className="h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <MapView
            villages={villages}
            selectedVillageId={selectedVillageId}
            onVillageClick={handleVillageClick}
          />
        </div>
      </section>

      <section className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <h3 className="text-gray-800 text-[18px] mb-4">{siteContent.topVillagesTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...villages]
              .sort((a, b) => b.overallScore - a.overallScore)
              .slice(0, 5)
              .map((village) => (
                <div
                  key={village.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/villages?selected=${village.id}`)}
                >
                  <div className="w-full h-28 rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={village.images[0]}
                      alt={village.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[14px] text-gray-800">{village.name}</h4>
                  <p className="text-[12px] text-gray-500">{village.district}, {village.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          village.overallScore > 3.5 ? "bg-green-500" : village.overallScore > 2.0 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${(village.overallScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-gray-600">{village.overallScore.toFixed(2)}/5</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-300 bg-gray-200/95 text-gray-700 py-6 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {siteContent.partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="h-11 w-28 md:w-32 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center px-3 py-1.5 shadow-sm border border-gray-300/80"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-8 w-full object-contain"
                  loading="eager"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-gray-600">
            <span>Digital Village Microplan Portal - Ganga River Basin Village Assessment</span>
            <span>
              {statesSet.size} States &middot; {villages.length} Villages &middot; 9 Categories
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
