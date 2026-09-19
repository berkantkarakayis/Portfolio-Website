const major = (ua, re) => {
  const match = ua.match(re);
  return match ? match[1].split(".")[0] : "";
};

/** Small, dependency-free user-agent classifier. Prefers Client Hints. */
export const parseUserAgent = (nav = navigator) => {
  const ua = nav.userAgent ?? "";
  const hints = nav.userAgentData;

  const isTablet =
    /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (/Macintosh/.test(ua) && (nav.maxTouchPoints ?? 0) > 1); // iPadOS desktop UA
  const isMobile =
    hints?.mobile === true || /Mobi|iPhone|iPod|Windows Phone/i.test(ua);
  const dev = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let os = hints?.platform || "Other";
  if (!hints?.platform) {
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Mac OS X/i.test(ua)) os = "macOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/CrOS/i.test(ua)) os = "ChromeOS";
    else if (/Linux/i.test(ua)) os = "Linux";
  } else if (os === "macOS" && isTablet) {
    os = "iPadOS";
  }

  let br = "Other";
  let brv = "";
  const brands = hints?.brands?.map((b) => b.brand) ?? [];
  const pick = (name) => brands.find((b) => b.includes(name));
  if (pick("Microsoft Edge")) br = "Edge";
  else if (pick("Opera")) br = "Opera";
  else if (pick("Samsung")) br = "Samsung Internet";
  else if (pick("Brave")) br = "Brave";
  else if (pick("Google Chrome")) br = "Chrome";
  else if (pick("Chromium")) br = "Chromium";

  if (br === "Other") {
    if (/Edg\//.test(ua)) br = "Edge";
    else if (/OPR\/|Opera/.test(ua)) br = "Opera";
    else if (/SamsungBrowser/.test(ua)) br = "Samsung Internet";
    else if (/Firefox|FxiOS/.test(ua)) br = "Firefox";
    else if (/CriOS/.test(ua)) br = "Chrome";
    else if (/Chrome\//.test(ua)) br = "Chrome";
    else if (/Safari\//.test(ua) && /Version\//.test(ua)) br = "Safari";
  }

  const version = hints?.brands?.find((b) => b.brand.includes(br))?.version;
  brv =
    version ||
    major(ua, /(?:Edg|OPR|SamsungBrowser|Firefox|FxiOS|CriOS|Chrome|Version)\/(\d+[\d.]*)/) ||
    "";

  return { os, br, brv, dev };
};
