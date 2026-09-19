/**
 * Architecture map data. Only structure lives here; every label and
 * description comes from the `systems` message namespace so both languages
 * stay in sync. Coordinates are in the diagram's 640×360 viewBox.
 */
export const SYSTEMS = [
  {
    id: "gaming",
    icon: "gamepad",
    tags: ["Node.js", "Fastify", "WebSocket", "Redis", "Kafka", "gRPC", "HTML5 Canvas", "ClickHouse"],
    nodes: [
      { id: "player", x: 20, y: 150, w: 96, kind: "client" },
      { id: "client", x: 150, y: 150, w: 110, kind: "client" },
      { id: "gateway", x: 300, y: 150, w: 104, kind: "edge" },
      { id: "server", x: 450, y: 60, w: 150, kind: "core" },
      { id: "rng", x: 450, y: 150, w: 150, kind: "core" },
      { id: "wallet", x: 450, y: 240, w: 150, kind: "core" },
      { id: "redis", x: 300, y: 40, w: 104, kind: "store" },
      { id: "events", x: 300, y: 260, w: 104, kind: "store" },
      { id: "analytics", x: 150, y: 260, w: 110, kind: "store" },
    ],
    edges: [
      { from: "player", to: "client", packets: 1 },
      { from: "client", to: "gateway", packets: 2, bidi: true, label: "ws" },
      { from: "gateway", to: "server", packets: 2 },
      { from: "server", to: "rng", packets: 1 },
      { from: "server", to: "wallet", packets: 1 },
      { from: "server", to: "redis", packets: 2, bidi: true },
      { from: "wallet", to: "events", packets: 1 },
      { from: "events", to: "analytics", packets: 1 },
    ],
    decisions: ["authoritative", "idempotent", "resume", "fair"],
  },
  {
    id: "broadcast",
    icon: "radio",
    tags: ["socket.io", "Redis Pub/Sub", "Node.js", "nginx", "React", "TypeScript", "SVG", "Docker"],
    nodes: [
      { id: "feed", x: 20, y: 150, w: 100, kind: "external" },
      { id: "ingest", x: 160, y: 150, w: 104, kind: "core" },
      { id: "pubsub", x: 292, y: 150, w: 96, kind: "store" },
      { id: "socketA", x: 408, y: 70, w: 104, kind: "core" },
      { id: "socketB", x: 408, y: 150, w: 104, kind: "core" },
      { id: "admin", x: 408, y: 260, w: 104, kind: "client" },
      { id: "tv", x: 536, y: 40, w: 100, kind: "client" },
      { id: "iframe", x: 536, y: 120, w: 100, kind: "client" },
      { id: "cache", x: 160, y: 260, w: 104, kind: "store" },
    ],
    edges: [
      { from: "feed", to: "ingest", packets: 2, label: "ws" },
      { from: "ingest", to: "pubsub", packets: 2 },
      { from: "ingest", to: "cache", packets: 1 },
      { from: "pubsub", to: "socketA", packets: 2 },
      { from: "pubsub", to: "socketB", packets: 2 },
      { from: "socketA", to: "tv", packets: 2 },
      { from: "socketB", to: "iframe", packets: 2 },
      { from: "admin", to: "ingest", packets: 1 },
    ],
    decisions: ["snapshot", "fanout", "rooms", "embed"],
  },
  {
    id: "multibrand",
    icon: "monitor",
    tags: ["React", "TypeScript", "Redux Toolkit", "TanStack Query", "i18next", "framer-motion", "Strapi", "GitHub Actions"],
    nodes: [
      { id: "config", x: 20, y: 150, w: 110, kind: "store" },
      { id: "tokens", x: 170, y: 60, w: 110, kind: "core" },
      { id: "components", x: 170, y: 150, w: 110, kind: "core" },
      { id: "rbac", x: 170, y: 240, w: 110, kind: "core" },
      { id: "brandA", x: 330, y: 40, w: 100, kind: "client" },
      { id: "brandB", x: 330, y: 150, w: 100, kind: "client" },
      { id: "brandC", x: 330, y: 260, w: 100, kind: "client" },
      { id: "cms", x: 480, y: 100, w: 120, kind: "external" },
      { id: "ci", x: 480, y: 220, w: 120, kind: "external" },
    ],
    edges: [
      { from: "config", to: "tokens", packets: 1 },
      { from: "config", to: "components", packets: 1 },
      { from: "config", to: "rbac", packets: 1 },
      { from: "tokens", to: "brandA", packets: 1 },
      { from: "components", to: "brandB", packets: 1 },
      { from: "rbac", to: "brandC", packets: 1 },
      { from: "cms", to: "brandB", packets: 1, label: "REST" },
      { from: "ci", to: "brandC", packets: 1 },
    ],
    decisions: ["configDriven", "rbac", "caching", "i18n"],
  },
];

export const NODE_HEIGHT = 44;
