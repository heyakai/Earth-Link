"use client";

import React, { useState } from "react";
import { atmospherePresets } from "../config/mapStyles";

interface MapControlsProps {
  projection: "globe" | "mercator";
  atmosphereStyle: string;
  onProjectionToggle: () => void;
  onAtmosphereChange: (style: string) => void;
  onLocateUser: () => void;
  onResetView: () => void;
  isLocating: boolean;
}

export default function MapControls({
  projection,
  atmosphereStyle,
  onProjectionToggle,
  onAtmosphereChange,
  onLocateUser,
  onResetView,
  isLocating,
}: MapControlsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Menu Button - Fixed position */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-300 w-10 h-10 flex items-center justify-center"
        style={{
          transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        <div className="flex flex-col gap-1">
          <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Dropdown Menu - Fixed position */}
      <div 
        className={`fixed top-4 right-4 z-10 bg-black/70 rounded-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          marginTop: '3.5rem', // Space for the menu button
          minWidth: '200px'
        }}
      >
        <div className="p-4">
          {/* Projection Toggle Switch */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm mr-4">Globe View</span>
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
                    className={`text-white text-sm px-2 py-1 rounded transition-all duration-300 ${
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

      {/* Location and Reset View Controls */}
      <div className="fixed bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={onResetView}
          className="bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all duration-300 w-10 h-10 flex items-center justify-center"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={onLocateUser}
          className={`rounded-lg transition-all duration-300 w-10 h-10 flex items-center justify-center ${
            isLocating 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-black/70 hover:bg-black/90"
          }`}
          title="Locate Me"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm0-8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </>
  );
}