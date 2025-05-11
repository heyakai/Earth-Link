"use client";

import React, { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg mb-2 transition-transform duration-300"
        style={{
          transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        <div className="flex flex-col gap-1">
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`bg-black/70 p-4 rounded-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Projection Toggle Switch */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-sm">Globe View</span>
          <button
            onClick={onProjectionToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              projection === "globe" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                projection === "globe" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        
        {projection === "globe" && (
          <>
            <p className="text-white text-sm mb-2">Atmosphere Style</p>
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
          </>
        )}
      </div>
    </div>
  );
}