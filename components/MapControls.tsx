"use client";

import React, { useState } from "react";
import { atmospherePresets } from "../config/mapStyles";
import { 
  IconButton, 
  Button, 
  Flex, 
  Text,
  Box,
  VStack,
  Portal,
  Select,
  Spinner
} from '@chakra-ui/react';
import { 
  Menu,
  Switch
} from '@chakra-ui/react';
import { HiMenuAlt3, HiRefresh, HiLocationMarker, HiX } from 'react-icons/hi';
import { createListCollection } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster"

interface MapControlsProps {
  projection: "globe" | "mercator";
  atmosphereStyle: string;
  onProjectionToggle: () => void;
  onAtmosphereChange: (style: string) => void;
  onLocateUser: () => void;
  onResetView: () => void;
  isLocating: boolean;
  isRotating: boolean;
  onRotateToggle: () => void;
}

export default function MapControls({
  projection,
  atmosphereStyle,
  onProjectionToggle,
  onAtmosphereChange,
  onLocateUser,
  onResetView,
  isLocating,
  isRotating,
  onRotateToggle,
}: MapControlsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const atmosphereOptions = createListCollection({
    items: Object.keys(atmospherePresets).map(style => ({
      label: style.charAt(0).toUpperCase() + style.slice(1),
      value: style
    }))
  });

  // Handler for locate user button
  const handleLocateUser = async () => {
    try {
      // Check if Permissions API is available
      if (navigator.permissions) {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        if (status.state === 'granted') {
          toaster.success({
            title: 'Location Access Granted',
            description: 'Successfully accessed your location',
          });
          await onLocateUser();
          return;
        } else if (status.state === 'denied') {
          toaster.error({
            title: 'Location Access Denied',
            description: 'Please allow location access to use this feature',
          });
          return;
        }
        // If 'prompt', show loading toast and trigger permission prompt
        const locationPromise = new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
        toaster.promise(locationPromise, {
          loading: {
            title: 'Requesting Location',
            description: 'Please allow location access in your browser',
          },
          success: {
            title: 'Location Access Granted',
            description: 'Successfully accessed your location',
          },
          error: {
            title: 'Location Access Denied',
            description: 'Please allow location access to use this feature',
          },
        });
        await locationPromise;
        await onLocateUser();
      } else {
        // Fallback for browsers without Permissions API
        const locationPromise = new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
        toaster.promise(locationPromise, {
          loading: {
            title: 'Requesting Location',
            description: 'Please allow location access in your browser',
          },
          success: {
            title: 'Location Access Granted',
            description: 'Successfully accessed your location',
          },
          error: {
            title: 'Location Access Denied',
            description: 'Please allow location access to use this feature',
          },
        });
        await locationPromise;
        await onLocateUser();
      }
    } catch (err) {
      // No need to show another toast, already handled
    }
  };

  return (
    <>
      {/* Menu Dropdown using Chakra UI */}
      <Box position="fixed" top="4" right="4" zIndex="20">
        <Menu.Root
          open={menuOpen}
          onOpenChange={({ open }) => setMenuOpen(open)}
        >
          <Menu.Trigger asChild>
            <Button
              zIndex="1000"
              aria-label="Options"
              colorPalette="gray"
              variant="outline"
              bg="gray.800"
              color="white"
              _hover={{ bg: "gray.700" }}
              _active={{ bg: "gray.700", transform: "scale(0.95)" }}
              borderRadius="lg"
              borderColor="gray.700"
              borderWidth="1px"
              minW="10"
              h="10"
              p="0"
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="gray.950" 
                borderColor="gray.800"
                borderWidth="1px"
                borderRadius="md"
                zIndex="dropdown"
                shadow="md"
                overflow="hidden"
                minWidth="200px"
              >
                <Box px="3" py="2">
                  <Flex alignItems="center" justifyContent="space-between" mb={projection === 'globe' ? 4 : 0}>
                    <Text color="white" fontSize="sm">Globe View</Text>
                    <Switch.Root 
                      checked={projection === "globe"} 
                      onCheckedChange={onProjectionToggle}
                      colorPalette="gray"
                      size="md"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control
                        bg={projection === "globe" ? "gray.100" : "gray.800"}
                        borderColor="gray.700"
                        borderWidth="1px"
                        w="40px"
                        h="22px"
                        borderRadius="full"
                        position="relative"
                        transition="background 0.2s"
                        _checked={{ bg: "gray.100" }}
                      >
                        <Box
                          as="span"
                          w="16px"
                          h="16px"
                          borderRadius="full"
                          bg={projection === "globe" ? "gray.900" : "gray.100"}
                          transition="all 0.2s"
                          position="absolute"
                          left={projection === "globe" ? "20px" : "2px"}
                          top="2px"
                          boxShadow="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        />
                      </Switch.Control>
                    </Switch.Root>
                  </Flex>
                  
                  {projection === "globe" && (
                    <Box>
                      <Text color="white" fontSize="sm" mb="2">Atmosphere Style</Text>
                      <Select.Root 
                        variant="subtle"
                        collection={atmosphereOptions}
                        value={[atmosphereStyle]}
                        onValueChange={(e) => onAtmosphereChange(e.value[0])}
                        size="sm"
                        width="100%"
                        bg="gray.900"
                        borderColor="gray.800"
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ borderColor: 'gray.700' }}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger
                            bg="gray.900"
                            color="white"
                            borderRadius="md"
                          >
                            <Select.ValueText placeholder="Select style" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content
                              zIndex={1200}
                              bg="gray.900"
                              color="white"
                              borderColor="gray.800"
                              borderWidth="1px"
                              borderRadius="md"
                              shadow="lg"
                            >
                              {atmosphereOptions.items.map((option) => (
                                <Select.Item
                                  item={option}
                                  key={option.value}
                                  bg="gray.900"
                                  color="white"
                                  _hover={{ bg: option.value === atmosphereStyle ? 'gray.600' : 'gray.800' }}
                                  _active={{ bg: 'gray.700' }}
                                  _selected={{ bg: 'gray.700', color: 'white' }}
                                >
                                  {option.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Box>
                  )}
                </Box>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>

      {/* Location and Reset View Controls */}
      <VStack position="fixed" bottom="4" right="4" zIndex="20" gap="2">
        <IconButton
          aria-label="Rotate Earth"
          onClick={onRotateToggle}
          variant="outline"
          color="white"
          bg={isRotating ? "blue.600" : "gray.800"}
          borderRadius="lg"
          borderColor={isRotating ? "blue.300" : "gray.700"}
          borderWidth="1px"
          _hover={{ bg: isRotating ? "blue.700" : "gray.700" }}
          _active={{ bg: isRotating ? "blue.800" : "black.900", transform: "scale(0.95)" }}
        >
          <HiRefresh />
        </IconButton>
        <IconButton
          aria-label="Locate Me"
          onClick={handleLocateUser}
          variant="outline"
          color="white"
          bg={isLocating ? "blue.600" : "gray.800"}
          borderRadius="lg"
          borderColor={isLocating ? "blue.300" : "gray.700"}
          borderWidth="1px"
          _hover={{ bg: isLocating ? "blue.700" : "gray.700" }}
          _active={{ bg: isLocating ? "blue.800" : "gray.900", transform: "scale(0.95)" }}
        >
          {isLocating ? <Spinner size="sm" color="blue.200" /> : <HiLocationMarker />}
        </IconButton>
      </VStack>
    </>
  );
}