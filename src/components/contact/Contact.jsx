"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  LuMapPin,
  LuMail,
  LuCopy,
  LuCheck,
  LuSend,
  LuLoaderCircle,
  LuCircleAlert,
  LuBriefcase,
} from "react-icons/lu";
import { site } from "../../Data";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

const shapeOne = "/assets/shape-1.webp";
const ENDPOINT = "https://sheet.best/api/sheets/165f2129-e949-4e84-8e9a-3cbf2f1cbd98";
const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

const inputClass =
  "w-full rounded-full border-2 border-[color:var(--border-color)] bg-container px-7 text-title transition-all duration-300 placeholder:text-[color:var(--muted-color)] focus:border-primary focus:shadow-[0_0_0_4px_var(--primary-soft)] disabled:opacity-60";

const InfoCard = ({ icon: Icon, title, children }) => (
  <div className="relative flex items-start gap-5">
    <span className="grid h-14 w-14 flex-none place-items-center rounded-full border-2 border-[color:var(--border-color)] bg-container text-lg text-title shadow-soft">
      <Icon aria-hidden="true" />
    </span>
    <div className="pt-1">
      <h3 className="font-accent text-2xl text-title">{title}</h3>
      <div className="mt-1 text-text">{children}</div>
    </div>
  </div>
);

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [copied, setCopied] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    // Honeypot: bots fill the hidden "company" field.
    if (form.company) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          sentAt: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const busy = status === "loading";

  return (
    <section className="section scroll-mt-20 bg-first" id="contact">
      <SectionHeading title="Contact Me" kicker="Let's" accent="Talk About Ideas" />

      <div className="container relative z-10 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <StaggerGroup className="space-y-10" stagger={0.1}>
          <StaggerItem>
            <InfoCard icon={LuMapPin} title="Location">
              <p>{site.location} · Remote-friendly</p>
            </InfoCard>
          </StaggerItem>

          <StaggerItem>
            <InfoCard icon={LuBriefcase} title="Availability">
              <p className="inline-flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                {site.availability}
              </p>
            </InfoCard>
          </StaggerItem>

          <StaggerItem>
            <InfoCard icon={LuMail} title="Email">
              <div className="flex flex-wrap items-center gap-3">
                <a className="font-semibold text-primary hover:underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="chip"
                  aria-live="polite"
                >
                  {copied ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </InfoCard>
          </StaggerItem>
        </StaggerGroup>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate={false} className="glass rounded-[24px] p-6 sm:p-8">
            <div className="grid gap-x-6 md:grid-cols-2">
              <div className="mb-6 grid gap-2">
                <label className="text-cs ml-6 text-xs font-bold text-title" htmlFor="contact-name">
                  Full name <b className="text-primary">*</b>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  disabled={busy}
                  onChange={handleChange}
                  value={form.name}
                  placeholder="Jane Doe"
                  className={`${inputClass} h-14`}
                />
              </div>

              <div className="mb-6 grid gap-2">
                <label className="text-cs ml-6 text-xs font-bold text-title" htmlFor="contact-email">
                  Email address <b className="text-primary">*</b>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  disabled={busy}
                  onChange={handleChange}
                  value={form.email}
                  placeholder="jane@company.com"
                  className={`${inputClass} h-14`}
                />
              </div>
            </div>

            <div className="mb-6 grid gap-2">
              <label className="text-cs ml-6 text-xs font-bold text-title" htmlFor="contact-subject">
                Subject <b className="text-primary">*</b>
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                autoComplete="off"
                required
                disabled={busy}
                onChange={handleChange}
                value={form.subject}
                placeholder="Real-time dashboard for…"
                className={`${inputClass} h-14`}
              />
            </div>

            <div className="mb-6 grid gap-2">
              <label className="text-cs ml-6 text-xs font-bold text-title" htmlFor="contact-message">
                Message <b className="text-primary">*</b>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                disabled={busy}
                minLength={10}
                onChange={handleChange}
                value={form.message}
                placeholder="Tell me about the project, timeline and budget range."
                className={`${inputClass} h-40 resize-none !rounded-3xl py-5`}
              />
            </div>

            {/* Honeypot */}
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-text">
                I usually reply within <b className="text-title">24 hours</b>.
              </p>
              <button
                type="submit"
                disabled={busy}
                className="btn btn--primary text-cs inline-flex min-w-[190px] items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <>
                    <LuLoaderCircle className="animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <LuSend aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {status === "success" && (
                <m.p
                  key="ok"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-center gap-3 rounded-2xl border border-primary bg-[color:var(--primary-soft)] px-5 py-4 text-sm text-title"
                >
                  <LuCheck className="text-primary" aria-hidden="true" />
                  Thanks! Your message is on its way. I&apos;ll get back to you shortly.
                </m.p>
              )}
              {status === "error" && (
                <m.p
                  key="err"
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-center gap-3 rounded-2xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-title"
                >
                  <LuCircleAlert className="text-red-400" aria-hidden="true" />
                  Something went wrong. Please try again or email me directly at{" "}
                  <a className="font-semibold text-primary" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </m.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Contact</span>
      </div>
    </section>
  );
};

export default Contact;
