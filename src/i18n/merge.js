const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Deep-merges `overlay` onto `base`. Objects recurse; arrays and primitives
 * in the overlay replace the base value wholesale.
 */
export const deepMerge = (base, overlay) => {
  if (overlay === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(overlay)) return overlay;
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    out[key] = deepMerge(base[key], value);
  }
  return out;
};
