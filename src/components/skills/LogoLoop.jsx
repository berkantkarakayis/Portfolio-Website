import React from "react";
import "./logo-loop.css";

const LogoLoop = ({
  logos,
  speed = 80,
  gap = 48,
  logoHeight = 56,
  ariaLabel = "Technology logos",
}) => {
  const duration = Math.max(18, Math.round((logos.length * 140) / speed));

  return (
    <div
      className="logo-loop"
      role="group"
      aria-label={ariaLabel}
      style={{
        "--logo-gap": `${gap}px`,
        "--logo-height": `${logoHeight}px`,
        "--logo-duration": `${duration}s`,
      }}
    >
      <div className="logo-loop__track">
        <div className="logo-loop__list" aria-hidden="true">
          {logos.map((item, index) => (
            <div className="logo-loop__item" key={`logo-a-${index}`}>
              {item.href ? (
                <a
                  className="logo-loop__link"
                  href={item.href}
                  aria-label={item.title}
                  title={item.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="logo-loop__node">{item.node}</span>
                </a>
              ) : (
                <span
                  className="logo-loop__node"
                  aria-label={item.title}
                  title={item.title}
                >
                  {item.node}
                </span>
              )}
              <span className="logo-loop__label">{item.title}</span>
            </div>
          ))}
        </div>
        <div className="logo-loop__list" aria-hidden="true">
          {logos.map((item, index) => (
            <div className="logo-loop__item" key={`logo-b-${index}`}>
              {item.href ? (
                <a
                  className="logo-loop__link"
                  href={item.href}
                  aria-label={item.title}
                  title={item.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="logo-loop__node">{item.node}</span>
                </a>
              ) : (
                <span
                  className="logo-loop__node"
                  aria-label={item.title}
                  title={item.title}
                >
                  {item.node}
                </span>
              )}
              <span className="logo-loop__label">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoLoop;
