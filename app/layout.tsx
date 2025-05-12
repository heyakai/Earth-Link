import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ChakraProviderWrapper } from '@/components/ui/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Earth Link',
  description: 'Discover peers around the globe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ChakraProviderWrapper>
          {children}
        </ChakraProviderWrapper>
      </body>
    </html>
  )
} 