'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@chakra-ui/react'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function Home() {
  return (
    <Box minH="100vh">
      <Map />
    </Box>
  )
} 