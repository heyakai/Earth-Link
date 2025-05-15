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
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  useDisclosure,
  Menu,
  Portal,
  Dialog,
  Link,
} from '@chakra-ui/react'
import type { ChangeEvent } from 'react'
import { toaster } from "@/components/ui/toaster"

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
  // Adjust position to keep menu within viewport
  const adjustedY = y + 200 > window.innerHeight ? y - 100 : y;
  const adjustedX = x + 200 > window.innerWidth ? x - 150 : x;

  return (
    <Menu.Root open onOpenChange={({ open }) => { if (!open) onClose(); }}>
      <Portal>
        <Menu.Positioner style={{ position: 'absolute', left: adjustedX, top: adjustedY, zIndex: 50 }}>
          <Menu.Content
            textAlign="left"
            bg="gray.900"
            borderColor="gray.700"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="xl"
            // minW="160px"
            py={1}
            px={1}
            style={{ transition: 'opacity 0.15s cubic-bezier(.4,0,.2,1)' }}
            _open={{ opacity: 1, transform: 'scale(1)' }}
            _closed={{ opacity: 0, transform: 'scale(0.95)' }}
          >
            <Menu.Item
              value="add-site"
              onSelect={onAddSite} 
              bg="gray.900"
              _hover={{ bg: 'gray.800' }} 
              px={2} 
              py={1.5} 
              color="white"
              >
              Add Site
            </Menu.Item>
            <Menu.Item 
              value="cancel" 
              onSelect={onClose} 
              bg="gray.900"
              _hover={{ bg: 'gray.800' }} 
              px={2} 
              py={1.5} 
              color="white">
              Cancel
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
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
    <Box
      position="fixed"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="blackAlpha.500"
      zIndex={50}
    >
      <Box
        bg="blackAlpha.900"
        color="white"
        p={6}
        borderRadius="lg"
        shadow="lg"
        w="96"
        maxH="90vh"
        overflowY="auto"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight="semibold">Add Your Site</Text>
          <Button onClick={onClose} color="gray.400" _hover={{ color: 'white' }}>
            ×
          </Button>
        </Box>
        {error && (
          <Box bg="red.500" opacity={0.2} border="1px" borderColor="red.500" color="red.100" px={4} py={2} borderRadius="md" mb={4}>
            {error}
          </Box>
        )}
        <VStack as="form" onSubmit={handleSubmit} gap={4}>
          <Box>
            <Text as="label" display="block" fontSize="sm" mb={1}>Site Name *</Text>
            <Input
              type="text"
              required
              bg="gray.800"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
            />
          </Box>
          
          <Box>
            <Text as="label" display="block" fontSize="sm" mb={1}>Site URL *</Text>
            <Input
              type="url"
              required
              bg="gray.800"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </Box>

          <Box>
            <Text as="label" display="block" fontSize="sm" mb={1}>Site Description</Text>
            <Textarea
              bg="gray.800"
              value={formData.siteDescription}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            />
          </Box>

          <HStack>
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            />
            <Text fontSize="sm">Stay Anonymous</Text>
          </HStack>

          {!formData.isAnonymous && (
            <>
              <Box>
                <Text as="label" display="block" fontSize="sm" mb={1}>Owner Name</Text>
                <Input
                  type="text"
                  bg="gray.800"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </Box>

              <Box>
                <Text as="label" display="block" fontSize="sm" mb={1}>Owner Description</Text>
                <Textarea
                  bg="gray.800"
                  value={formData.ownerDescription}
                  onChange={(e) => setFormData({ ...formData, ownerDescription: e.target.value })}
                />
              </Box>

              <Box>
                <Text as="label" display="block" fontSize="sm" mb={1}>Owner Website</Text>
                <Input
                  type="url"
                  bg="gray.800"
                  value={formData.ownerWebsite}
                  onChange={(e) => setFormData({ ...formData, ownerWebsite: e.target.value })}
                />
              </Box>
            </>
          )}

          <Button
            type="submit"
            w="full"
            bg="blue.600"
            _hover={{ bg: 'blue.700' }}
            color="white"
          >
            Add Site
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projection, setProjection] = useState<"globe" | "mercator">(mapConfig.defaultProjection);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [selectedPosition, setSelectedPosition] = useState<mapboxgl.LngLat | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [atmosphereStyle, setAtmosphereStyle] = useState<string>("night");
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const rotationAnimationRef = useRef<number | null>(null);
  const { open, onOpen, onClose } = useDisclosure();

  const loadMarkers = async () => {
    try {
      const response = await fetch("/api/markers");
      const data = await response.json();
      setMarkers(data);

      if (!map.current) return;

      // Remove existing source and layer if they exist
      if (map.current.getSource('markers')) {
        map.current.removeLayer('markers-layer');
        map.current.removeSource('markers');
      }

      // Add the source
      map.current.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data.map((marker: Marker) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude]
            },
            properties: marker
          }))
        }
      });

      // Add the circle layer
      map.current.addLayer({
        id: 'markers-layer',
        type: 'circle',
        source: 'markers',
        paint: {
          'circle-radius': 6,
          'circle-color': '#4A90E2',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });

      // Add hover effect
      map.current.on('mouseenter', 'markers-layer', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'markers-layer', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      // Add click handler
      map.current.on('click', 'markers-layer', (e) => {
        if (!e.features?.[0]) return;
        const marker = e.features[0].properties as Marker;
        setSelectedMarker(marker);
        onOpen();
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

      const newMarker = {
        longitude: lngLat.lng,
        latitude: lngLat.lat,
        ...markerData,
      };

      setMarkers((prev) => [...prev, newMarker]);

      // Update the GeoJSON source
      if (map.current && map.current.getSource('markers')) {
        const source = map.current.getSource('markers') as mapboxgl.GeoJSONSource;
        source.setData({
          type: 'FeatureCollection',
          features: [...markers, newMarker].map(marker => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude]
            },
            properties: marker
          }))
        });
      }

    } catch (error) {
      console.error("Failed to add marker:", error);
      throw error;
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

  const handleRotateToggle = () => {
    if (!map.current) return;
    
    const currentZoom = map.current.getZoom();
    const MAX_ZOOM_FOR_SPIN = 6.5; // Maximum zoom level where spin is allowed
    
    if (!isRotating) {
      // Check if zoom level is too high
      if (currentZoom > MAX_ZOOM_FOR_SPIN) {
        toaster.error({
          title: 'Cannot Enable Spin',
          description: 'Please zoom out to use the spin feature',
        });
        return;
      }
      
      // Start rotation
      setIsRotating(true);
      const rotate = () => {
        if (!map.current) return;
        const center = map.current.getCenter();
        center.lng -= 2.5; // Adjust rotation speed here
        map.current.easeTo({
          center: center,
          duration: 1000,
          easing: (n) => n,
        });
        rotationAnimationRef.current = requestAnimationFrame(rotate);
      };
      rotationAnimationRef.current = requestAnimationFrame(rotate);
    } else {
      // Stop rotation immediately
      if (rotationAnimationRef.current) {
        cancelAnimationFrame(rotationAnimationRef.current);
        rotationAnimationRef.current = null;
        // Stop any ongoing easeTo animation
        map.current.stop();
      }
      setIsRotating(false);
    }
  };

  // Add zoom change handler to disable spin when zoomed in too far
  useEffect(() => {
    if (!map.current) return;

    const handleZoom = () => {
      if (!map.current) return;
      const currentZoom = map.current.getZoom();
      const MAX_ZOOM_FOR_SPIN = 6.5;

      if (isRotating && currentZoom > MAX_ZOOM_FOR_SPIN) {
        // Stop rotation if zoomed in too far
        if (rotationAnimationRef.current) {
          cancelAnimationFrame(rotationAnimationRef.current);
          rotationAnimationRef.current = null;
          map.current.stop();
        }
        setIsRotating(false);
        toaster.info({
          title: 'Spin Disabled',
          description: 'Spin has been disabled due to high zoom level',
        });
      }
    };

    map.current.on('zoom', handleZoom);
    return () => {
      map.current?.off('zoom', handleZoom);
    };
  }, [isRotating]);

  useEffect(() => {
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    try {
      if (!mapboxgl.accessToken) {
        throw new Error("Mapbox token is required");
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapConfig.style,
        center: mapConfig.initialView.center,
        zoom: mapConfig.initialView.zoom,
        projection: mapConfig.defaultProjection,
        maxPitch: mapConfig.initialView.maxPitch,
        dragRotate: mapConfig.initialView.dragRotate,
        touchZoomRotate: mapConfig.initialView.touchZoomRotate,
        attributionControl: mapConfig.initialView.attributionControl,
      });

      // Add geolocate control
      geolocateControlRef.current = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });
      map.current.addControl(geolocateControlRef.current);

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
        loadMarkers();
      });

      // Set up a handler for style.load to ensure the style is fully loaded
      map.current.on("style.load", () => {
        console.log("Map style loaded successfully");
        
        // Add custom atmosphere styling
        if (projection === "globe") {
          const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
          const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
          map.current?.setFog(selectedStyle);
        }
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
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  // Handle atmosphere style changes
  useEffect(() => {
    if (!map.current) return;

    const applyFogStyle = () => {
      if (map.current?.isStyleLoaded() && projection === "globe") {
        const styleKey = atmosphereStyle as keyof typeof atmospherePresets;
        const selectedStyle = atmospherePresets[styleKey] || atmospherePresets.night;
        map.current.setFog(selectedStyle);
      }
    };

    // If style is already loaded, apply immediately
    applyFogStyle();

    // Also listen for style.load to ensure it's applied after style changes
    map.current.on("style.load", applyFogStyle);

    return () => {
      map.current?.off("style.load", applyFogStyle);
    };
  }, [atmosphereStyle, projection]);

  // Clean up rotation animation on unmount
  useEffect(() => {
    return () => {
      if (rotationAnimationRef.current) {
        cancelAnimationFrame(rotationAnimationRef.current);
      }
    };
  }, []);

  return (
    <Box position="relative" w="full" h="100vh">
      <Box ref={mapContainer} w="full" h="full" />

      {/* Map Controls */}
      <MapControls
        projection={projection}
        atmosphereStyle={atmosphereStyle}
        onProjectionToggle={toggleProjection}
        onAtmosphereChange={changeAtmosphereStyle}
        onLocateUser={handleLocateUser}
        onResetView={handleResetView}
        isLocating={isLocating}
        isRotating={isRotating}
        onRotateToggle={handleRotateToggle}
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

      {/* Profile Dialog */}
      <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
        <Dialog.Trigger asChild>
          <Box display="none" />
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="container.md" w="full" bg="gray.900" color="white">
              <Dialog.CloseTrigger asChild>
                <Button position="absolute" right="4" top="4" color="gray.400" _hover={{ color: 'white' }}>
                  ×
                </Button>
              </Dialog.CloseTrigger>
              {selectedMarker && (
                <Box p="6">
                  <Text fontSize="2xl" fontWeight="bold" mb="4">{selectedMarker.siteName}</Text>
                  <Text mb="4">{selectedMarker.siteDescription || ""}</Text>
                  <Link 
                    href={selectedMarker.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    color="blue.400" 
                    _hover={{ color: 'blue.300' }} 
                    mb="4" 
                    display="block"
                  >
                    Visit Website
                  </Link>
                  {!selectedMarker.isAnonymous && (
                    <Box borderTopWidth="1px" borderColor="gray.700" pt="4" mt="4">
                      <Text fontWeight="semibold">{selectedMarker.ownerName || ""}</Text>
                      <Text fontSize="sm" mb="2">{selectedMarker.ownerDescription || ""}</Text>
                      {selectedMarker.ownerWebsite && (
                        <Link 
                          href={selectedMarker.ownerWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          color="blue.400" 
                          _hover={{ color: 'blue.300' }} 
                          fontSize="sm"
                        >
                          Owner's Website
                        </Link>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

export default Map;
