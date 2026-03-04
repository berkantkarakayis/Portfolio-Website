import "./globals.css";

export const metadata = {
  title: "Berkant Karakayis | Portfolio",
  description: "Full-stack developer portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
