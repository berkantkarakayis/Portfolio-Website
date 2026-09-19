import { site } from "@/Data";

const en = site.url;
const tr = `${site.url}/tr`;
const languages = { en, tr, "x-default": en };

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: en, lastModified, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: tr, lastModified, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}
