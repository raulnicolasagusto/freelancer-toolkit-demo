import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { THEME_COLORS } from "@/lib/theme-colors";

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
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${THEME_COLORS.main.bodyBackground} ${THEME_COLORS.main.bodyBackgroundDark}`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className={`flex-1 overflow-auto ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}`}>
            <div className="p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
