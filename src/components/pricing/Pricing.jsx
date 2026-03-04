"use client";

import React from "react";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import GlareHover from "./GlareHover";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";

const Pricing = () => {
  return (
    <section className="section bg-third" id="pricing">
      <h2 className="section__title text-cs">Pricing</h2>
      <p className="section__subtitle">
        My <span>Price Board</span>
      </p>

      <div className="container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        <GlareHover
          className="group relative overflow-hidden rounded-[22px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition duration-300 ease-in-out hover:-translate-y-1 hover:border-white/35"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
        >
          <span className="text-cs block text-title text-xs font-bold tracking-widest uppercase mb-10">
            Hourly Basis
          </span>
          <h3 className="text-2xl leading-none mb-4 text-title">
            22 <span className="text-primary">$</span>{" "}
            <em className="not-italic text-sm ml-4">Hour</em>
          </h3>

          <p className="text-text pb-6 min-h-36">
            Fast, flexible support for full‑stack web tasks. Ideal for bug
            fixes, small features, UI polish, and quick integrations with clean,
            production‑ready code.
          </p>

          <ul className="mb-9">
            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Brand Design</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Web Development</span>
            </li>

            <li className="relative my-1 pl-8">
              <del className="text-gray-500">Advertising</del>
            </li>

            <li className="relative my-1 pl-8">
              <del className="text-gray-500">Photography</del>
            </li>
          </ul>

          <a
            href="mailto:berkantkarakayiss@gmail.com?subject=Hourly Basis Job Offer From Your Website"
            className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
          >
            Start Project
            <FaArrowRight className="ml-1"></FaArrowRight>
          </a>

          <img src={shapeTwo} alt="" className="shape c__shape" />
        </GlareHover>

        <GlareHover
          className="group relative overflow-hidden rounded-[22px] border border-white/30 bg-white/15 p-8 shadow-2xl backdrop-blur transition duration-300 ease-in-out hover:-translate-y-1 hover:border-white/45"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
        >
          <span className="text-cs block text-title text-xs font-bold tracking-widest uppercase mb-10">
            Freelancing
          </span>
          <h3 className="text-2xl leading-none mb-4 text-title">
            875 <span className="text-primary">$</span>{" "}
            <em className="not-italic text-sm ml-4">Week</em>
          </h3>

          <p className="text-text pb-6 min-h-36">
            End‑to‑end delivery for a defined scope. Perfect for building a
            landing page, dashboard, or MVP with both front‑end and back‑end
            handled in one flow.
          </p>

          <ul className="mb-9">
            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Brand Design</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Web Development</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Advertising</span>
            </li>

            <li className="relative my-1 pl-8">
              <del className="text-gray-500">Photography</del>
            </li>
          </ul>

          <a
            href="mailto:berkantkarakayiss@gmail.com?subject=Freelancing Job Offer From Your Website"
            className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
          >
            Start Project
            <FaArrowRight className="ml-1"></FaArrowRight>
          </a>

          <img src={shapeTwo} alt="" className="shape c__shape" />
        </GlareHover>

        <GlareHover
          className="group relative overflow-hidden rounded-[22px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition duration-300 ease-in-out hover:-translate-y-1 hover:border-white/35"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
        >
          <span className="text-cs block text-title text-xs font-bold tracking-widest uppercase mb-10">
            Full Time
          </span>
          <h3 className="text-2xl leading-none mb-4 text-title">
            3500 <span className="text-primary">$</span>{" "}
            <em className="not-italic text-sm ml-4">Month</em>
          </h3>

          <p className="text-text pb-6 min-h-36">
            Full‑time full‑stack development for long‑term product growth.
            Reliable ownership of features, performance, and scalable
            architecture across the entire stack.
          </p>

          <ul className="mb-9">
            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Brand Design</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Web Development</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Advertising</span>
            </li>

            <li className="relative my-1 pl-8">
              <FaCheck className="absolute left-0 top-1.5 text-primary" />
              <span>Photography</span>
            </li>
          </ul>

          <a
            href="mailto:berkantkarakayiss@gmail.com?subject=Full Time Job Offer From Your Website"
            className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
          >
            Start Project
            <FaArrowRight className="ml-1"></FaArrowRight>
          </a>

          <img src={shapeTwo} alt="" className="shape c__shape" />
        </GlareHover>
      </div>

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Pricing</span>
      </div>
    </section>
  );
};

export default Pricing;
