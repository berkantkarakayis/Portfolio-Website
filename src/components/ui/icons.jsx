"use client";

import React from "react";
import {
  LuMonitor,
  LuServer,
  LuDatabase,
  LuGamepad2,
  LuSmartphone,
  LuContainer,
  LuRadio,
  LuSparkles,
} from "react-icons/lu";
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";

const groupIcons = {
  monitor: LuMonitor,
  server: LuServer,
  database: LuDatabase,
  gamepad: LuGamepad2,
  smartphone: LuSmartphone,
  container: LuContainer,
  radio: LuRadio,
  sparkles: LuSparkles,
};

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  instagram: FaInstagram,
};

export const GroupIcon = ({ name, className }) => {
  const Icon = groupIcons[name] ?? LuSparkles;
  return <Icon className={className} aria-hidden="true" />;
};

export const SocialIcon = ({ id, className }) => {
  const Icon = socialIcons[id];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
};
