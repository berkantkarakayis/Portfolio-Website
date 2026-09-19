import "../globals.css";
import { Caveat, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/Data";
import { routing } from "@/i18n/routing";
import { TIME_ZONE } from "@/i18n/request";
import { ClientProvider } from "@/i18n/ClientProvider";
import { getContent } from "@/i18n/content";
import { Analytics } from "@/components/analytics/Analytics";

// Self-hosted at build time: no render-blocking request to fonts.googleapis.com.
// latin-ext covers Turkish glyphs (ş, ğ, İ, ı) in both languages.
const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"], // 500 was used once; two fewer font files to download
  display: "swap",
  variable: "--font-jost",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
  variable: "--font-caveat",
});

const localePath = (locale) =>
  locale === routing.defaultLocale ? "/" : `/${locale}`;

const languageAlternates = {
  en: "/",
  tr: "/tr",
  "x-default": "/",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const description = t("description");

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: t("titleTemplate") },
    description,
    applicationName: t("applicationName"),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: t.raw("keywords"),
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      url: localePath(locale),
      siteName: site.name,
      title: t("title"),
      description,
      locale: t("ogLocale"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
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
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ebe3" },
    { media: "(prefers-color-scheme: dark)", color: "#222831" },
  ],
};

const buildJsonLd = ({ description, role }) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  givenName: site.firstName,
  familyName: site.lastName,
  jobTitle: role,
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
});

// Applies the stored theme before first paint to avoid a flash.
const themeScript = `(function(){var d=document.documentElement;var c='dark-theme';try{var t=localStorage.getItem('theme');if(t==='dark-theme'||t==='light-theme')c=t;}catch(e){}d.classList.remove('light-theme','dark-theme');d.classList.add(c);})();`;

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  const content = getContent(messages.data);
  const jsonLd = buildJsonLd({
    description: t("description"),
    role: content.site.role,
  });

  return (
    <html
      lang={locale}
      className={`dark-theme ${jost.variable} ${caveat.variable}`}
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
        <ClientProvider locale={locale} messages={messages} timeZone={TIME_ZONE}>
          {children}
        </ClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
