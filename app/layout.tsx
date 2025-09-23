import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../contexts/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum Crypto Chat",
  description: "Professional quantum key distribution communication platform",
  icons: {
    icon: [
      { url: '/qc-app.png', sizes: '32x32', type: 'image/png' },
      { url: '/qc-app.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/qc-app.png',
    apple: '/qc-app.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/qc-app.png',
    },
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
