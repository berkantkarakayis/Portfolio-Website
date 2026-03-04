"use client";

import React from "react";
import { SplineSceneBasic } from "../ui/demo";
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";
const resume = "/assets/Resume/resume.pdf";

const Home = ({ introDone }) => {
  return (
    <section className="relative bg-first pt-20 lg:pt-0 pb-20" id="home">
      <div className="relative pt-4 min-h-screen grid items-center">
        <div className="container relative w-full z-10 flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-0 lg:gap-16">
          <div className="w-full lg:w-1/2 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <p
              className={`text-cs font-bold text-title text-base lg:text-3xl uppercase tracking-wide opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              Hello, <span className="text-primary"> My Name Is</span>
            </p>

            <h1
              className={`text-cs text-title font-bold text-5xl lg:text-8xl drop-shadow-[2px_2px_0_#000] opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.18s" }}
            >
              <span className="text-primary">BERKANT</span>
            </h1>

            <h1
              className={`text-cs text-title font-bold text-5xl lg:text-8xl drop-shadow-[2px_2px_0_#000] opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.26s" }}
            >
              KARAKAYIŞ
            </h1>

            <p
              className={`font-bold text-title opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.34s" }}
            >
              <span className="text-cs text-base lg:text-3xl text-title">
                I Am
              </span>{" "}
              <b className="font-accent text-2xl lg:text-4xl ml-2">
                Full-Stack Developer
              </b>
            </p>

            <p
              className={`text-base sm:text-lg text-text max-w-xl my-10 opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.62s" }}
            >
              Istanbul-based. Building scalable, real-time systems with
              precision and speed. Focused on long-term impact, not short-term
              fixes.
            </p>

            <div
              className={`flex gap-5 mb-8 max-lg:justify-center opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "0.94s" }}
            >
              <a
                href="https://twitter.com/berkantkrkyss"
                className="text-title text-xl transition-colors duration-700 ease-in-out hover:text-primary"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="https://www.linkedin.com/in/berkant-karakayis/"
                className="text-title text-xl transition-colors duration-700 ease-in-out hover:text-primary"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://github.com/berkantkarakayis"
                className="text-title text-xl transition-colors duration-700 ease-in-out hover:text-primary"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.instagram.com/berkantkrkys/"
                className="text-title text-xl transition-colors duration-700 ease-in-out hover:text-primary"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>

            <div
              className={`flex gap-16 max-lg:flex-col max-lg:items-center max-lg:gap-12 max-xl:justify-center opacity-0 translate-y-5 ${
                introDone ? "animate-home-reveal" : ""
              }`}
              style={{ animationDelay: "1.06s" }}
            >
              <a
                href={resume}
                download="Berkant-Karakayış"
                target="_blank"
                className="btn text-cs"
              >
                Download CV
              </a>

              <a
                href="#skills"
                className="hero__link text-cs before:content-[''] before:absolute before:top-1/2 before:-left-16 before:-translate-y-1/2 before:w-12 before:h-0.5 before:bg-border max-lg:before:left-1/2 max-lg:before:top-0 max-lg:before:-translate-x-1/2 max-lg:before:-translate-y-10 max-lg:before:w-0.5 max-lg:before:h-10"
              >
                My Skills
              </a>
            </div>
          </div>

          <div
            className={`relative w-full max-w-2xl lg:w-1/2 max-lg:mb-16 max-lg:mx-auto opacity-0 translate-y-6 scale-105 blur-sm ${
              introDone ? "animate-home-reveal-pop" : ""
            }`}
            style={{ animationDelay: "0.48s" }}
          >
            <div className="bg-primary w-full aspect-square rounded-full relative overflow-hidden z-10">
              <SplineSceneBasic />
            </div>

            <p
              className={`absolute z-10 flex gap-4 items-center border-2 border-solid border-[color:var(--border-color)] bg-container shadow-soft rounded-full px-5 w-60 h-20 left-0 bottom-1/4 max-md:left-0 max-md:-translate-x-0 max-md:bottom-32 max-sm:bottom-24 max-sm:w-52 max-sm:h-16 max-sm:px-4 opacity-0 justify-center ${
                introDone ? "animate-home-reveal-card-left" : ""
              }`}
              style={{ animationDelay: "0.72s" }}
            >
              <span className="text-3xl max-sm:text-2xl font-bold text-title w-auto text-center">
                3 <b className="text-primary">+</b>
              </span>

              <span className="text-xs sm:text-base text-cs w-1/2 text-title font-bold">
                Years of <span className="text-primary">Experience</span>
              </span>
            </p>

            <p
              className={`absolute z-10 flex gap-4 items-center border-2 border-solid border-[color:var(--border-color)] bg-container shadow-soft rounded-full px-5 w-60 h-20 right-6 bottom-16 max-md:right-0 max-md:left-auto max-md:-translate-x-0 max-md:bottom-10 max-sm:bottom-6 max-sm:w-52 max-sm:h-16 max-sm:px-4 opacity-0 justify-center ${
                introDone ? "animate-home-reveal-card-right" : ""
              }`}
              style={{ animationDelay: "0.82s" }}
            >
              <span className="text-3xl max-sm:text-2xl font-bold text-title w-auto text-center">
                99 <b className="text-primary">+</b>
              </span>

              <span className="text-xs sm:text-base text-cs w-1/2 text-title font-bold">
                Completed <span className="text-primary">Projects</span>
              </span>
            </p>

            <img
              src={shapeOne}
              alt=""
              className="shape w-24 h-24 top-4 right-6 max-md:w-16 max-md:h-16"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape w-16 h-16 bottom-10 left-0 max-md:w-12 max-md:h-12"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape w-16 h-16 bottom-2 right-0 max-md:w-12 max-md:h-12"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="section__deco deco__left">
          <img
            src={shapeOne}
            alt=""
            className="shape"
            loading="lazy"
            decoding="async"
          ></img>
        </div>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Developer</span>
      </div>
    </section>
  );
};

export default Home;
