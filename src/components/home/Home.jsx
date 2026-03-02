import React from "react";
import shapeOne from "../../assets/shape-1.webp";
import shapeTwo from "../../assets/shape-2.webp";
import resume from "../../assets/Resume/resume.pdf";

import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import "./home.css";

const Home = ({ introDone }) => {
  return (
    <section
      className={`home ${introDone ? "is-intro-ready" : "is-intro-wait"}`}
      id="home"
    >
      <div className="home__wrapper">
        <div className="home__container container">
          <p className="home__subtitle text-cs home__reveal home__reveal--1">
            Hello, <span> My Name Is</span>
          </p>

          <h1 className="home__title text-cs home__reveal home__reveal--2">
            <span>BERKANT</span>
          </h1>

          <h1 className="home__title text-cs home__reveal home__reveal--3">
            KARAKAYIŞ
          </h1>

          <p className="home__job home__reveal home__reveal--4">
            <span className="text-cs">I Am</span> <b>Full-Stack Developer</b>
          </p>

          <div className="home__img-wrapper home__reveal home__reveal--5 home__reveal--img">
            <div className="home__banner">
              <img
                src="/profile-img-2.webp"
                alt=""
                className="home__profile"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="687"
                height="800"
              />
            </div>

            <p className="home__data home__data-one home__reveal home__reveal--7">
              <span className="text-lg">
                3 <b>+</b>
              </span>

              <span className="text-sm text-cs">
                Years of <span>Experience</span>
              </span>
            </p>

            <p className="home__data home__data-two home__reveal home__reveal--8">
              <span className="text-lg">
                99 <b>+</b>
              </span>

              <span className="text-sm text-cs">
                Completed <span>Projects</span>
              </span>
            </p>

            <img
              src={shapeOne}
              alt=""
              className="shape shape__1"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape shape__2"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape shape__3"
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="home__text home__reveal home__reveal--6">
            Istanbul-based. Building scalable, real-time systems with precision
            and speed. Focused on long-term impact, not short-term fixes.
          </p>

          <div className="home__socials home__reveal home__reveal--9">
            <a
              href="https://twitter.com/berkantkrkyss"
              className="home__social-link"
            >
              <FaTwitter />
            </a>

            <a
              href="https://www.linkedin.com/in/berkant-karakayis/"
              className="home__social-link"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://github.com/berkantkarakayis"
              className="home__social-link"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.instagram.com/berkantkrkys/"
              className="home__social-link"
            >
              <FaInstagram />
            </a>
          </div>

          <div className="home__btns home__reveal home__reveal--10">
            <a
              href={resume}
              download="Berkant-Karakayış"
              target="_blank"
              className="btn text-cs"
            >
              Download CV
            </a>

            <a href="#skills" className="hero__link text-cs">
              My Skills
            </a>
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
