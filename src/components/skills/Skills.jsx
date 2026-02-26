import React from "react";
import {
  SiAdobephotoshop,
  SiAndroid,
  SiArduino,
  SiBootstrap,
  SiCss3,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJquery,
  SiMui,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNpm,
  SiReact,
  SiSass,
  SiTypescript,
  SiVite,
  SiWordpress,
  SiNextdotjs,
  SiXcode,
  SiRedux,
  SiRedis,
} from "react-icons/si";
import { skills } from "../../Data";
import shapeOne from "../../assets/shape-1.png";
import LogoLoop from "./LogoLoop";
import "./skills.css";
import { TbBrandCSharp } from "react-icons/tb";

const Skills = () => {
  const techLogos = [
    // Frontend tech
    {
      node: <SiHtml5 />,
      title: "HTML5",
      href: "https://developer.mozilla.org/docs/Web/HTML",
    },
    {
      node: <SiCss3 />,
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
    // Other / tools
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
      node: <SiAdobephotoshop />,
      title: "Photoshop",
      href: "https://www.adobe.com/products/photoshop.html",
    },
  ];

  return (
    <section className="skills section relative" id="skills">
      <h2 className="section__title text-cs">Professional Skills</h2>
      <p className="section__subtitle">
        My <span>Talent</span>
      </p>

      <div className="skills__logo-strip" aria-label="Technology stacks">
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

      <div className="skills__container container grid gap-12 lg:gap-10">
        {[...skills]
          .sort((a, b) => {
            const order = { frontend: 0, backend: 1, tools: 2 };
            const categoryDelta =
              (order[a.category] ?? 99) - (order[b.category] ?? 99);
            if (categoryDelta !== 0) return categoryDelta;
            return a.id - b.id;
          })
          .map(({ id, name, description }) => (
            <div className="skills__item flex flex-col" key={id}>
              <div className="skills__titles flex items-center justify-between">
                <h3 className="skills__name text-left">{name}</h3>
              </div>

              <p className="skills_description text-sm md:text-base leading-relaxed">
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
