'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@chakra-ui/react'
import { Toaster } from "@/components/ui/toaster"

const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function Home() {
  return (
    <Box minH="100vh">
      <Toaster />
      <Map />
    </Box>
  )
} 