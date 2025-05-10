"use client";

import React from "react";
import { atmospherePresets } from "../config/mapStyles";

interface MapControlsProps {
  projection: "globe" | "mercator";
  atmosphereStyle: string;
  onProjectionToggle: () => void;
  onAtmosphereChange: (style: string) => void;
}

export default function MapControls({
  projection,
  atmosphereStyle,
  onProjectionToggle,
  onAtmosphereChange,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={onProjectionToggle}
        className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg"
      >
        {projection === "globe" ? "Switch to Flat Map" : "Switch to Globe"}
      </button>
      
      {projection === "globe" && (
        <div className="bg-black/70 p-2 rounded-lg">
          <p className="text-white text-sm mb-1">Atmosphere Style</p>
          <div className="grid grid-cols-2 gap-1">
            {Object.keys(atmospherePresets).map((style) => (
              <button
                key={style}
                onClick={() => onAtmosphereChange(style)}
                className={`text-white text-sm px-2 py-1 rounded ${
                  atmosphereStyle === style 
                    ? "bg-blue-600" 
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}