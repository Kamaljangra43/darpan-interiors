import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.darpaninteriors.com"),
  title: {
    default: "Darpan Interiors - Professional Interior Design Services",
    template: "%s | Darpan Interiors",
  },
  description:
    "Darpan Interiors offers premium interior design and renovation services. Transform your residential and commercial spaces with expert craftsmanship, innovative design solutions, and personalized attention. Contact us at +91 9535890510.",
  keywords: [
    "Darpan Interiors",
    "interior design",
    "home renovation",
    "office interior design",
    "interior designer",
    "residential interior",
    "commercial interior",
    "space transformation",
    "interior design services",
    "professional interior designer",
  ],
  authors: [{ name: "Darpan Interiors" }],
  creator: "Darpan Interiors",
  publisher: "Darpan Interiors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Darpan Interiors - Professional Interior Design Services",
    description:
      "Transform your spaces with Darpan Interiors. Expert interior design and renovation services for homes and offices.",
    url: "https://www.darpaninteriors.com",
    siteName: "Darpan Interiors",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darpan Interiors - Professional Interior Design Services",
    description:
      "Transform your spaces with Darpan Interiors. Expert interior design and renovation services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here once you get it
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Cloudinary Resource Hints */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <style>{`
/* Critical above-the-fold styles */
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-playfair: ${playfair.style.fontFamily};
}
body {
  margin: 0;
  overflow-x: hidden;
}
/* Hero section critical styles */
.hero-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
        `}</style>
      </head>
      <body className={playfair.variable}>
        {children}
      </body>
    </html>
  );
}
