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
  "horizon-blend": 0.2, // Atmosphere thickness (0 to 1)
  "space-color": "rgb(13, 13, 17)", // Background/space color
  "star-intensity": 0.3, // Background star brightness (0 to 1)
};

// Alternative atmosphere presets
export const atmospherePresets = {
  night: {
    color: "#333333",
    "high-color": "rgb(10, 30, 60)",
    "horizon-blend": 0.1,
    "space-color": "rgb(5, 5, 15)",
    "star-intensity": 0.8,
  } as FogSettings,
  light: {
    color: "#ffffff", // Lower atmosphere
    "high-color": "rgb(36, 92, 223)", // Upper atmosphere
    "horizon-blend": 0.2, // Atmosphere thickness (0 to 1)
    "space-color": "rgb(13, 13, 17)", // Background/space color
    "star-intensity": 0.3, // Background star brightness (0 to 1)
  } as FogSettings,
  sunrise: {
    color: "#ffeecc",
    "high-color": "rgb(255, 150, 50)",
    "horizon-blend": 0.2,
    "space-color": "rgb(13, 13, 30)",
    "star-intensity": 0.08,
  } as FogSettings,
  scifi: {
    color: "#22aaff",
    "high-color": "rgb(0, 120, 255)",
    "horizon-blend": 0.3,
    "space-color": "rgb(0, 0, 20)",
    "star-intensity": 0.6,
  } as FogSettings,
};

// Map base configuration
export const mapConfig = {
  style: "mapbox://styles/mapbox/dark-v11",
  initialView: {
    center: [0, 0] as LngLatLike,
    zoom: 1.5,
    maxPitch: 85,
    dragRotate: true,
    touchZoomRotate: true,
    attributionControl: true,
  },
  defaultProjection: "globe" as "globe" | "mercator",
}; 