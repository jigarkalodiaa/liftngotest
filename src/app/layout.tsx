import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Liftngo - Rides & Food Delivery',
    template: '%s | Liftngo',
  },
  description: 'Book rides in seconds, track in real-time, and get food delivered to your doorstep. Join Liftngo for affordable fares and seamless delivery.',
  keywords: ['ride booking', 'food delivery', 'taxi', 'delivery app', 'Liftngo'],
  authors: [{ name: 'Your Name', url: 'https://yourdomain.com' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Liftngo',
    title: 'Liftngo - Rides & Food Delivery',
    description: 'Book rides in seconds, track in real-time, and get food delivered to your doorstep. Join Liftngo for affordable fares and seamless delivery.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Liftngo - Rides & Food Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liftngo - Rides & Food Delivery',
    description: 'Book rides in seconds, track in real-time, and get food delivered to your doorstep. Join Liftngo for affordable fares and seamless delivery.',
    creator: '@liftngo',
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
  alternates: {
    canonical: 'https://yourdomain.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
