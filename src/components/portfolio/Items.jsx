"use client";

import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const shapeTwo = "/assets/shape-2.webp";

const Items = ({ projectItems }) => {
  return (
    <>
      {projectItems.map((projectItems) => {
        const { id, img, category, title, description } = projectItems;
        return (
          <motion.div
            layout
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0.8, scale: 0.6 }}
            exit={{ opacity: 0.8, scale: 0.6 }}
            transition={{ duration: 0.5 }}
            className="group relative z-10 overflow-hidden rounded-[20px] border border-white/20 bg-white/10 p-[30px] text-left shadow-2xl backdrop-blur"
            key={id}
          >
            <div className="overflow-hidden rounded-[18px]">
              <img
                src={img}
                alt=""
                className="h-60 w-full object-cover align-middle transition-transform duration-500 ease-in-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            </div>

            <span className="text-cs text-sm my-6 inline-flex items-center font-bold tracking-[0.2em] text-primary">
              {category}
            </span>
            <h3 className="text-[var(--h4-font-size)] font-semibold">
              {title}
            </h3>
            <p className="text-text mt-6 min-h-[125px]">{description}</p>

            <a
              href={projectItems.projectLink}
              className="group/link mt-6 inline-flex items-center gap-4 rounded-full border border-white/35 bg-white/10 px-6 py-3 font-bold text-title shadow-soft backdrop-blur transition hover:border-white/50 hover:bg-white/20"
            >
              See Demo
              <FaArrowRight className="text-primary transition-transform duration-300 group-hover/link:translate-x-1"></FaArrowRight>
            </a>

            <img
              src={shapeTwo}
              alt=""
              className="shape absolute -right-6 -bottom-6 h-[141px] w-[141px]"
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default Items;
