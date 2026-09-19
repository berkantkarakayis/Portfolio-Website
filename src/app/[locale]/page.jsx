import { setRequestLocale } from "next-intl/server";
import PortfolioPage from "@/components/PortfolioPage";

export default async function Page({ params }) {
  const { locale } = await params;
  // Enables static rendering for this locale (Next < 16.3 has no root params).
  setRequestLocale(locale);
  return <PortfolioPage />;
}
