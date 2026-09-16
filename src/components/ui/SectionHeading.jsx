"use client";

import React from "react";
import { Reveal } from "./Reveal";

export const SectionHeading = ({ title, kicker, accent, id }) => (
  <Reveal y={20}>
    <h2 className="section__title text-cs" id={id}>
      {title}
    </h2>
    <p className="section__subtitle">
      {kicker} <span>{accent}</span>
    </p>
  </Reveal>
);
