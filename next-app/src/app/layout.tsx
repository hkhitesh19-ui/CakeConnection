import type { Metadata } from "next";
import "./globals.css";

// Bypass google font fetching in sandboxed environment during build
const geistSans = {
  variable: "--font-geist-sans",
  className: "font-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
  className: "font-mono",
};

import OrganizationSchema from '@/components/schema/OrganizationSchema';

export const metadata: Metadata = {
  metadataBase: new URL('https://cakeconnection.in'),
  title: {
    template: '%s | CakeConnection Vadodara',
    default: 'Online Cake Delivery in Vadodara | Same Day | CakeConnection',
  },
  description: 'Order fresh eggless cakes, flowers & gifts online in Vadodara. Same-day delivery within 3 hours. Birthday, anniversary, designer cakes. 100% fresh guarantee.',
  keywords: ['cake delivery vadodara', 'eggless cake vadodara', 'online cake order vadodara', 'birthday cake vadodara', 'same day cake delivery'],
  authors: [{ name: 'CakeConnection', url: 'https://cakeconnection.in' }],
  creator: 'CakeConnection',
  publisher: 'CakeConnection',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://cakeconnection.in',
    siteName: 'CakeConnection',
    title: 'Online Cake Delivery in Vadodara | CakeConnection',
    description: 'Same-day eggless cake delivery in Vadodara. Fresh cakes, flowers & gifts.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CakeConnection — Online Cake Delivery Vadodara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Cake Delivery in Vadodara | CakeConnection',
    description: 'Same-day eggless cake delivery in Vadodara.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'k1iIk0gWj_4hbe-y6xqfTCU_8wLvJcGDs67kttncJYw',
  },
  alternates: {
    canonical: 'https://cakeconnection.in',
  },
};

import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <OrganizationSchema />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StoreLayoutWrapper>
          {children}
        </StoreLayoutWrapper>
      </body>
    </html>
  );
}
