'use client'

import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

interface CardProps {
  title: string
  description: string
}

export function Card({ title, description }: CardProps) {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={4}
      shadow="md"
      bg="white"
      color="black"
    >
      <Heading size="md" mb={2}>{title}</Heading>
      <Text>{description}</Text>
    </Box>
  )
} 