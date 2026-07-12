import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joshua & Michelle — Wedding Invitation",
  description: "Join Joshua and Michelle for their garden wedding at Takun Retreat Club on 19 June 2027.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Joshua & Michelle — 19 · 06 · 2027",
    description: "Join us for our garden wedding at Takun Retreat Club.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Joshua and Michelle wedding invitation" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
