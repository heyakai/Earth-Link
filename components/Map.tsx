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
  created_at?: string
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  
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
            <a href="${marker.website}" target="_blank" rel="noopener noreferrer" 
               style="color: white;">Visit Website</a>
          `))
          .addTo(map.current!)
      })
    } catch (error) {
      console.error('Failed to load markers:', error)
    }
  }

  const addNewMarker = async (lngLat: mapboxgl.LngLat, website: string) => {
    try {
      const response = await fetch('/api/markers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
          website,
        }),
      })

      if (!response.ok) throw new Error('Failed to add marker')
      
      const newMarker = new mapboxgl.Marker()
        .setLngLat([lngLat.lng, lngLat.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <a href="${website}" target="_blank" rel="noopener noreferrer" 
             style="color: white;">Visit Website</a>
        `))
        .addTo(map.current!)

      setMarkers(prev => [...prev, { longitude: lngLat.lng, latitude: lngLat.lat, website }])
    } catch (error) {
      console.error('Failed to add marker:', error)
    }
  }
  
  useEffect(() => {
    if (!mapContainer.current) return
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [0, 0],
      zoom: 1.5
    })

    map.current.on('click', (e) => {
      const website = prompt('Enter your website URL:')
      if (website) {
        addNewMarker(e.lngLat, website)
      }
    })

    loadMarkers()

    return () => map.current?.remove()
  }, [])

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
} 