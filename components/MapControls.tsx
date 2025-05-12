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
  Portal
} from '@chakra-ui/react';
import { 
  Menu,
  Switch
} from '@chakra-ui/react';
import { HiMenuAlt3, HiRefresh, HiLocationMarker } from 'react-icons/hi';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Menu Dropdown using Chakra UI */}
      <Box position="fixed" top="4" right="4" zIndex="20">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              // aria-label="Options"
              // colorPalette="gray"
              // variant="surface"
              // bg="gray.800"
              // _active={{ bg: "gray.300" }}
              // _hover={{ bg: "gray.700" }}
              // borderRadius="lg"
              // borderColor="gray.900"
              // minW="10"
              // h="10"
              // p="0"
            >
              <HiMenuAlt3 />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="blackAlpha.700" 
                borderColor="whiteAlpha.300"
                borderWidth="1px"
                borderRadius="md"
                zIndex="dropdown"
                shadow="md"
                overflow="hidden"
                minWidth="200px"
              >
                <Box px="3" py="2">
                  <Flex alignItems="center" justifyContent="space-between" mb="4">
                    <Text color="white" fontSize="sm">Globe View</Text>
                    <Switch.Root 
                      checked={projection === "globe"} 
                      onCheckedChange={onProjectionToggle}
                      colorPalette="blue"
                      size="md"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                    </Switch.Root>
                  </Flex>
                  
                  {projection === "globe" && (
                    <Box>
                      <Text color="white" fontSize="sm" mb="2">Atmosphere Style</Text>
                      
                      {/* Replace Select with Button group */}
                      <Flex flexWrap="wrap" gap="1">
                        {Object.keys(atmospherePresets).map((style) => (
                          <Button
                            key={style}
                            onClick={() => onAtmosphereChange(style)}
                            size="sm"
                            variant={atmosphereStyle === style ? "solid" : "surface"}
                            colorPalette={atmosphereStyle === style ? "blue" : "gray"}
                            color="white"
                            fontSize="xs"
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </Button>
                        ))}
                      </Flex>
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
          aria-label="Reset View"
          onClick={onResetView}
          variant="surface"
          bg="blackAlpha.700"
          borderRadius="lg"
          _hover={{ bg: "blackAlpha.800", transform: "rotate(45deg)" }}
          _active={{ bg: "blackAlpha.900", transform: "rotate(90deg)" }}
        >
          <HiRefresh />
        </IconButton>
        <IconButton
          aria-label="Locate Me"
          onClick={onLocateUser}
          variant="surface"
          bg={isLocating ? "blue.600" : "blackAlpha.700"}
          borderRadius="lg"
          _hover={{ bg: isLocating ? "blue.700" : "blackAlpha.800" }}
          _active={{ bg: isLocating ? "blue.800" : "blackAlpha.900", transform: "scale(0.95)" }}
        >
          <HiLocationMarker />
        </IconButton>
      </VStack>
    </>
  );
}