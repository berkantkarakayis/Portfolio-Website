"use client";

import React from "react";
import { FaCheck, FaArrowRight } from "react-icons/fa";

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
        <div className="group relative rotate-[-1deg] transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none rounded-[22px] border-2 border-border-color bg-bg-color-alt shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="relative overflow-hidden rounded-[22px] p-8">
            <span className="text-cs block text-title text-xs font-bold tracking-widest uppercase mb-10">
              Hourly Basis
            </span>
            <h3 className="text-2xl leading-none mb-4 text-title">
              22 <span className="text-primary">$</span>{" "}
              <em className="not-italic text-sm ml-4">Hour</em>
            </h3>

            <p className="text-text pb-6 min-h-36">
              Fast, flexible support for full‑stack web tasks. Ideal for bug
              fixes, small features, UI polish, and quick integrations with
              clean, production‑ready code.
            </p>

            <ul className="mb-9 space-y-2">
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Brand Design</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Web Development</span>
              </li>

              <li className="flex items-center gap-3 text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40" />
                <del>Advertising</del>
              </li>

              <li className="flex items-center gap-3 text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40" />
                <del>Photography</del>
              </li>
            </ul>

            <a
              href="mailto:berkantkarakayiss@gmail.com?subject=Hourly Basis Job Offer From Your Website"
              className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-x-0.5 hover:-translate-y-0.5 after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
            >
              Start Project
              <FaArrowRight className="ml-1"></FaArrowRight>
            </a>

            <img src={shapeTwo} alt="" className="shape c__shape" />
          </div>
        </div>

        <div className="group relative rotate-[1deg] transition-all duration-300">
          <span className="absolute -top-3 -right-3 z-10 rounded-full border-2 border-white/90 bg-primary text-title text-xs font-bold px-3 py-1 rotate-12">
            Popular!
          </span>
          <div className="absolute inset-0 pointer-events-none rounded-[22px] border-2 border-border-color bg-bg-color-alt  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="relative overflow-hidden rounded-[22px] p-8">
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

            <ul className="mb-9 space-y-2">
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Brand Design</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Web Development</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Advertising</span>
              </li>

              <li className="flex items-center gap-3 text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40" />
                <del>Photography</del>
              </li>
            </ul>

            <a
              href="mailto:berkantkarakayiss@gmail.com?subject=Freelancing Job Offer From Your Website"
              className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-x-0.5 hover:-translate-y-0.5 after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
            >
              Start Project
              <FaArrowRight className="ml-1"></FaArrowRight>
            </a>

            <img src={shapeTwo} alt="" className="shape c__shape" />
          </div>
        </div>

        <div className="group relative rotate-[-2deg] transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none rounded-[22px] border-border-color bg-bg-color-alt shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="relative overflow-hidden rounded-[22px] p-8">
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

            <ul className="mb-9 space-y-2">
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Brand Design</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Web Development</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Advertising</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70">
                  <FaCheck className="text-[10px] text-primary" />
                </span>
                <span>Photography</span>
              </li>
            </ul>

            <a
              href="mailto:berkantkarakayiss@gmail.com?subject=Full Time Job Offer From Your Website"
              className="btn text-cs inline-flex items-center gap-3 relative overflow-hidden transition duration-300 ease-in-out shadow-[4px_4px_0px_0px_rgba(0,0,0,0.55)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-x-0.5 hover:-translate-y-0.5 after:content-[''] after:absolute after:top-[-120%] after:left-[-40%] after:w-1/2 after:h-[320%] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:transition-transform after:duration-300 after:ease-in-out hover:after:translate-x-[220%]"
            >
              Start Project
              <FaArrowRight className="ml-1"></FaArrowRight>
            </a>

            <img src={shapeTwo} alt="" className="shape c__shape" />
          </div>
        </div>
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Pricing</span>
      </div>
    </section>
  );
};

export default Pricing;
