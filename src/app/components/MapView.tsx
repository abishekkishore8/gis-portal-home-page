"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, ChevronUp } from "lucide-react";
import type { Village } from "../data/village-types";

interface MapViewProps {
  villages: Village[];
  selectedVillageId?: string | null;
  onVillageClick: (village: Village) => void;
}

const getMarkerColor = (score: number, isSelected: boolean) => {
  if (isSelected) return "#f59e0b";
  if (score <= 2.0) return "#ef4444";
  if (score <= 3.5) return "#eab308";
  return "#10b981";
};

const formatScore = (score: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(score);

const DEFAULT_CENTER: [number, number] = [27.5, 82.0];
const DEFAULT_ZOOM = 6;
const SELECTED_VILLAGE_ZOOM = 12;

const GANGA_BASIN_BOUNDS: [[number, number], [number, number]] = [
  [19.0, 70.0], // SouthWest (zoomed out more)
  [33.5, 91.5]  // NorthEast (zoomed out more)
];

declare global {
  interface Window {
    L: any;
  }
}

export function MapView({ villages, selectedVillageId, onVillageClick }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const isDestroyedRef = useRef(false);
  const [activeLayer, setActiveLayer] = useState<string>("satellite");
  const layerRef = useRef<any>(null);
  const geoJsonLayersRef = useRef<Record<string, any>>({});
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [isTileLegendExpanded, setIsTileLegendExpanded] = useState(false);
  const [visibleGeoJsonLayers, setVisibleGeoJsonLayers] = useState<Record<string, boolean>>({
    "ganga-tributaries": true,
    "ganga-basin": true,
    "india-states": true,
  });

  const recenterMap = () => {
    if (!mapRef.current || !window.L || villages.length === 0 || isDestroyedRef.current) return;

    const selectedVillage = selectedVillageId
      ? villages.find((village) => village.id === selectedVillageId)
      : null;

    if (selectedVillage) {
      mapRef.current.setView([selectedVillage.lat, selectedVillage.lng], SELECTED_VILLAGE_ZOOM, {
        animate: true,
      });
      return;
    }

    mapRef.current.fitBounds(GANGA_BASIN_BOUNDS, {
      padding: [60, 60],
      animate: true,
    });
  };

  const toggleGeoJsonLayer = (layerKey: string) => {
    if (!mapRef.current || !window.L || isDestroyedRef.current) return;

    const newState = !visibleGeoJsonLayers[layerKey];
    setVisibleGeoJsonLayers(prev => ({ ...prev, [layerKey]: newState }));

    if (newState && geoJsonLayersRef.current[layerKey]) {
      mapRef.current.addLayer(geoJsonLayersRef.current[layerKey]);
    } else if (!newState && geoJsonLayersRef.current[layerKey]) {
      mapRef.current.removeLayer(geoJsonLayersRef.current[layerKey]);
    }
  };

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
      attributionControl: false,
      minZoom: 5,
      maxBounds: [
        [5.0, 60.0], // South West bound of India (roughly)
        [38.0, 100.0] // North East bound of India (roughly)
      ],
      maxBoundsViscosity: 1.0
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 18,
      }
    );

    satelliteLayer.addTo(map);
    layerRef.current = satelliteLayer;

    // Create custom panes for strict layering (bottom to top)
    map.createPane('india-states-pane');
    map.getPane('india-states-pane').style.zIndex = 400;

    map.createPane('ganga-basin-pane');
    map.getPane('ganga-basin-pane').style.zIndex = 401;

    map.createPane('ganga-tributaries-pane');
    map.getPane('ganga-tributaries-pane').style.zIndex = 402;

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
        .bindPopup(
          `<div style="padding:4px 8px; min-width:140px;">
            <strong style="font-size: 14px; color: #1f2937;">${village.name}</strong><br/>
            <span style="color:#6b7280; font-size: 12px;">${village.district}, ${village.state}</span><br/>
            <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb;">
              <span style="font-size: 12px; font-weight: 500; color: #4b5563;">Score: ${formatScore(village.overallScore)}/5</span>
            </div>
          </div>`,
          { offset: [0, -10], closeButton: false }
        );

      marker.on("click", () => onVillageClick(village));
      markersRef.current.push(marker);
    });

    if (selectedVillageId) {
      const village = villages.find((v) => v.id === selectedVillageId);
      if (village) {
        map.setView([village.lat, village.lng], SELECTED_VILLAGE_ZOOM);
      } else {
        map.fitBounds(GANGA_BASIN_BOUNDS, { padding: [60, 60] });
      }
    } else {
      map.fitBounds(GANGA_BASIN_BOUNDS, { padding: [60, 60] });
    }

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

  // Load GeoJSON layers after map is initialized
  useEffect(() => {
    if (!mapRef.current || !window.L || isDestroyedRef.current) return;

    const L = window.L;
    const geoJsonLayers = [
      {
        key: "ganga-tributaries",
        url: "/map-layers/ganga-tributaries.geojson",
        color: "#00d8ff",
        weight: 3,
        label: "Tributaries"
      },
      {
        key: "ganga-basin",
        url: "/map-layers/ganga-basin.geojson",
        color: "#000000",
        weight: 3,
        label: "Ganga Basin"
      },
      {
        key: "india-states",
        url: "/map-layers/india-states.geojson",
        color: "#f472b6",
        weight: 2,
        label: "States"
      }
    ];

    geoJsonLayers.forEach(({ key, url, color, weight }) => {
      fetch(url)
        .then(res => res.json())
        .then(geojson => {
          console.log(`Loaded ${key}:`, geojson.features?.length || 0, 'features');
          const geoJsonLayer = L.geoJSON(geojson, {
            pane: `${key}-pane`,
            style: {
              color: color,
              weight: weight || 3,
              opacity: 1,
              fill: false,
              fillOpacity: 0
            },
            onEachFeature: (feature: any, layer: any) => {
              const props = feature.properties;
              const popupContent = Object.entries(props || {})
                .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
                .join('<br/>');
              if (popupContent) {
                layer.bindPopup(popupContent);
              }
            }
          });

          geoJsonLayersRef.current[key] = geoJsonLayer;

          // Add to map if visible on initial load
          if (visibleGeoJsonLayers[key]) {
            geoJsonLayer.addTo(mapRef.current);
            console.log(`Added ${key} to map`);
          }
        })
        .catch(err => console.error(`Failed to load ${key}:`, err));
    });
  }, [leafletLoaded]);

  // Handle GeoJSON layer visibility changes
  useEffect(() => {
    if (!mapRef.current || !window.L || isDestroyedRef.current) return;

    Object.entries(visibleGeoJsonLayers).forEach(([key, isVisible]) => {
      const layer = geoJsonLayersRef.current[key];
      if (!layer) return;

      if (isVisible) {
        if (!mapRef.current.hasLayer(layer)) {
          mapRef.current.addLayer(layer);
          console.log(`Made ${key} visible`);
        }
      } else {
        if (mapRef.current.hasLayer(layer)) {
          mapRef.current.removeLayer(layer);
          console.log(`Hid ${key}`);
        }
      }
    });
  }, [visibleGeoJsonLayers]);

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

      if (isSelected) {
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
      } else {
        if (marker.isPopupOpen()) {
          marker.closePopup();
        }
      }
    });

    if (selectedVillageId) {
      const village = villages.find((v) => v.id === selectedVillageId);
      if (village) {
        mapRef.current.setView([village.lat, village.lng], SELECTED_VILLAGE_ZOOM, { animate: true });
      }
    }
  }, [selectedVillageId, villages]);

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
    { key: "terrain", label: "Terrain", icon: "⛰️" },
    { key: "topography", label: "Topo", icon: "🏔️" },
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
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden w-36 md:w-40">
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsTileLegendExpanded(!isTileLegendExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 border-b border-gray-200 md:hidden"
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[11px] font-semibold text-gray-700">Base Map</span>
              </div>
              <ChevronUp className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isTileLegendExpanded ? 'rotate-180' : ''}`} />
            </button>
            <p className="hidden md:block px-3 py-1.5 text-[11px] text-gray-500 border-b border-gray-200">Base Map</p>
            
            {/* Collapsible Content */}
            <div className={`${isTileLegendExpanded ? 'block' : 'hidden'} md:block flex flex-col`}>
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
        </div>
      )}
      {leafletLoaded && (
        <button
          onClick={recenterMap}
          type="button"
          title={selectedVillageId ? "Recenter to selected village" : "Show all villages"}
          aria-label={selectedVillageId ? "Recenter to selected village" : "Show all villages"}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-[1000] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#0f766e] text-white shadow-xl transition-all hover:bg-[#115e59] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 md:h-5 md:w-5"
            aria-hidden="true"
          >
            <path d="M12 3v3" />
            <path d="M12 18v3" />
            <path d="M3 12h3" />
            <path d="M18 12h3" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </button>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg z-[1000] w-52 sm:w-64 md:max-w-xs md:w-auto">
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          className="w-full flex items-center justify-between h-10 px-3 md:hidden"
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-gray-700">Legend & Layers</span>
          </div>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${isLegendExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Collapsible Content */}
        <div className={`${isLegendExpanded ? 'block' : 'hidden'} md:block p-3 md:p-3 border-t border-gray-100 md:border-0`}>
          <div className="mb-3 pb-3 border-b border-gray-200">
            <p className="mb-2 text-[13px] font-semibold text-gray-600">Score Legend</p>
            <div className="flex flex-col gap-1.5">
              {[
                { color: "#ef4444", label: "Needs Attention (0-2)" },
                { color: "#eab308", label: "Improvement Needed (2.01-3.5)" },
                { color: "#10b981", label: "Well Performing (3.51-5)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-[12px] text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-gray-600">Map Layers</p>
            <div className="flex flex-col gap-2">
              {[
                { key: "ganga-tributaries", color: "#00d8ff", label: "Tributaries" },
                { key: "ganga-basin", color: "#000000", label: "Ganga Basin" },
                { key: "india-states", color: "#f472b6", label: "State Boundaries" },
              ].map((layer) => (
                <label key={layer.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleGeoJsonLayers[layer.key] || false}
                    onChange={() => toggleGeoJsonLayer(layer.key)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-2.5 h-2.5 border-2 flex-shrink-0"
                      style={{ borderColor: layer.color }}
                    />
                    <span className="text-[12px] text-gray-700">{layer.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}