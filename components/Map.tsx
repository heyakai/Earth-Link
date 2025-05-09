'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// You'll need to replace this with your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface Marker {
  id?: number
  longitude: number
  latitude: number
  website: string
  siteName: string
  siteDescription: string
  ownerName: string
  ownerDescription: string
  ownerWebsite: string
  isAnonymous: boolean
  created_at?: string
}

interface ContextMenuProps {
  x: number
  y: number
  onAddSite: () => void
  onClose: () => void
}

function ContextMenu({ x, y, onAddSite, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  position: mapboxgl.LngLat
  onSubmit: (data: Omit<Marker, 'id' | 'created_at' | 'longitude' | 'latitude'>) => void
  onClose: () => void
}

function AddSiteForm({ position, onSubmit, onClose }: AddSiteFormProps) {
  const [formData, setFormData] = useState({
    siteName: '',
    website: '',
    siteDescription: '',
    ownerName: '',
    ownerDescription: '',
    ownerWebsite: '',
    isAnonymous: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-black/90 text-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Your Site</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Site Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.siteName}
              onChange={e => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Site URL *</label>
            <input
              type="url"
              required
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.website}
              onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Site Description</label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800 rounded"
              value={formData.siteDescription}
              onChange={e => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="anonymous"
              className="mr-2"
              checked={formData.isAnonymous}
              onChange={e => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
            />
            <label htmlFor="anonymous" className="text-sm">Stay Anonymous</label>
          </div>
          {!formData.isAnonymous && (
            <>
              <div>
                <label className="block text-sm mb-1">Owner Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerName}
                  onChange={e => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Owner Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerDescription}
                  onChange={e => setFormData(prev => ({ ...prev, ownerDescription: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Owner Website</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  value={formData.ownerWebsite}
                  onChange={e => setFormData(prev => ({ ...prev, ownerWebsite: e.target.value }))}
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
  )
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<mapboxgl.LngLat | null>(null)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  
  const loadMarkers = async () => {
    try {
      const response = await fetch('/api/markers')
      const data = await response.json()
      setMarkers(data)
      
      // Add markers to the map
      data.forEach((marker: Marker) => {
        new mapboxgl.Marker()
          .setLngLat([marker.longitude, marker.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-3">
              <h3 class="font-bold mb-2">${marker.siteName}</h3>
              <p class="mb-2">${marker.siteDescription || ''}</p>
              <a href="${marker.website}" target="_blank" rel="noopener noreferrer" 
                 class="text-blue-400 hover:text-blue-300 block mb-2">Visit Website</a>
              ${!marker.isAnonymous ? `
                <div class="border-t pt-2 mt-2">
                  <p class="font-semibold">${marker.ownerName}</p>
                  <p class="text-sm">${marker.ownerDescription || ''}</p>
                  ${marker.ownerWebsite ? `
                    <a href="${marker.ownerWebsite}" target="_blank" rel="noopener noreferrer" 
                       class="text-blue-400 hover:text-blue-300 text-sm">Owner's Website</a>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `))
          .addTo(map.current!)
      })
    } catch (error) {
      console.error('Failed to load markers:', error)
    }
  }

  const addNewMarker = async (lngLat: mapboxgl.LngLat, markerData: Omit<Marker, 'id' | 'created_at' | 'longitude' | 'latitude'>) => {
    try {
      const response = await fetch('/api/markers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
          ...markerData
        }),
      })

      if (!response.ok) throw new Error('Failed to add marker')
      
      const newMarker = new mapboxgl.Marker()
        .setLngLat([lngLat.lng, lngLat.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-3">
            <h3 class="font-bold mb-2">${markerData.siteName}</h3>
            <p class="mb-2">${markerData.siteDescription || ''}</p>
            <a href="${markerData.website}" target="_blank" rel="noopener noreferrer" 
               class="text-blue-400 hover:text-blue-300 block mb-2">Visit Website</a>
            ${!markerData.isAnonymous ? `
              <div class="border-t pt-2 mt-2">
                <p class="font-semibold">${markerData.ownerName}</p>
                <p class="text-sm">${markerData.ownerDescription || ''}</p>
                ${markerData.ownerWebsite ? `
                  <a href="${markerData.ownerWebsite}" target="_blank" rel="noopener noreferrer" 
                     class="text-blue-400 hover:text-blue-300 text-sm">Owner's Website</a>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `))
        .addTo(map.current!)

      setMarkers(prev => [...prev, { 
        longitude: lngLat.lng, 
        latitude: lngLat.lat, 
        ...markerData 
      } as Marker])
    } catch (error) {
      console.error('Failed to add marker:', error)
    }
  }
  
  useEffect(() => {
    if (!mapContainer.current) return
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 1.5,
      maxPitch: 0,
      dragRotate: false,
      touchZoomRotate: false
    })

    map.current.on('click', (e) => {
      // Close any existing menus
      setShowContextMenu(false)
      setShowForm(false)
      
      // Show context menu at click position
      setContextMenuPos({ x: e.point.x, y: e.point.y })
      setSelectedPosition(e.lngLat)
      setShowContextMenu(true)
    })

    loadMarkers()

    return () => map.current?.remove()
  }, [])

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {showContextMenu && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onAddSite={() => {
            setShowContextMenu(false)
            setShowForm(true)
          }}
          onClose={() => setShowContextMenu(false)}
        />
      )}
      {showForm && selectedPosition && (
        <AddSiteForm
          position={selectedPosition}
          onSubmit={(data) => {
            addNewMarker(selectedPosition, data)
            setShowForm(false)
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
} 