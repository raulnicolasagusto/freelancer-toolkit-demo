import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { THEME_COLORS } from "@/lib/theme-colors";
import { ClerkProvider } from '@clerk/nextjs';
import { ConditionalLayout } from "@/components/ConditionalLayout";
import UserSync from "@/components/UserSync";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevToolkit - Dashboard Premium para Desarrolladores",
  description: "Dashboard premium para programadores freelancer y juniors con gestión de snippets, notas, productividad y recursos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${THEME_COLORS.main.bodyBackground} ${THEME_COLORS.main.bodyBackgroundDark}`}
        >
          <UserSync />
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
