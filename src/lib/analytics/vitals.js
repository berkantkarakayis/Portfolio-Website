import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

export const startVitals = (state, { markDirty }) => {
  const report = ({ name, value }) => {
    state.eng.vit[name] = name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);
    markDirty();
  };
  onLCP(report);
  onCLS(report);
  onINP(report);
  onFCP(report);
  onTTFB(report);
};
