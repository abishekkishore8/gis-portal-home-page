import { useEffect, useRef, useState } from "react";
import { villages, Village } from "../data/villages";

interface MapViewProps {
  selectedVillageId?: string | null;
  onVillageClick: (village: Village) => void;
}

const getMarkerColor = (score: number, isSelected: boolean) => {
  if (isSelected) return "#f59e0b";
  if (score <= 1) return "#ef4444";
  if (score <= 2) return "#f97316";
  if (score <= 3) return "#eab308";
  if (score <= 4) return "#22c55e";
  return "#10b981";
};

declare global {
  interface Window {
    L: any;
  }
}

export function MapView({ selectedVillageId, onVillageClick }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);
  const isDestroyedRef = useRef(false);
  const [activeLayer, setActiveLayer] = useState<string>("osm");
  const layerRef = useRef<any>(null);

  // Load Leaflet from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);

    // Don't remove CDN resources on cleanup - they can be reused
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !containerRef.current || mapRef.current) return;

    isDestroyedRef.current = false;
    const L = window.L;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      fadeAnimation: false,
      zoomAnimation: false,
    }).setView([27.5, 82.0], 6);

    // Default OSM layer
    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    });

    osmLayer.addTo(map);
    layerRef.current = osmLayer;

    mapRef.current = map;

    villages.forEach((village) => {
      const isSelected = village.id === selectedVillageId;
      const color = getMarkerColor(village.overallScore, isSelected);
      const size = isSelected ? 18 : 12;
      const border = isSelected ? 4 : 2;

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: ${size}px; height: ${size}px;
          background: ${color};
          border: ${border}px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          ${isSelected ? "animation: pulse 1.5s infinite;" : ""}
        "></div>`,
        iconSize: [size + border * 2, size + border * 2],
        iconAnchor: [(size + border * 2) / 2, (size + border * 2) / 2],
      });

      const marker = L.marker([village.lat, village.lng], { icon })
        .addTo(map)
        .bindTooltip(
          `<div style="padding:4px 8px;">
            <strong>${village.name}</strong><br/>
            <span style="color:#666">${village.district}, ${village.state}</span><br/>
            <span>Score: ${village.overallScore}/5</span>
          </div>`,
          { direction: "top", offset: [0, -10] }
        );

      marker.on("click", () => onVillageClick(village));
      markersRef.current.push(marker);
    });

    return () => {
      isDestroyedRef.current = true;
      markersRef.current = [];
      if (mapRef.current) {
        try {
          mapRef.current.stop();
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
        mapRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Update markers on selection change
  useEffect(() => {
    if (!mapRef.current || !window.L || isDestroyedRef.current) return;
    const L = window.L;

    markersRef.current.forEach((marker, index) => {
      const village = villages[index];
      const isSelected = village.id === selectedVillageId;
      const color = getMarkerColor(village.overallScore, isSelected);
      const size = isSelected ? 18 : 12;
      const border = isSelected ? 4 : 2;

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: ${size}px; height: ${size}px;
          background: ${color};
          border: ${border}px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          ${isSelected ? "animation: pulse 1.5s infinite;" : ""}
        "></div>`,
        iconSize: [size + border * 2, size + border * 2],
        iconAnchor: [(size + border * 2) / 2, (size + border * 2) / 2],
      });

      marker.setIcon(icon);
    });

    if (selectedVillageId) {
      const village = villages.find((v) => v.id === selectedVillageId);
      if (village) {
        mapRef.current.setView([village.lat, village.lng], 9, { animate: true });
      }
    }
  }, [selectedVillageId]);

  // Switch tile layer
  const switchLayer = (layerKey: string) => {
    if (!mapRef.current || !window.L || isDestroyedRef.current) return;
    const L = window.L;

    if (layerRef.current) {
      mapRef.current.removeLayer(layerRef.current);
    }

    const layers: Record<string, any> = {
      osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }),
      satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
          maxZoom: 18,
        }
      ),
      terrain: L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
          maxZoom: 17,
        }
      ),
      topography: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "&copy; Esri &mdash; Sources: Esri, HERE, Garmin, USGS",
          maxZoom: 18,
        }
      ),
    };

    const newLayer = layers[layerKey];
    if (newLayer) {
      newLayer.addTo(mapRef.current);
      layerRef.current = newLayer;
      setActiveLayer(layerKey);
    }
  };

  const layerOptions = [
    { key: "satellite", label: "Satellite", icon: "🛰️" },
    { key: "topography", label: "Topo", icon: "🏔️" },
    { key: "terrain", label: "Terrain", icon: "⛰️" },
    { key: "osm", label: "OSM", icon: "🗺️" },
  ];

  return (
    <div className="relative w-full h-full">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] text-gray-500">Loading map...</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      {/* Layer Switcher */}
      {leafletLoaded && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg z-[1000] overflow-hidden">
          <p className="px-3 py-1.5 text-[11px] text-gray-500 border-b border-gray-200">Map Layers</p>
          <div className="flex flex-col">
            {layerOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => switchLayer(opt.key)}
                className={`flex items-center gap-2 px-3 py-2 text-[12px] transition-colors text-left ${
                  activeLayer === opt.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-[14px]">{opt.icon}</span>
                <span>{opt.label}</span>
                {activeLayer === opt.key && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <p className="mb-2 text-[13px] text-gray-500">Score Legend</p>
        <div className="flex flex-col gap-1.5">
          {[
            { color: "#ef4444", label: "Very Low (1)" },
            { color: "#f97316", label: "Low (2)" },
            { color: "#eab308", label: "Medium (3)" },
            { color: "#22c55e", label: "Good (4)" },
            { color: "#10b981", label: "Excellent (5)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ background: item.color }}
              />
              <span className="text-[12px] text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}