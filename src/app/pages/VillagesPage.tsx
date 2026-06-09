"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapView } from "../components/MapView";
import { VillageList } from "../components/VillageList";
import { VillageDetail } from "../components/VillageDetail";
import { ImageGallery } from "../components/ImageGallery";
import type { SiteContent } from "../data/site-content";
import type { Village } from "../data/village-types";
import { Globe, Map, List, X, Menu } from "lucide-react";

type VillagesPageProps = {
  initialVillages: Village[];
  siteContent: SiteContent;
};

export function VillagesPage({ initialVillages, siteContent }: VillagesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [villages] = useState(initialVillages);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(
    searchParams.get("selected")
  );
  const [detailVillage, setDetailVillage] = useState<Village | null>(null);
  const [galleryVillage, setGalleryVillage] = useState<Village | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const selected = searchParams.get("selected");
    setSelectedVillageId(selected);
  }, [searchParams]);

  const handleSelectVillage = (village: Village) => {
    setSelectedVillageId(village.id);
    setGalleryVillage(null);
    router.push(`/villages?selected=${village.id}`);
    setIsSidebarOpen(false);
  };

  const handleViewDetails = (village: Village) => {
    setDetailVillage(village);
    setGalleryVillage(null);
    setIsSidebarOpen(true);
  };

  const handleMapClick = (village: Village) => {
    setSelectedVillageId(village.id);
    setIsSidebarOpen(false);
  };

  const handleShowImages = (village: Village) => {
    setGalleryVillage(village);
  };

  const handleCloseGallery = () => {
    setGalleryVillage(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Nav */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-lg z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex w-9 h-9 bg-white/20 rounded-lg items-center justify-center shrink-0">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h1 className="text-[14px] sm:text-[16px] md:text-[18px] text-white leading-tight">Digital Village Microplan Portal</h1>
              <p className="text-[10px] md:text-[11px] text-blue-200 hidden sm:block">Ganga River Basin Village Assessment</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <button
              className="flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-2 rounded-lg text-blue-200 hover:bg-white/10 text-[12px] md:text-[13px] transition-colors"
              onClick={() => router.push("/")}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-white/20 text-white text-[12px] md:text-[13px] lg:pointer-events-none"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">All Villages</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop for mobile/tablet */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/40 z-20 lg:hidden transition-opacity backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Panel - Village List or Detail */}
        <div className={`
          absolute lg:relative z-30 h-full
          w-[85%] sm:w-[350px] lg:w-[400px]
          bg-white shadow-2xl lg:shadow-none border-r border-gray-200
          transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Mobile/Tablet Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 z-[100] p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 lg:hidden shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {detailVillage ? (
            <VillageDetail
              village={detailVillage}
              siteContent={siteContent}
              onBack={() => setDetailVillage(null)}
              onShowImages={() => handleShowImages(detailVillage)}
            />
          ) : (
            <VillageList
              villages={villages}
              selectedVillageId={selectedVillageId}
              onSelectVillage={handleSelectVillage}
              onViewDetails={handleViewDetails}
              onShowImages={handleShowImages}
            />
          )}
        </div>

        {/* Right Panel - Map or Image Gallery */}
        <div className="flex-1 w-full h-full relative flex flex-col bg-gray-100 z-10">
          {/* Toggle Button for mobile/tablet */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-16 z-[1000] lg:hidden bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-lg shadow-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium border border-gray-200/50"
          >
            <Menu className="w-5 h-5 text-[#0f766e]" />
            <span className="text-[13px]">Village List</span>
          </button>

          {galleryVillage ? (
            <ImageGallery village={galleryVillage} onClose={handleCloseGallery} />
          ) : (
            <MapView
              villages={villages}
              selectedVillageId={selectedVillageId}
              onVillageClick={handleMapClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
