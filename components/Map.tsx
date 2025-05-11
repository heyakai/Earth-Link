"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { 
  baseFogSettings, 
  mapConfig, 
  atmospherePresets,
  FogSettings
} from "../config/mapStyles";
import MapControls from "./MapControls";

// You'll need to replace this with your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Marker {
  id?: number;
  longitude: number;
  latitude: number;
  website: string;
  siteName: string;
  siteDescription?: string;
  ownerName?: string;
  ownerDescription?: string;
  ownerWebsite?: string;
  isAnonymous: boolean;
  created_at?: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onAddSite: () => void;
  onClose: () => void;
}

function ContextMenu({ x, y, onAddSite, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust position to keep menu within viewport
  const adjustedY = y + 200 > window.innerHeight ? y - 100 : y;
  const adjustedX = x + 200 > window.innerWidth ? x - 150 : x;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-black/90 rounded-lg shadow-lg w-40 py-2"
      style={{
        top: `${adjustedY}px`,
        left: `${adjustedX}px`,
      }}
    >
      <button
        className="w-full px-4 py-2 text-white hover:bg-blue-600 text-left"
        onClick={onAddSite}
      >
        Put my site here
      </button>
      <button
        className="w-full px-4 py-2 text-white hover:bg-blue-600 text-left"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  );
}

interface AddSiteFormProps {
  position: mapboxgl.LngLat;
  onSubmit: (
    data: Omit<Marker, "id" | "created_at" | "longitude" | "latitude">,
  ) => void;
  onClose: () => void;
}

function AddSiteForm({ position, onSubmit, onClose }: AddSiteFormProps) {
  const [formData, setFormData] = useState({
    siteName: "",
    website: "",
    siteDescription: "",
    ownerName: "",
    ownerDescription: "",
    ownerWebsite: "",
    isAnonymous: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add marker");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-black/90 text-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Your Site</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Site Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.siteName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siteName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Site URL *</label>
            <input
              type="url"
              required
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Site Description</label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.siteDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  siteDescription: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="anonymous"
              className="mr-2"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAnonymous: e.target.checked,
                }))
              }
            />
            <label htmlFor="anonymous" className="text-sm">
              Stay Anonymous
            </label>
          </div>
          {!formData.isAnonymous && (
            <>
              <div>
                <label className="block text-sm mb-1">Owner Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Owner Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerDescription: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Owner Website</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerWebsite}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerWebsite: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<mapboxgl.LngLat | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [projection, setProjection] = useState<"globe" | "mercator">(mapConfig.defaultProjection);
  const [atmosphereStyle, setAtmosphereStyle] = useState<string>("night");
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const loadMarkers = async () => {
    try {
      const response = await fetch("/api/markers");
      const data = await response.json();
      setMarkers(data);

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add markers to the map
      data.forEach((marker: Marker) => {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([marker.longitude, marker.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
            <div class="p-3">
              <h3 class="font-bold mb-2">${marker.siteName}</h3>
              <p class="mb-2">${marker.siteDescription || ""}</p>
              <a href="${marker.website}" target="_blank" rel="noopener noreferrer"
                 class="text-blue-400 hover:text-blue-300 block mb-2">Visit Website</a>
              ${
                !marker.isAnonymous
                  ? `
                <div class="border-t pt-2 mt-2">
                  <p class="font-semibold">${marker.ownerName || ""}</p>
                  <p class="text-sm">${marker.ownerDescription || ""}</p>
                  ${
                    marker.ownerWebsite
                      ? `
                    <a href="${marker.ownerWebsite}" target="_blank" rel="noopener noreferrer"
                       class="text-blue-400 hover:text-blue-300 text-sm">Owner's Website</a>
                  `
                      : ""
                  }
                </div>
              `
                  : ""
              }
            </div>
          `),
          )
          .addTo(map.current!);
        markersRef.current.push(newMarker);
      });
    } catch (error) {
      console.error("Failed to load markers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewMarker = async (
    lngLat: mapboxgl.LngLat,
    markerData: Omit<Marker, "id" | "created_at" | "longitude" | "latitude">,
  ) => {
    try {
      const response = await fetch("/api/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
          ...markerData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add marker");
      }

      const newMarker = new mapboxgl.Marker()
        .setLngLat([lngLat.lng, lngLat.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <div class="p-3">
            <h3 class="font-bold mb-2">${markerData.siteName}</h3>
            <p class="mb-2">${markerData.siteDescription || ""}</p>
            <a href="${markerData.website}" target="_blank" rel="noopener noreferrer"
               class="text-blue-400 hover:text-blue-300 block mb-2">Visit Website</a>
            ${
              !markerData.isAnonymous
                ? `
              <div class="border-t pt-2 mt-2">
                <p class="font-semibold">${markerData.ownerName || ""}</p>
                <p class="text-sm">${markerData.ownerDescription || ""}</p>
                ${
                  markerData.ownerWebsite
                    ? `
                  <a href="${markerData.ownerWebsite}" target="_blank" rel="noopener noreferrer"
                     class="text-blue-400 hover:text-blue-300 text-sm">Owner's Website</a>
                `
                    : ""
                }
              </div>
            `
                : ""
            }
          </div>
        `),
        )
        .addTo(map.current!);

      setMarkers((prev) => [
        ...prev,
        {
          longitude: lngLat.lng,
          latitude: lngLat.lat,
          ...markerData,
        } as Marker,
      ]);
    } catch (error) {
      console.error("Failed to add marker:", error);
      throw error; // Re-throw to handle in the form submission
    }
  };

  const changeAtmosphereStyle = (style: string) => {
    if (!map.current || projection !== "globe") return;
    setAtmosphereStyle(style);
    const styleKey = style as keyof typeof atmospherePresets;
    const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
    if (map.current.isStyleLoaded()) {
      map.current.setFog(selectedStyle);
    } else {
      const checkAndApply = () => {
        if (map.current && map.current.isStyleLoaded()) {
          map.current.setFog(selectedStyle);
        } else {
          setTimeout(checkAndApply, 100);
        }
      };
      checkAndApply();
    }
  };

  const toggleProjection = () => {
    if (!map.current) return;

    const newProjection = projection === "globe" ? "mercator" : "globe";
    map.current.setProjection(newProjection);
    setProjection(newProjection);

    // If switching to globe, apply the current atmosphere style
    if (newProjection === "globe") {
      // Wait for the projection change to take effect before applying fog
      setTimeout(() => {
        // Re-apply the current atmosphere style
        const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
        const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
        const currentZoom = map.current?.getZoom() || mapConfig.initialView.zoom;
        const dynamicSettings = selectedStyle;
        
        if (map.current?.isStyleLoaded()) {
          map.current.setFog(dynamicSettings);
        } else {
          const checkAndApply = () => {
            if (map.current && map.current.isStyleLoaded()) {
              map.current.setFog(dynamicSettings);
            } else {
              setTimeout(checkAndApply, 100);
            }
          };
          checkAndApply();
        }
      }, 50);
    } else {
      // Remove fog/atmosphere when in mercator mode
      // Even for removing fog, we should wait for style to be ready
      if (map.current.isStyleLoaded()) {
        map.current.setFog(null);
      } else {
        const waitAndRemoveFog = () => {
          if (map.current && map.current.isStyleLoaded()) {
            map.current.setFog(null);
          } else {
            setTimeout(waitAndRemoveFog, 100);
          }
        };
        waitAndRemoveFog();
      }
    }
  };

  const handleLocateUser = () => {
    if (geolocateControlRef.current) {
      geolocateControlRef.current.trigger();
    }
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.easeTo({
        center: mapConfig.initialView.center,
        zoom: mapConfig.initialView.zoom,
        pitch: 0,
        bearing: 0,
        duration: 1000
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    try {
      if (!mapboxgl.accessToken) {
        console.error("Mapbox token not found");
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapConfig.style,
        center: mapConfig.initialView.center,
        zoom: mapConfig.initialView.zoom,
        maxPitch: mapConfig.initialView.maxPitch,
        dragRotate: mapConfig.initialView.dragRotate,
        touchZoomRotate: mapConfig.initialView.touchZoomRotate,
        projection: projection,
        attributionControl: mapConfig.initialView.attributionControl,
      });

      // Add geolocate control
      geolocateControlRef.current = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showUserLocation: true,
        showAccuracyCircle: true,
        fitBoundsOptions: {
          maxZoom: 15
        }
      });
      map.current.addControl(geolocateControlRef.current, 'top-right');

      // Add event listeners for geolocate control
      map.current.on('geolocate', () => {
        setIsLocating(true);
      });

      map.current.on('geolocateend', () => {
        setIsLocating(false);
      });

      // Wait for map to load before adding markers
      map.current.on("load", () => {
        console.log("Map loaded successfully");
        mapRef.current = map.current;

        // Set up a handler for style.load to ensure the style is fully loaded
        map.current?.on("style.load", () => {
          console.log("Map style loaded successfully");
          
          // Add custom atmosphere styling
          if (projection === "globe") {
            const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
            const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
            map.current?.setFog(selectedStyle);
          }
        });

        // Apply initial atmosphere style
        if (projection === "globe") {
          const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
          const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
          map.current?.setFog(selectedStyle);
        }

        loadMarkers();
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
      });

      // Handle right click for context menu
      map.current.on("contextmenu", (e) => {
        e.preventDefault();
        setShowContextMenu(false);
        setShowForm(false);

        setContextMenuPos({ x: e.point.x, y: e.point.y });
        setSelectedPosition(e.lngLat);
        setShowContextMenu(true);
      });

      // Handle left click for marker popups and menu closing
      map.current.on("click", () => {
        setShowContextMenu(false);
      });

      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  // Handle atmosphere style changes
  useEffect(() => {
    if (map.current && projection === "globe" && map.current.isStyleLoaded()) {
      const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
      const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
      map.current.setFog(selectedStyle);
    }
  }, [atmosphereStyle, projection]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls */}
      <MapControls
        projection={projection}
        atmosphereStyle={atmosphereStyle}
        onProjectionToggle={toggleProjection}
        onAtmosphereChange={changeAtmosphereStyle}
        onLocateUser={handleLocateUser}
        onResetView={handleResetView}
        isLocating={isLocating}
      />

      {showContextMenu && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onAddSite={() => {
            setShowContextMenu(false);
            setShowForm(true);
          }}
          onClose={() => setShowContextMenu(false)}
        />
      )}
      {showForm && selectedPosition && (
        <AddSiteForm
          position={selectedPosition}
          onSubmit={async (data) => {
            try {
              await addNewMarker(selectedPosition, data);
              await loadMarkers(); // Reload markers after adding new one
            } catch (error) {
              console.error("Error adding marker:", error);
            }
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
