import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ComplianceBanner } from "@/components/layout/ComplianceBanner";
import { ChatbotWidget } from "@/components/support/ChatbotWidget";
import { APP_CONFIG } from "@/config/app.config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${APP_CONFIG.brand.name} | 3D Esports Tournament Platform`,
  description: APP_CONFIG.brand.description,
  keywords: ["Ludo tournaments", "esports", "room code", "gaming platform", "3D ludo", "online tournaments"],
  authors: [{ name: APP_CONFIG.brand.name }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-violet-500/30">
        <ComplianceBanner />
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <ChatbotWidget />
      </body>
    </html>
  );
}
