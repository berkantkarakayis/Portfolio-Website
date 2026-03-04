"use client";

import React from "react";
import { cv } from "../../Data";
import Card from "./Card";

const shapeOne = "/assets/shape-1.webp";

const Resume = () => {
  const educationItems = cv.filter((item) => item.category === "education");
  const experienceItems = cv.filter((item) => item.category === "experience");

  return (
    <section className="section bg-second" id="resume">
      <h2 className="section__title text-cs">Resume</h2>
      <p className="section__subtitle">
        My <span>Story</span>
      </p>

      <div className="container relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-primary text-center text-[length:var(--h4-font-size)] pb-[30px] border-b-2 border-border-color">
            Education
          </h3>

          <div>
            {educationItems.map((val, index) => (
              <Card
                key={val.id}
                title={val.title}
                subtitle={val.subtitle}
                date={val.date}
                description={val.description}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-primary text-center text-[length:var(--h4-font-size)] pb-[30px] border-b-2 border-border-color">
            Experience
          </h3>

          <div>
            {experienceItems.map((val, index) => (
              <Card
                key={val.id}
                title={val.title}
                subtitle={val.subtitle}
                date={val.date}
                description={val.description}
                defaultOpen={index === experienceItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Resume</span>
      </div>
    </section>
  );
};

export default Resume;
