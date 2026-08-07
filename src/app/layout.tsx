import type { Metadata } from "next";
import { Tajawal, Orbitron } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVA MARKET | سوق المنتجات الأوروبية",
  description: "منتجات أوروبية أصلية، مختارة بعناية وتصل إليك جديدة.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  );
}
