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
    <div className="absolute z-10 bg-black/90 text-white p-4 rounded-lg shadow-lg w-80">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ×
      </button>
      <h3 className="text-lg font-semibold mb-4">Add Your Site</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Site Name *</label>
          <input
            type="text"
            required
            className="w-full px-2 py-1 bg-gray-800 rounded"
            value={formData.siteName}
            onChange={e => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Site URL *</label>
          <input
            type="url"
            required
            className="w-full px-2 py-1 bg-gray-800 rounded"
            value={formData.website}
            onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Site Description</label>
          <textarea
            className="w-full px-2 py-1 bg-gray-800 rounded"
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
                className="w-full px-2 py-1 bg-gray-800 rounded"
                value={formData.ownerName}
                onChange={e => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Owner Description</label>
              <textarea
                className="w-full px-2 py-1 bg-gray-800 rounded"
                value={formData.ownerDescription}
                onChange={e => setFormData(prev => ({ ...prev, ownerDescription: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Owner Website</label>
              <input
                type="url"
                className="w-full px-2 py-1 bg-gray-800 rounded"
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
  )
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<mapboxgl.LngLat | null>(null)
  
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
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to a simpler style without traffic
      center: [0, 0],
      zoom: 1.5,
      maxPitch: 0, // Disable 3D buildings
      dragRotate: false,
      touchZoomRotate: false
    })

    map.current.on('click', (e) => {
      setSelectedPosition(e.lngLat)
      setShowForm(true)
    })

    loadMarkers()

    return () => map.current?.remove()
  }, [])

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {showForm && selectedPosition && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AddSiteForm
            position={selectedPosition}
            onSubmit={(data) => {
              addNewMarker(selectedPosition, data)
              setShowForm(false)
            }}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  )
} 