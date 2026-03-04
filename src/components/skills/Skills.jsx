"use client";

import React from "react";
import { skills } from "../../Data";
import LogoLoop from "./LogoLoop";
import { TbBrandCSharp } from "react-icons/tb";
import {
  SiAndroid,
  SiArduino,
  SiBootstrap,
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJquery,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiTypescript,
  SiVite,
  SiWordpress,
  SiXcode,
} from "react-icons/si";
import { DiPhotoshop } from "react-icons/di";

const shapeOne = "/assets/shape-1.webp";

const Skills = () => {
  const techLogos = [
    // Frontend tech
    {
      node: <SiHtml5 />,
      title: "HTML5",
      href: "https://developer.mozilla.org/docs/Web/HTML",
    },
    {
      node: <SiCss />,
      title: "CSS3",
      href: "https://developer.mozilla.org/docs/Web/CSS",
    },
    { node: <SiSass />, title: "Sass", href: "https://sass-lang.com" },
    {
      node: <SiJavascript />,
      title: "JavaScript",
      href: "https://javascript.info",
    },
    {
      node: <SiTypescript />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
    {
      node: <SiBootstrap />,
      title: "Bootstrap",
      href: "https://getbootstrap.com",
    },
    { node: <SiMui />, title: "MUI", href: "https://mui.com" },
    { node: <SiJquery />, title: "jQuery", href: "https://jquery.com" },
    {
      node: <SiRedux />,
      title: "Redux Toolkit",
      href: "https://redux-toolkit.js.org",
    },

    // Backend tech
    { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
    { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
    {
      node: <TbBrandCSharp />,
      title: "C#",
      href: "https://learn.microsoft.com/dotnet/csharp",
    },
    { node: <SiMysql />, title: "MySQL", href: "https://www.mysql.com" },
    { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
    // Other tools
    { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
    { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
    { node: <SiNpm />, title: "npm", href: "https://www.npmjs.com" },
    {
      node: <SiXcode />,
      title: "Xcode",
      href: "https://developer.apple.com/xcode/",
    },
    { node: <SiArduino />, title: "Arduino", href: "https://www.arduino.cc" },
    {
      node: <SiWordpress />,
      title: "WordPress",
      href: "https://wordpress.org",
    },
    {
      node: <SiAndroid />,
      title: "Android",
      href: "https://developer.android.com",
    },
    {
      node: <DiPhotoshop />,
      title: "Photoshop",
      href: "https://www.adobe.com/products/photoshop.html",
    },
  ];

  return (
    <section
      className="section relative bg-[image:var(--second-gradient)]"
      id="skills"
    >
      <h2 className="section__title text-cs">Professional Skills</h2>
      <p className="section__subtitle">
        My <span>Talent</span>
      </p>

      <div
        className="relative my-6 mb-12 overflow-hidden text-white"
        aria-label="Technology stacks"
      >
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
        />
      </div>

      <div className="container grid gap-9 md:grid-cols-2 xl:grid-cols-3">
        {[...skills]
          .sort((a, b) => {
            const order = { frontend: 0, backend: 1, tools: 2 };
            const categoryDelta =
              (order[a.category] ?? 99) - (order[b.category] ?? 99);
            if (categoryDelta !== 0) return categoryDelta;
            return a.id - b.id;
          })
          .map(({ id, name, description }) => (
            <div
              className="group relative flex flex-col overflow-hidden rounded-[18px] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-7 pb-9 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-[8px] transition-[transform,box-shadow,border-color] duration-300 ease-in-out before:absolute before:inset-[-1px] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_55%)] before:opacity-40 before:pointer-events-none after:absolute after:-right-[20%] after:-bottom-[30%] after:h-[220px] after:w-[220px] after:bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_70%)] after:opacity-35 after:pointer-events-none after:transition after:duration-300 after:ease-in-out hover:-translate-y-2 hover:border-white/35 hover:shadow-[0_26px_50px_rgba(0,0,0,0.35)] group-hover:after:-translate-y-2.5 group-hover:after:opacity-60"
              key={id}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-left text-primary text-lg font-semibold tracking-[0.2px] md:text-xl">
                  {name}
                </h3>
              </div>

              <p className="text-sm md:text-base leading-relaxed text-text">
                {description}
              </p>
            </div>
          ))}
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Skills</span>
      </div>
    </section>
  );
};

export default Skills;
