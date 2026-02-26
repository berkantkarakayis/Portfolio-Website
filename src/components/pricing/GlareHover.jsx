import React, { useEffect, useState } from "react";
import "./glare-hover.css";

const GlareHover = ({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  className = "",
}) => {
  const [active, setActive] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!playOnce || !active) return;
    const timer = setTimeout(() => setActive(false), transitionDuration);
    return () => clearTimeout(timer);
  }, [active, playOnce, transitionDuration]);

  const handleEnter = () => {
    if (playOnce && played) return;
    setActive(true);
    if (playOnce) setPlayed(true);
  };

  const handleLeave = () => {
    if (!playOnce) setActive(false);
  };

  return (
    <div
      className={`glare-hover ${active ? "glare-hover--active" : ""} ${className}`.trim()}
      style={{
        "--glare-color": glareColor,
        "--glare-opacity": glareOpacity,
        "--glare-angle": `${glareAngle}deg`,
        "--glare-size": `${glareSize}px`,
        "--glare-duration": `${transitionDuration}ms`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="glare-hover__inner">{children}</div>
    </div>
  );
};

export default GlareHover;
