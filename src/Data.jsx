/* ------------------------------------------------------------------ */
/*  Site-wide config                                                   */
/* ------------------------------------------------------------------ */

export const site = {
  name: "Berkant Karakayış",
  firstName: "Berkant",
  lastName: "Karakayış",
  role: "Full-Stack Developer",
  tagline:
    "Istanbul-based full-stack developer. I design and ship fast, real-time web and mobile products end to end \u2014 from React and Next.js interfaces and Node.js services to WebSocket systems, custom rendering engines and native iOS apps.",
  email: "berkantkarakayiss@gmail.com",
  location: "Istanbul, Türkiye",
  url: "https://berkant.vercel.app",
  resume: "/assets/Resume/resume.pdf",
  company: { name: "Pixupplay", url: "https://github.com/pixupplay" },
  availability: "Open to freelance & remote roles",
  socials: [
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/berkantkarakayis",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/berkant-karakayis/",
    },
    { id: "x", name: "X (Twitter)", url: "https://twitter.com/berkantkrkyss" },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/berkantkrkys/",
    },
  ],
};

export const links = [
  { name: "Home", path: "home" },
  { name: "Skills", path: "skills" },
  { name: "Work", path: "work" },
  { name: "Resume", path: "resume" },
  { name: "Systems", path: "systems" },
  { name: "Work With Me", path: "services" },
  { name: "Contact", path: "contact" },
];

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export const heroRoles = [
  "Full-Stack Developer",
  "Real-Time Systems Engineer",
  "Game Engine Developer",
  "React & Node.js Specialist",
];

export const heroStats = [
  {
    id: "years",
    value: 4,
    suffix: "+",
    label: "Years of",
    accent: "Experience",
  },
  {
    id: "projects",
    value: 30,
    suffix: "+",
    label: "Products",
    accent: "Shipped",
  },
];

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */

export const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "monitor",
    span: "wide",
    blurb:
      "Config-driven, multi-brand React interfaces with token-based theming, role-based access and performance-safe animation under live data.",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "framer-motion",
      "i18next",
      "Material UI",
      "Vite",
      "Webpack",
    ],
  },
  {
    id: "backend",
    title: "Backend & Real-time",
    icon: "server",
    span: "wide",
    blurb:
      "Server-authoritative game servers, WebSocket fan-out with Redis pub/sub, idempotent settlement and gateway-fronted microservices.",
    items: [
      "Node.js",
      "Fastify",
      "Express",
      "WebSocket",
      "socket.io",
      "Redis Pub/Sub",
      "gRPC",
      "REST / OpenAPI",
      "JWT · OAuth 2.0 · 2FA",
      "Strapi CMS",
    ],
  },
  {
    id: "games",
    title: "Games & Graphics",
    icon: "gamepad",
    blurb:
      "Shared HTML5 Canvas engine powering 70+ production casino games, provably fair RNG and tunable RTP math.",
    items: [
      "HTML5 Canvas",
      "Three.js / WebGL",
      "Lottie",
      "Provably-Fair RNG",
      "RTP / Game Math",
    ],
  },
  {
    id: "data",
    title: "Data & Messaging",
    icon: "database",
    blurb:
      "Event-driven services and analytics pipelines behind a multi-brand casino platform.",
    items: ["MongoDB", "Redis", "ClickHouse", "Kafka", "RabbitMQ"],
  },
  {
    id: "mobile",
    title: "Mobile",
    icon: "smartphone",
    blurb:
      "Cross-platform apps shipped to the stores with Expo, plus native iOS and macOS work in Swift.",
    items: [
      "React Native (Expo)",
      "Expo Router",
      "Reanimated",
      "Swift / SwiftUI",
    ],
  },
  {
    id: "devops",
    title: "DevOps & Quality",
    icon: "container",
    span: "full",
    blurb:
      "Containerised Node.js deployments behind nginx with CI/CD, API docs and component tests.",
    items: [
      "Docker",
      "nginx",
      "PM2",
      "GitHub Actions",
      "Git",
      "Swagger",
      "node:test",
      "React Testing Library",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Resume                                                             */
/* ------------------------------------------------------------------ */

export const experience = [
  {
    id: "pixupplay",
    role: "Full-Stack Developer",
    company: "Pixupplay",
    location: "Malta · Remote",
    start: "2024-12",
    end: null,
    current: true,
    summary:
      "Game engine, multiplayer servers and live sports graphics for a multi-brand iGaming platform.",
    highlights: [
      "Built and maintain the shared HTML5 Canvas engine that 70+ production casino games run on. Rendering, animation, asset loading, sound and UI state are reusable modules, so a new game is mostly configuration.",
      "Implemented provably fair RNG (HMAC-SHA256 with seed and nonce) so players can verify every result, plus configurable RTP math per game.",
      "Own the real-time multiplayer game servers (Node.js + WebSocket): server-authoritative state, reconnect-and-resume for dropped players and idempotent wallet settlement.",
      "Designed LiveTracker, a platform that renders live match graphics on TV broadcasts for 6 sports. Events flow through socket.io with Redis pub/sub across instances and catch up in about a second after a disconnect.",
      "Worked on a microservices casino platform: Fastify API gateway, gRPC between services, Kafka and RabbitMQ events, ClickHouse analytics, JWT / OAuth 2.0 / 2FA login security and Docker deployments.",
      "Built config-driven multi-brand React + TypeScript frontends with role-based access, using Redux Toolkit, TanStack Query, i18next and framer-motion.",
      "Delivered websites and admin panels on a centralised Strapi CMS. Deploy with Docker, nginx and PM2 through GitHub Actions; document APIs with Swagger; test with React Testing Library.",
    ],
    tags: [
      "React",
      "TypeScript",
      "Node.js",
      "Fastify",
      "WebSocket",
      "Redis",
      "Kafka",
      "gRPC",
      "Docker",
    ],
  },
  {
    id: "nevera-fe",
    role: "Front End Developer",
    company: "Nevera Tech",
    location: "Istanbul · Hybrid",
    start: "2024-01",
    end: "2024-12",
    summary:
      "Customer-facing web apps and cross-platform mobile apps for multiple clients.",
    highlights: [
      "Built and maintained responsive, high-performance web applications with React, Next.js, TypeScript and Tailwind CSS, cutting unnecessary HTTP requests and improving client-side rendering efficiency.",
      "Consolidated duplicated UI into a shared set of reusable components and layout patterns, speeding up feature delivery and keeping the experience consistent across products.",
      "Took part in building React Native (Expo) mobile apps for clients across several categories, from concept through to store release.",
    ],
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native"],
  },
  {
    id: "nevera-intern",
    role: "Front End Developer · Part-Time / Intern",
    company: "Nevera Tech",
    location: "Istanbul",
    start: "2021-10",
    end: "2024-01",
    summary: "Production React/TypeScript work alongside my degree.",
    highlights: [
      "Implemented responsive, cross-browser interfaces from design mockups alongside UX/UI teams in production React/TypeScript codebases, growing from UI implementation to owning complete features.",
    ],
    tags: ["React", "TypeScript", "HTML/CSS"],
  },
];

/* ------------------------------------------------------------------ */
/*  Journey milestones (chronological; date is "YYYY", "YYYY-MM")      */
/* ------------------------------------------------------------------ */

export const milestones = [
  {
    id: "degree-start",
    date: "2021-09",
    kind: "education",
    title: "Started Computer Programming",
    detail: "Namık Kemal University, Tekirdağ. Algorithms and software fundamentals alongside real work.",
  },
  {
    id: "nevera-intern",
    date: "2021-10",
    kind: "work",
    title: "First production code at Nevera Tech",
    detail: "Part-time front end developer: responsive React / TypeScript interfaces from design mockups.",
  },
  {
    id: "degree-done",
    date: "2023-06",
    kind: "education",
    title: "Associate's degree completed",
    detail: "Graduated while already shipping features in production codebases.",
  },
  {
    id: "nevera-fulltime",
    date: "2024-01",
    kind: "work",
    title: "Front End Developer, full time",
    detail: "Owned complete features across client web apps; consolidated duplicated UI into a shared component set.",
  },
  {
    id: "mobile-apps",
    date: "2024",
    kind: "ship",
    title: "Mobile apps in the stores",
    detail: "React Native (Expo) apps for several clients, from concept to App Store and Google Play release.",
    projectId: "private-admin",
  },
  {
    id: "pixupplay",
    date: "2024-12",
    kind: "work",
    title: "Full-Stack Developer at Pixupplay",
    detail: "Game engine, multiplayer servers and live sports graphics for a multi-brand iGaming platform.",
  },
  {
    id: "engine",
    date: "2025",
    kind: "ship",
    title: "One engine, 70+ games",
    detail: "Shared HTML5 Canvas engine with provably fair RNG; a new game is mostly configuration.",
    projectId: "fast-games-api",
  },
  {
    id: "livetracker",
    date: "2025",
    kind: "ship",
    title: "Live match graphics on TV",
    detail: "LiveTracker renders live events for six sports over socket.io and Redis pub/sub, catching up in about a second.",
    projectId: "genius-tracker",
  },
  {
    id: "platform",
    date: "2025",
    kind: "ship",
    title: "Multi-brand casino platform",
    detail: "Config-driven React + TypeScript frontends, Fastify gateway, gRPC services, Kafka events, ClickHouse analytics.",
    projectId: "pixup-play",
  },
  {
    id: "native",
    date: "2026",
    kind: "ship",
    title: "Native Swift apps",
    detail: "MyAgentsBar for macOS and Pofu for iOS, built and released independently.",
    projectId: "my-agents-bar",
  },
];

export const education = [
  {
    id: "nku",
    degree: "Associate's Degree, Computer Programming",
    school: "Namık Kemal University",
    location: "Tekirdağ, Türkiye",
    start: "2021",
    end: "2023",
    description:
      "Core programming, algorithms and software development fundamentals.",
  },
];

export const certificates = [
  {
    id: "techcareer",
    name: "Full-Stack Development Bootcamp",
    issuer: "Techcareer.net",
  },
  {
    id: "udemy-web",
    name: "Complete Web Development Bootcamp",
    issuer: "Udemy",
  },
  { id: "cisco", name: "Cyber Security", issuer: "Cisco Networking Academy" },
  { id: "btk", name: "Intro to AI & Algorithms", issuer: "BTK Akademi" },
];

export const languages = [
  { id: "tr", name: "Turkish", level: "Native" },
  { id: "en", name: "English", level: "Upper-Intermediate (B2)" },
];

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

export const projectCategories = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "personal", label: "Personal" },
  { id: "mobile", label: "Mobile & Desktop" },
  { id: "experiments", label: "Experiments" },
];

const gh = (repo) => `https://github.com/berkantkarakayis/${repo}`;
const pages = (repo) => `https://berkantkarakayis.github.io/${repo}/`;

const allProjects = [
  /* ---------- Professional (source private) ---------- */
  {
    id: "fast-games-api",
    title: "Fast Games API",
    category: "professional",
    featured: true,
    nda: true,
    role: "Independently developed",
    description:
      "Casino game API and ecosystem for platform integrations. I built the shared HTML5 Canvas engine and more than 70 production games on top of it, with provably fair RNG and configurable RTP.",
    tags: ["HTML5 Canvas", "TypeScript", "Node.js", "WebSocket", "RNG / RTP"],
    live: "https://fastgamesapi.com/",
    // Add /public/assets/project-fastgamesapi.webp and set img to that path to
    // swap the designed cover for a real screenshot. ProjectCard falls back to
    // the cover automatically if the file is missing.
    img: null,
    cover: {
      variant: "games",
      label: "70+",
      sub: "production games on one shared engine",
      from: "#07141c",
      to: "#0f766e",
    },
  },
  {
    id: "genius-tracker",
    title: "Genius Tracker",
    category: "professional",
    featured: true,
    nda: true,
    role: "Independently developed",
    description:
      "Live match-tracking and visualisation for football, basketball, tennis, volleyball, baseball and ice hockey, built for drop-in iframe integration. Events arrive over socket.io and fan out through Redis pub/sub.",
    tags: ["React", "TypeScript", "socket.io", "Redis", "Tailwind CSS"],
    live: "https://tracker.geniusfeeds.live/",
    img: "/assets/project9.webp",
  },
  {
    id: "match-tracking",
    title: "Match Tracking",
    category: "professional",
    featured: true,
    nda: true,
    role: "Independently developed",
    description:
      "Real-time sports tracking platform for betting and trading users: low-latency match data and alerts for VAR decisions, injuries, extra time and other high-impact events, plus the operator admin panel.",
    tags: ["Next.js", "TypeScript", "WebSocket", "Redux Toolkit", "Strapi"],
    live: "https://matchtracking.com/",
    img: "/assets/project-matchtracking.webp",
  },
  {
    id: "genius-feeds",
    title: "Genius Feeds",
    category: "professional",
    nda: true,
    role: "Independently developed",
    description:
      "Sports data infrastructure for betting operators: live odds feeds, pre-match data, API integrations, risk management, tracker widgets and bet-builder tooling.",
    tags: ["React", "Tailwind CSS", "REST APIs"],
    live: "https://geniusfeeds.com/",
    img: "/assets/project8.webp",
  },
  {
    id: "pixup-play",
    title: "Pixup Play",
    category: "professional",
    nda: true,
    role: "Collaborative · frontend, API integrations, admin panel",
    description:
      "Online platform combining casino, sportsbook and betting exchange with promotions, VIP, affiliate and cryptocurrency payments. Multi-brand, config-driven UI with role-based access.",
    tags: ["React", "TypeScript", "Redux Toolkit", "i18next", "Fastify"],
    live: "https://staging.pixupplay.tech/",
    img: "/assets/project-pixupplay.webp",
  },
  {
    id: "betroxy",
    title: "Betroxy",
    category: "professional",
    nda: true,
    role: "Collaborative · frontend, API integrations, admin panel",
    description:
      "Betting platform bringing casino, sportsbook and exchange modules together, with support for multiple cryptocurrencies and local currencies.",
    tags: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    live: "https://betroxy.com/",
    img: "/assets/project-betroxy.webp",
  },
  {
    id: "betamericano",
    title: "Betamericano",
    category: "professional",
    nda: true,
    role: "Collaborative · frontend, API integrations, admin panel",
    description:
      "Online casino with slots, live casino, crash games, tournaments, missions and VIP features on the same multi-brand codebase.",
    tags: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    live: "https://betamericano.com/",
    img: "/assets/project-betamericano.webp",
  },
  {
    id: "betfabriq",
    title: "Betfabriq Casino Demo",
    category: "professional",
    nda: true,
    role: "Collaborative",
    description:
      "Modern betting and casino platform demo with sports, casino, arcade and VIP areas and switchable visual themes. Fast Games API titles run inside it.",
    tags: ["React", "TypeScript", "Theming"],
    live: "https://demo.betfabriq.com/casino/",
    img: "/assets/project-betfabriq.webp",
  },
  {
    id: "private-admin",
    title: "Operations Admin Panel",
    category: "professional",
    nda: true,
    role: "Team project at Nevera Tech",
    description:
      "Internal admin panel backing a consumer React Native app: dashboards, role management and content configuration for a non-technical operations team.",
    tags: ["React", "TypeScript", "React Native"],
    img: "/assets/project22.webp",
  },

  /* ---------- Personal ---------- */
  {
    id: "live-chess-leaderboard",
    title: "Live Chess GM Leaderboard",
    category: "personal",
    featured: true,
    description:
      "Real-time leaderboard of the world's top grandmasters. A Node/Express server polls the Chess.com API and pushes updates over WebSocket; cards reorder with layout animations, reconnects use exponential backoff.",
    tags: [
      "React 18",
      "TypeScript",
      "Redux Toolkit",
      "WebSocket",
      "framer-motion",
      "Express",
    ],
    live: "https://live-chess-leaderboard.vercel.app",
    github: gh("live-chess-leaderboard"),
    img: "/assets/project-chess.webp",
  },
  {
    id: "threejs-podium",
    title: "Three.js Podium",
    category: "personal",
    description:
      "Interactive 3D podium showcase built with Three.js and Vite: orbit controls, lighting setups and animated transitions between podium states.",
    tags: ["Three.js", "WebGL", "Vite", "JavaScript"],
    live: "https://berkantkarakayis.github.io/threejs-podium/",
    github: gh("threejs-podium"),
    img: "/assets/project-podium.webp",
    cover: {
      variant: "podium",
      label: "3D",
      sub: "WebGL podium built with Three.js",
      from: "#140f38",
      to: "#6d28d9",
    },
  },
  {
    id: "decrypted-text",
    title: "Scroll To Decrypt",
    category: "personal",
    description:
      "Scroll-driven text decryption effect in React with a live config panel for speed, character sets and reveal direction.",
    tags: ["React", "JavaScript", "CSS Animations"],
    live: "https://decrypte-text-project-react.vercel.app",
    github: gh("decrypte-text-project-react"),
    img: "/assets/project-decrypt.webp",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    category: "personal",
    description:
      "React.js App Router site with Tailwind CSS, framer-motion reveals, a Spline 3D hero and a view-transition theme switch.",
    tags: ["React.js", "Tailwind CSS", "framer-motion"],
    live: "https://berkantkarakayis.github.io/PortfolioWebsite2/",
    github: gh("PortfolioWebsite2"),
    img: "/assets/project1.webp",
  },

  /* ---------- Mobile & Desktop ---------- */
  {
    id: "my-agents-bar",
    title: "MyAgentsBar",
    category: "mobile",
    featured: true,
    description:
      "Free macOS menu-bar app that tracks AI token usage across Claude, Copilot, Cursor, Codex and more, live, without leaving your workflow. Native Swift.",
    tags: ["Swift", "SwiftUI", "macOS", "Menu Bar"],
    live: "https://my-agents-bar.vercel.app",
    github: gh("MyAgentsBar"),
    img: "/assets/project-myagentsbar.webp",
  },

  {
    id: "pofu-no-contact",
    title: "Pofu: No Contact",
    category: "mobile",
    description:
      "iOS app that helps people keep a no-contact streak after a breakup. Daily check-ins, an SOS panic button, unsent letters, breathing exercises, a mood journal and an AI companion bear, plus widgets and an anonymous support forum.",
    tags: ["Swift", "SwiftUI", "WidgetKit", "Supabase", "StoreKit 2"],
    img: "/assets/project-pofu.webp",
    cover: {
      variant: "app",
      label: "Pofu",
      sub: "No-contact companion · iOS",
      from: "#4a1d96",
      to: "#db2777",
    },
    status: "App Store · Türkiye",
  },
  {
    id: "manifesta",
    title: "Aldım Verdim: Niyet Olumlama",
    category: "mobile",
    description:
      "Manifestation, affirmation and intention-setting app for women. Token-based SwiftUI design system, fully componentised feature modules, home-screen widgets and a Supabase backend.",
    tags: ["Swift", "SwiftUI", "WidgetKit", "Supabase"],
    live: "https://apps.apple.com/tr/app/ald%C4%B1m-verdim-niyet-olumlama/id6798382626?l=tr",
    img: "/assets/project-manifest.webp",
    cover: {
      variant: "app",
      label: "Aldım Verdim: Niyet Olumlama",
      sub: "Daily intentions · iOS",
      from: "#7c2d12",
      to: "#f59e0b",
    },
    status: "In development",
  },

  /* ---------- Experiments (early front-end work) ---------- */
  {
    id: "ticket-hologram",
    title: "Ticket With Hologram Effect",
    category: "experiments",
    description: "Holographic ticket card driven by pointer position.",
    tags: ["HTML", "CSS", "JavaScript"],
    live: pages("Ticket_With_Hologram_Effect"),
    github: gh("Ticket_With_Hologram_Effect"),
    img: "/assets/project4.webp",
  },
  {
    id: "3d-room",
    title: "3D Room",
    category: "experiments",
    description: "My room rebuilt as an isometric CSS 3D scene.",
    tags: ["CSS 3D", "JavaScript"],
    live: pages("3D_Room"),
    github: gh("3D_Room"),
    img: "/assets/project5.webp",
  },
  {
    id: "particles",
    title: "Particles",
    category: "experiments",
    description: "Canvas particle system that morphs into text.",
    tags: ["Canvas", "JavaScript"],
    live: pages("Particles"),
    github: gh("Particles"),
    img: "/assets/project12.webp",
  },
  {
    id: "voyage-slider",
    title: "Voyage Slider",
    category: "experiments",
    description: "Full-screen image slider with staggered text transitions.",
    tags: ["JavaScript", "CSS"],
    live: pages("Voyage_Slider"),
    github: gh("Voyage_Slider"),
    img: "/assets/project7.webp",
  },
  {
    id: "3d-calculator",
    title: "3D Calculator",
    category: "experiments",
    description: "Working calculator with tactile 3D key presses.",
    tags: ["CSS 3D", "JavaScript"],
    live: pages("Calculator"),
    github: gh("Calculator"),
    img: "/assets/project6.webp",
  },
  {
    id: "expanding-flex-card",
    title: "Expanding Flex Card",
    category: "experiments",
    description: "Flexbox accordion gallery with animated panels.",
    tags: ["CSS", "JavaScript"],
    live: pages("Expanding_Flex_Card"),
    github: gh("Expanding_Flex_Card"),
    img: "/assets/project13.webp",
  },
  {
    id: "simon-game",
    title: "Simon Game",
    category: "experiments",
    description: "Watch, remember, repeat. Classic memory game.",
    tags: ["JavaScript"],
    live: pages("Simon_Game"),
    github: gh("Simon_Game"),
    img: "/assets/project14.webp",
  },
  {
    id: "drum-kit",
    title: "Drum Kit",
    category: "experiments",
    description: "Keyboard-driven drum machine with sample playback.",
    tags: ["JavaScript", "Web Audio"],
    live: pages("Drum_Kit"),
    github: gh("Drum_Kit"),
    img: "/assets/project19.webp",
  },
  {
    id: "arduino-projects",
    title: "Arduino Projects",
    category: "experiments",
    description:
      "Collection of small Arduino builds, from beginner to intermediate.",
    tags: ["Arduino", "C++"],
    github: gh("Arduino-Projects"),
    img: "/assets/project18.webp",
  },
];

/* The archive grid renders in array order and only shows the first 9 before
   "Show more", so lead with a deliberate mix of professional, personal and
   mobile work instead of nine consecutive iGaming projects. Everything not
   listed here keeps its grouped order below. */
const LEAD_ORDER = [
  "fast-games-api",
  "live-chess-leaderboard",
  "my-agents-bar",
  "genius-tracker",
  "threejs-podium",
  "manifesta",
  "match-tracking",
  "pixup-play",
  "decrypted-text",
];

const lead = LEAD_ORDER.map((id) =>
  allProjects.find((p) => p.id === id),
).filter(Boolean);
const leadIds = new Set(lead.map((p) => p.id));

export const projects = [
  ...lead,
  ...allProjects.filter((p) => !leadIds.has(p.id)),
];

/* ------------------------------------------------------------------ */
/*  Work With Me                                                       */
/* ------------------------------------------------------------------ */

export const services = [
  {
    id: "frontend",
    kicker: "Frontend",
    title: "Product interfaces that scale",
    icon: "monitor",
    description:
      "React / Next.js apps with TypeScript, Tailwind and framer-motion. Multi-brand theming, i18n, role-based access and the performance work that keeps them fast.",
    points: [
      "Design-system & component libraries",
      "Config-driven multi-brand UIs",
      "Dashboards & admin panels",
      "Performance & accessibility passes",
    ],
  },
  {
    id: "realtime",
    kicker: "Backend & Real-time",
    title: "Live data, done right",
    icon: "radio",
    popular: true,
    description:
      "Node.js services with Fastify or Express, WebSocket fan-out, Redis pub/sub and idempotent writes. Built for unstable connections and high concurrency.",
    points: [
      "WebSocket / socket.io servers",
      "REST & gRPC APIs with OpenAPI docs",
      "Auth: JWT, OAuth 2.0, 2FA",
      "Docker, nginx, CI/CD deployments",
    ],
  },
  {
    id: "games",
    kicker: "Games & Mobile",
    title: "Engines, games and apps",
    icon: "gamepad",
    description:
      "HTML5 Canvas game engines and casino titles with provably fair RNG, plus React Native (Expo) and native Swift apps from concept to store release.",
    points: [
      "Canvas / WebGL game development",
      "Provably fair RNG & RTP math",
      "React Native (Expo) apps",
      "Native iOS & macOS in Swift",
    ],
  },
];

export const engagementModels = [
  { id: "hourly", label: "Hourly", note: "Bug fixes, audits, small features" },
  {
    id: "project",
    label: "Project-based",
    note: "Defined scope, fixed timeline",
  },
  { id: "retainer", label: "Monthly retainer", note: "Ongoing product work" },
];
