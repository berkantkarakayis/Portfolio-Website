import "./globals.css";
import { Caveat, Jost } from "next/font/google";
import { site } from "../Data";

// Self-hosted at build time: no render-blocking request to fonts.googleapis.com.
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jost",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-caveat",
});

const description =
  "Berkant Karakayış is a full-stack developer in Istanbul with 4+ years of experience. React, TypeScript, Next.js and Node.js specialist building real-time web platforms, high-traffic product frontends, WebSocket systems, HTML5 Canvas engines and native iOS apps.";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Berkant Karakayış | Full-Stack Developer",
    template: "%s | Berkant Karakayış",
  },
  description,
  applicationName: "Berkant Karakayış Portfolio",
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Berkant Karakayış",
    "Full-Stack Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Node.js",
    "WebSocket",
    "Real-time systems",
    "WebSocket developer",
    "React Native developer",
    "HTML5 Canvas game engine",
    "Istanbul",
    "Remote developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "Berkant Karakayış",
    title: "Berkant Karakayış | Full-Stack Developer",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkant Karakayış | Full-Stack Developer",
    description,
    creator: "@berkantkrkyss",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ebe3" },
    { media: "(prefers-color-scheme: dark)", color: "#222831" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  givenName: site.firstName,
  familyName: site.lastName,
  jobTitle: site.role,
  description,
  url: site.url,
  email: `mailto:${site.email}`,
  image: `${site.url}/assets/profile-img.webp`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
  worksFor: { "@type": "Organization", name: "Pixupplay" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Namık Kemal University" },
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Fastify",
    "WebSocket",
    "Redis",
    "Kafka",
    "HTML5 Canvas",
    "React Native",
    "Swift",
  ],
  sameAs: site.socials.map((s) => s.url),
};

// Applies the stored theme before first paint to avoid a flash.
const themeScript = `(function(){var d=document.documentElement;var c='light-theme';try{var t=localStorage.getItem('theme');if(t==='dark-theme'||t==='light-theme')c=t;}catch(e){}d.classList.remove('light-theme','dark-theme');d.classList.add(c);})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`light-theme ${jost.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
