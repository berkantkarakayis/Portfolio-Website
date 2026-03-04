"use client";

import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { links } from "../../Data";
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { Link } from "react-scroll";
import { animateScroll } from "react-scroll";

const shapeOne = "/assets/shape-1.webp";

const getStorageTheme = () => {
  if (typeof window === "undefined") {
    return "light-theme";
  }

  const storedTheme = localStorage.getItem("theme");
  return storedTheme || "light-theme";
};

const Header = ({ introDone, logoRef }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollNav, setScrollNav] = useState(false);
  const [theme, setTheme] = useState("light-theme");
  const [themeReady, setThemeReady] = useState(false);
  const themeToggleRef = useRef(null);

  const scrollTop = () => {
    animateScroll.scrollToTop();
  };

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const toggleTheme = async () => {
    if (!themeToggleRef.current) {
      setTheme(theme === "light-theme" ? "dark-theme" : "light-theme");
      return;
    }

    if (!document.startViewTransition) {
      setTheme(theme === "light-theme" ? "dark-theme" : "light-theme");
      return;
    }

    const { top, left, width, height } =
      themeToggleRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "light-theme" ? "dark-theme" : "light-theme");
      });
    }).ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav, { passive: true });
    return () => window.removeEventListener("scroll", changeNav);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", showMenu);
  }, [showMenu]);

  useEffect(() => {
    setTheme(getStorageTheme());
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme, themeReady]);

  return (
    <header
      className={`${scrollNav ? "scroll-header" : ""}
    header`}
    >
      <nav className="nav">
        <span ref={logoRef} className="nav__logo-wrap">
          <Link
            to="home"
            onClick={scrollTop}
            className={`nav__logo text-cs ${introDone ? "" : "is-hidden"}`}
            href="#home"
          >
            Berkant
          </Link>
        </span>

        <div className={`${showMenu ? "nav__menu show-menu" : "nav__menu"}`}>
          <div className="nav__data">
            <ul className="nav__list">
              {links.map(({ name, path }, index) => {
                return (
                  <li className="nav__item" key={index}>
                    <Link
                      className="nav__link text-cs"
                      to={path}
                      href={`#${path}`}
                      spy={true}
                      hashSpy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="header__socials">
              <a
                href="https://twitter.com/berkantkrkyss"
                className="header__social-link"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="https://www.linkedin.com/in/berkant-karakayis/"
                className="header__social-link"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://github.com/berkantkarakayis"
                className="header__social-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.instagram.com/berkantkrkys/"
                className="header__social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="section__deco deco__left header__deco">
            <img src={shapeOne} alt="" className="shape"></img>
          </div>
        </div>

        <div
          className={`nav__overlay ${showMenu ? "show-overlay" : ""}`}
          onClick={() => setShowMenu(false)}
        />

        <div className="nav__btns">
          <div
            ref={themeToggleRef}
            className="theme__toggler"
            onClick={toggleTheme}
          >
            {themeReady ? (
              theme === "light-theme" ? (
                <BsMoon />
              ) : (
                <BsSun />
              )
            ) : (
              <BsMoon />
            )}
          </div>

          <div
            className={`${
              showMenu ? "nav__toggle animate-toggle" : "nav__toggle"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
