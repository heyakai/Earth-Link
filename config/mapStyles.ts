/**
 * Map styling configuration
 * Contains settings for different map views and atmosphere effects
 */

import { LngLatLike } from "mapbox-gl";

// Customizable atmosphere/fog settings for the globe view
export interface FogSettings {
  color: string;          // Lower atmosphere color
  "high-color": string;   // Upper atmosphere color
  "horizon-blend": number; // Atmosphere thickness (0 to 1)
  "space-color": string;   // Background/space color
  "star-intensity": number; // Background star brightness (0 to 1)
}

// Base fog/atmosphere configuration for globe view
export const baseFogSettings: FogSettings = {
  color: "#ffffff", // Lower atmosphere
  "high-color": "rgb(36, 92, 223)", // Upper atmosphere
  "horizon-blend": 0, // Atmosphere thickness (0 to 1)
  "space-color": "rgb(13, 13, 17)", // Background/space color
  "star-intensity": 0.1, // Background star brightness (0 to 1)
};

// Alternative atmosphere presets
export const atmospherePresets = {
  default: baseFogSettings,
  sunrise: {
    color: "#ffeecc",
    "high-color": "rgb(255, 150, 50)",
    "horizon-blend": 0.2,
    "space-color": "rgb(13, 13, 30)",
    "star-intensity": 0.05,
  } as FogSettings,
  night: {
    color: "#333333",
    "high-color": "rgb(10, 30, 60)",
    "horizon-blend": 0.1,
    "space-color": "rgb(5, 5, 15)",
    "star-intensity": 0.8,
  } as FogSettings,
  scifi: {
    color: "#22aaff",
    "high-color": "rgb(0, 120, 255)",
    "horizon-blend": 0.3,
    "space-color": "rgb(0, 0, 20)",
    "star-intensity": 0.6,
  } as FogSettings,
};

// Function to get dynamic fog settings based on zoom level
export const getDynamicFogSettings = (zoomLevel: number, baseSettings: FogSettings = baseFogSettings): FogSettings => {
  // Adjust star intensity based on zoom level - stars fade out as you zoom in
  const starIntensity = Math.max(0, 0.6 - (zoomLevel - 1.5) * 0.1);
  
  // Make horizon blend thicker as you zoom in (more atmosphere visible)
  const horizonBlend = Math.min(0.5, 0.02 + (zoomLevel - 1.5) * 0.05);
  
  return {
    ...baseSettings,
    "horizon-blend": horizonBlend,
    "star-intensity": starIntensity,
  };
};

// Map base configuration
export const mapConfig = {
  style: "mapbox://styles/mapbox/dark-v11",
  initialView: {
    center: [0, 0] as LngLatLike,
    zoom: 2,
    maxPitch: 85,
    dragRotate: true,
    touchZoomRotate: true,
    attributionControl: false,
  },
  defaultProjection: "globe" as "globe" | "mercator",
}; 