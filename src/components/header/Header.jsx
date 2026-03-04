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
  const [activeLink, setActiveLink] = useState(() => {
    if (typeof window === "undefined") return "home";
    const hash = window.location.hash.replace("#", "");
    return hash || "home";
  });

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
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveLink(hash || "home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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
      className={`${
        scrollNav ? "fixed bg-bg-alt" : "absolute"
      } top-0 w-full p-8 z-[130]`}
    >
      <nav
        className={`flex justify-between ${
          scrollNav ? "animate-header-animate" : ""
        }`}
      >
        <span ref={logoRef} className="inline-flex">
          <Link
            to="home"
            onClick={scrollTop}
            className={`text-title text-2xl font-bold cursor-pointer transition-all duration-500 ease-in-out text-cs ${
              introDone ? "" : "opacity-0 pointer-events-none -translate-y-1"
            }`}
            href="#home"
          >
            Berkant
          </Link>
        </span>

        <div className="flex items-center gap-10 z-50">
          <div
            ref={themeToggleRef}
            className="text-2xl flex items-center cursor-pointer"
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
            className={`h-8 w-7 relative z-[140] cursor-pointer ${
              showMenu ? "fixed top-8 right-8" : ""
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <span
              className={`absolute left-0 w-full h-0.5 bg-title transition-all duration-300 ease-in-out ${
                showMenu ? "top-3.5 -rotate-45" : "top-2"
              }`}
            ></span>
            <span
              className={`absolute left-0 w-full h-0.5 bg-title transition-all duration-300 ease-in-out ${
                showMenu ? "bottom-3.5 rotate-45" : "bottom-2"
              }`}
            ></span>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-screen w-0 overflow-hidden bg-bg-alt transition-all duration-1000 ease-in-out z-[120] ${
          showMenu ? "w-full sm:w-96" : ""
        }`}
      >
        <div className="flex flex-col h-full items-center justify-center w-full pt-20 px-8 sm:pr-20 sm:pl-40">
          <ul className="mb-10">
            {links.map(({ name, path }, index) => {
              return (
                <li className="mb-5" key={index}>
                  <Link
                    className={`text-lg font-bold cursor-pointer transition-colors duration-300 ease-in-out text-cs hover:text-primary ${
                      activeLink === path ? "text-primary" : "text-title"
                    }`}
                    to={path}
                    href={`#${path}`}
                    spy={true}
                    hashSpy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    onSetActive={(section) => setActiveLink(section)}
                    onClick={() => {
                      setActiveLink(path);
                      setShowMenu(false);
                    }}
                    activeClass="text-primary"
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex gap-5 mb-8">
            <a
              href="https://twitter.com/berkantkrkyss"
              className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://www.linkedin.com/in/berkant-karakayis/"
              className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://github.com/berkantkarakayis"
              className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.instagram.com/berkantkrkys/"
              className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="section__deco deco__left left-20">
          <img
            src={shapeOne}
            alt=""
            className="shape -top-48 -left-40 -z-10"
          ></img>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/35 sm:bg-black/40 sm:backdrop-blur-[1px] opacity-0 pointer-events-none transition-opacity duration-700 ease-in-out z-[110] ${
          showMenu ? "opacity-100 pointer-events-auto" : ""
        }`}
        onClick={() => setShowMenu(false)}
      />
    </header>
  );
};

export default Header;
