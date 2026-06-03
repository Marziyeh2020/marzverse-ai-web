import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Marzverse | AI & Digital Futures",
  description: "A world-class cinematic digital experience. We design enterprise-grade intelligence architectures, immersive interfaces, and luxury brand ecosystems.",
  keywords: ["AI", "Automation", "Immersive Experiences", "Luxury Tech", "Marzverse"],
  authors: [{ name: "Marzverse" }],
  openGraph: {
    title: "Marzverse",
    description: "Built for the next generation of digital experiences.",
    url: "https://marzverse.com",
    siteName: "Marzverse",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background-start overflow-x-hidden`}>
        <div className="noise-overlay"></div>
        <div className="cinematic-bg"></div>
        {children}
      </body>
    </html>
  );
}
