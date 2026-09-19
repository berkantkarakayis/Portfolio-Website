import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="grid min-h-[100svh] place-items-center px-5">
      <div className="glass w-full max-w-md rounded-[24px] p-8 text-center">
        <p className="font-accent text-6xl text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold text-title">{t("title")}</h1>
        <p className="mt-3 text-sm text-text">{t("text")}</p>
        <Link href="/" className="btn btn--primary text-cs mt-8 inline-flex items-center justify-center">
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
