"use client";

import React, { useMemo } from "react";
import { NODE_HEIGHT } from "./systemsData";

const KIND_STYLE = {
  client: { fill: "rgba(255,255,255,0.06)", stroke: "var(--glass-border)" },
  edge: {
    fill: "color-mix(in srgb, var(--primary-color) 18%, transparent)",
    stroke: "var(--primary-color)",
  },
  core: {
    fill: "color-mix(in srgb, var(--primary-color) 12%, transparent)",
    stroke: "color-mix(in srgb, var(--primary-color) 70%, transparent)",
  },
  store: { fill: "rgba(245,185,66,0.10)", stroke: "rgba(245,185,66,0.7)" },
  external: { fill: "rgba(167,139,250,0.10)", stroke: "rgba(167,139,250,0.7)" },
};

const center = (n) => ({ x: n.x + n.w / 2, y: n.y + NODE_HEIGHT / 2 });

/** Anchors an edge on the node borders facing each other and bends it gently. */
const edgePath = (a, b) => {
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  let start;
  let end;
  if (Math.abs(dx) >= Math.abs(dy)) {
    start = { x: dx > 0 ? a.x + a.w : a.x, y: ca.y };
    end = { x: dx > 0 ? b.x : b.x + b.w, y: cb.y };
    const mid = (start.x + end.x) / 2;
    return `M${start.x},${start.y} C${mid},${start.y} ${mid},${end.y} ${end.x},${end.y}`;
  }
  start = { x: ca.x, y: dy > 0 ? a.y + NODE_HEIGHT : a.y };
  end = { x: cb.x, y: dy > 0 ? b.y : b.y + NODE_HEIGHT };
  const mid = (start.y + end.y) / 2;
  return `M${start.x},${start.y} C${start.x},${mid} ${end.x},${mid} ${end.x},${end.y}`;
};

/**
 * Data-driven SVG architecture diagram: rounded nodes, curved edges and
 * packets travelling along them (SVG animateMotion, paused under reduced motion).
 */
export const Diagram = ({ system, labels, hovered, onHover, reduced }) => {
  const nodesById = useMemo(
    () => Object.fromEntries(system.nodes.map((n) => [n.id, n])),
    [system],
  );
  const dim = (id) =>
    hovered &&
    hovered !== id &&
    !system.edges.some(
      (e) =>
        (e.from === hovered && e.to === id) ||
        (e.to === hovered && e.from === id),
    );

  return (
    <svg
      viewBox="0 0 640 340"
      className="h-auto w-full select-none"
      role="img"
      aria-label={labels.title}
    >
      <defs>
        <marker
          id={`arrow-${system.id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M0,1 L9,5 L0,9 z"
            fill="var(--primary-color)"
            opacity="0.8"
          />
        </marker>
        <filter
          id={`glow-${system.id}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {system.edges.map((edge, i) => {
        const a = nodesById[edge.from];
        const b = nodesById[edge.to];
        const d = edgePath(a, b);
        const id = `${system.id}-e${i}`;
        const active =
          hovered && (hovered === edge.from || hovered === edge.to);
        const faded = hovered && !active;
        return (
          <g
            key={id}
            opacity={faded ? 0.25 : 1}
            className="transition-opacity duration-300"
          >
            <path
              id={id}
              d={d}
              fill="none"
              stroke={active ? "var(--primary-color)" : "var(--glass-border)"}
              strokeWidth={active ? 2 : 1.4}
              markerEnd={`url(#arrow-${system.id})`}
              markerStart={edge.bidi ? `url(#arrow-${system.id})` : undefined}
            />
            {edge.label && (
              <text
                fontSize="9"
                fill="var(--muted-color)"
                fontFamily="ui-monospace, Menlo, monospace"
              >
                <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
                  <tspan dy="-4">{edge.label}</tspan>
                </textPath>
              </text>
            )}
            {!reduced &&
              Array.from({ length: edge.packets }).map((_, p) => (
                <circle
                  key={p}
                  r="3.2"
                  fill="var(--primary-color)"
                  opacity="0"
                  filter={`url(#glow-${system.id})`}
                >
                  <animate
                    attributeName="opacity"
                    to="1"
                    begin={`${(p * 1.2 + i * 0.35).toFixed(2)}s`}
                    dur="0.05s"
                    fill="freeze"
                  />
                  <animateMotion
                    dur={`${2.4 + (i % 3) * 0.4}s`}
                    begin={`${(p * 1.2 + i * 0.35).toFixed(2)}s`}
                    repeatCount="indefinite"
                    keyPoints={edge.bidi && p % 2 ? "1;0" : "0;1"}
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              ))}
          </g>
        );
      })}

      {system.nodes.map((node) => {
        const style = KIND_STYLE[node.kind];
        const isHover = hovered === node.id;
        return (
          <g
            key={node.id}
            className="cursor-pointer transition-opacity duration-300"
            opacity={dim(node.id) ? 0.35 : 1}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(node.id)}
            onBlur={() => onHover(null)}
            tabIndex={0}
            role="button"
            aria-label={labels.nodes[node.id]?.title ?? node.id}
          >
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={NODE_HEIGHT}
              rx="12"
              fill={style.fill}
              stroke={isHover ? "var(--primary-color)" : style.stroke}
              strokeWidth={isHover ? 2 : 1.2}
              filter={isHover ? `url(#glow-${system.id})` : undefined}
            />
            <text
              x={node.x + node.w / 2}
              y={node.y + NODE_HEIGHT / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11.5"
              fontWeight="700"
              fill="var(--title-color)"
              fontFamily="inherit"
            >
              {labels.nodes[node.id]?.title ?? node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
