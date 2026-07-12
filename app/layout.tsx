import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joshua & Michelle — Wedding Invitation",
  description: "Join Joshua and Michelle as they celebrate their wedding on September 27, 2026.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Joshua & Michelle — 27 · 09 · 2026",
    description: "Join us for our wedding celebration in Kuala Lumpur.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Joshua and Michelle wedding invitation" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
