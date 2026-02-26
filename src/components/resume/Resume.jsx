import React from "react";
import { cv } from "../../Data";
import Card from "./Card";
import "./resume.css";
import shapeOne from "../../assets/shape-1.png";

const Resume = () => {
  const educationItems = cv.filter((item) => item.category === "education");
  const experienceItems = cv.filter((item) => item.category === "experience");

  return (
    <section className="resume section" id="resume">
      <h2 className="section__title text-cs">Resume</h2>
      <p className="section__subtitle">
        My <span>Story</span>
      </p>

      <div className="resume__container container grid">
        <div className="resume__group">
          <h3 className="resume__heading">Education</h3>

          <div className="resume__items">
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

        <div className="resume__group">
          <h3 className="resume__heading">Experience</h3>

          <div className="resume__items">
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

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Resume</span>
      </div>
    </section>
  );
};

export default Resume
