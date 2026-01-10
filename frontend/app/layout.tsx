import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

        {/* Preload Critical Hero Image - Match actual render dimensions */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dyrivmkfv/image/upload/f_auto,q_auto:eco,w_1920,h_1080,c_fill/v1/darpan-interiors/hero/s27ferttjmnhawayllcp.jpg"
          imageSrcSet="
            https://res.cloudinary.com/dyrivmkfv/image/upload/f_auto,q_auto:eco,w_640,h_360,c_fill/v1/darpan-interiors/hero/s27ferttjmnhawayllcp.jpg 640w,
            https://res.cloudinary.com/dyrivmkfv/image/upload/f_auto,q_auto:eco,w_1200,h_675,c_fill/v1/darpan-interiors/hero/s27ferttjmnhawayllcp.jpg 1200w,
            https://res.cloudinary.com/dyrivmkfv/image/upload/f_auto,q_auto:eco,w_1920,h_1080,c_fill/v1/darpan-interiors/hero/s27ferttjmnhawayllcp.jpg 1920w
          "
          imageSizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
          fetchPriority="high"
        />

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-playfair: ${playfair.style.fontFamily};
}
        `}</style>
      </head>
      <body className={playfair.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
