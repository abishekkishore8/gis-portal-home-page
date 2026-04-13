import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { MapView } from "../components/MapView";
import { VillageList } from "../components/VillageList";
import { VillageDetail } from "../components/VillageDetail";
import { ImageGallery } from "../components/ImageGallery";
import { Village, villages } from "../data/villages";
import { Globe, Map, List } from "lucide-react";

export function VillagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(
    searchParams.get("selected")
  );
  const [detailVillage, setDetailVillage] = useState<Village | null>(null);
  const [galleryVillage, setGalleryVillage] = useState<Village | null>(null);

  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      setSelectedVillageId(selected);
    }
  }, [searchParams]);

  const handleSelectVillage = (village: Village) => {
    setSelectedVillageId(village.id);
    setGalleryVillage(null); // switch back to map when selecting
  };

  const handleViewDetails = (village: Village) => {
    setDetailVillage(village);
    setGalleryVillage(null);
  };

  const handleMapClick = (village: Village) => {
    setSelectedVillageId(village.id);
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
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] text-white">GIS Microplan Portal</h1>
              <p className="text-[11px] text-blue-200">Ganga River Basin Village Assessment</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-blue-200 hover:bg-white/10 text-[13px] transition-colors"
              onClick={() => navigate("/")}
            >
              <Map className="w-4 h-4" />
              Home
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 text-white text-[13px]">
              <List className="w-4 h-4" />
              All Villages
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Village List or Detail */}
        <div className="w-[400px] shrink-0 border-r border-gray-200 overflow-hidden">
          {detailVillage ? (
            <VillageDetail
              village={detailVillage}
              onBack={() => setDetailVillage(null)}
              onShowImages={() => handleShowImages(detailVillage)}
            />
          ) : (
            <VillageList
              selectedVillageId={selectedVillageId}
              onSelectVillage={handleSelectVillage}
              onViewDetails={handleViewDetails}
              onShowImages={handleShowImages}
            />
          )}
        </div>

        {/* Right Panel - Map or Image Gallery */}
        <div className="flex-1 relative">
          {galleryVillage ? (
            <ImageGallery village={galleryVillage} onClose={handleCloseGallery} />
          ) : (
            <MapView
              selectedVillageId={selectedVillageId}
              onVillageClick={handleMapClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
