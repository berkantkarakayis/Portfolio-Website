"use client";

import React from "react";
import { m, useReducedMotion } from "framer-motion";

const EASE = [0.3, 0, 0.3, 1];

export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.2,
  as = "div",
  ...rest
}) => {
  const reduce = useReducedMotion();
  const Comp = m[as] ?? m.div;

  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const StaggerGroup = ({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  as = "div",
  ...rest
}) => {
  const reduce = useReducedMotion();
  const Comp = m[as] ?? m.div;

  return (
    <Comp
      className={className}
      variants={reduce ? undefined : staggerContainer(stagger, delay)}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -40px 0px" }}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export const StaggerItem = ({ children, className, as = "div", ...rest }) => {
  const Comp = m[as] ?? m.div;
  return (
    <Comp className={className} variants={staggerItem} {...rest}>
      {children}
    </Comp>
  );
};
