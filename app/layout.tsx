import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SeismicWatch - Underwater Earthquake Tracking",
  description: "Real-time underwater earthquake tracking with interactive 3D globe visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main style={{ paddingTop: '72px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
