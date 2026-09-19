#!/usr/bin/env node
// Reports UI keys present in en.json but missing from tr.json, and Data.jsx
// items (by id) that have no Turkish overlay. Informational, never fails CI.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));
const en = read("messages/en.json");
const tr = read("messages/tr.json");
// Data.jsx contains no JSX, but Node refuses the extension: import a .mjs copy.
const tmp = path.join(mkdtempSync(path.join(tmpdir(), "i18n-check-")), "Data.mjs");
writeFileSync(tmp, readFileSync(path.join(root, "src/Data.jsx"), "utf8"));
const data = await import(pathToFileURL(tmp).href);

const flatten = (obj, prefix = "", out = []) => {
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, full, out);
    else out.push(full);
  }
  return out;
};

const missingUi = flatten(en).filter((key) => {
  const value = key.split(".").reduce((acc, part) => acc?.[part], tr);
  return value === undefined;
});

const overlay = tr.data ?? {};
const collections = [
  "skillGroups",
  "experience",
  "education",
  "certificates",
  "languages",
  "projectCategories",
  "projects",
  "services",
  "engagementModels",
];
const missingData = [];
for (const name of collections) {
  const ids = (data[name] ?? []).map((item) => item.id);
  for (const id of ids) if (!overlay[name]?.[id]) missingData.push(`${name}.${id}`);
}
for (const key of ["site", "heroRoles", "heroStats"]) {
  if (!overlay[key]) missingData.push(key);
}

const report = (title, items) => {
  console.log(`${title}: ${items.length}`);
  for (const item of items) console.log(`  - ${item}`);
};
report("UI keys missing in tr.json", missingUi);
report("Data items without a Turkish overlay", missingData);
