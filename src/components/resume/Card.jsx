"use client";

import React, { useState } from "react";

const Card = ({ title, subtitle, date, description, defaultOpen = false }) => {
  const [showInfo, setShadowInfo] = useState(defaultOpen);

  return (
    <div className="relative border-b-2 border-solid border-[color:var(--border-color)] [&:not(:first-child)]:border-r-2">
      <div
        className="cursor-pointer py-8 px-[30px]"
        onClick={() => setShadowInfo(!showInfo)}
      >
        <h3 className="cursor-pointer text-[length:var(--largest-font-size)]">
          {title}
        </h3>
        <span className="absolute z-10 -right-6 -bottom-6 pb-1 w-12 h-12 rounded-full border-2 border-solid border-[color:var(--border-color)] bg-container text-[length:var(--h2-font-size)] shadow-soft flex items-center justify-center leading-[1.3em] transition duration-[1200ms] ease-[var(--transition)]">
          {showInfo ? "-" : "+"}
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out px-[30px] pr-[50px] ${
          showInfo ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-primary font-accent text-[length:var(--h3-font-size)]">
            {subtitle}
          </h3>
          <span className="text-primary text-[length:var(--tiny-font-size)] font-bold">
            {date}
          </span>
        </div>

        <p className="my-5 mb-[30px] text-text">{description}</p>
      </div>
    </div>
  );
};

export default Card;
