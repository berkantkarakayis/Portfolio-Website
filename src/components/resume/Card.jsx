import React, { useState } from "react";

const Card = ({ title, subtitle, date, description, defaultOpen = false }) => {
  const [showInfo, setShadowInfo] = useState(defaultOpen);

  return (
    <div className="resume__item">
      <div className="resume__header" onClick={() => setShadowInfo(!showInfo)}>
        <h3 className="resume__subtitle">{title}</h3>
        <span className="resume__icon">{showInfo ? "-" : "+"}</span>
      </div>

      <div className={`${showInfo ? "show-content" : ""} resume__content`}>
        <div className="resume__date-title">
          <h3 className="resume__title">{subtitle}</h3>
          <span className="resume__date text-cs">{date}</span>
        </div>

        <p className="resume__description">{description}</p>
      </div>
    </div>
  );
};

export default Card
