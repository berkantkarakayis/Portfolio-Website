"use client";

import React, { useState } from "react";
import List from "./List";
import Items from "./Items";
import { projects } from "../../Data";
import { AnimatePresence } from "framer-motion";

const shapeOne = "/assets/shape-1.webp";

const allNavList = [
  "all",
  ...new Set(projects.map((project) => project.category)),
];

const Portfolio = () => {
  const [projectItems, setMenuItems] = useState(
    projects.filter((item) => item.category === "CSS/JS"),
  );
  const [navList, setCategories] = useState(allNavList);

  const filterItems = (category) => {
    if (category === "all") {
      setMenuItems(projects);
      return;
    }

    const newProjectItems = projects.filter(
      (item) => item.category === category,
    );

    setMenuItems(newProjectItems);
  };

  return (
    <section className="section bg-first" id="work">
      <h2 className="section__title text-cs">Portfolio</h2>
      <p className="section__subtitle">
        My <span>Cases</span>
      </p>

      <List List={navList} filterItems={filterItems} />

      <div className="container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          <Items projectItems={projectItems} />
        </AnimatePresence>
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Portfolio</span>
      </div>
    </section>
  );
};

export default Portfolio;
