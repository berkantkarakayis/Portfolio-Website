"use client";

import React, { useState } from "react";
import {
  FaRegAddressBook,
  FaRegEnvelope,
  FaRegUser,
  FaRegMap,
} from "react-icons/fa";
import axios from "axios";

const shapeOne = "/assets/shape-1.webp";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "https://sheet.best/api/sheets/165f2129-e949-4e84-8e9a-3cbf2f1cbd98",
        form,
      )
      .then((response) => {
        setForm({ name: "", email: "", subject: "", message: "" });
      });
  };

  return (
    <section className="section bg-first" id="contact">
      <h2 className="section__title text-cs">Contact Me</h2>
      <p className="section__subtitle">
        Let's <span>Talk Abouut Ideas</span>
      </p>

      <div className="container grid gap-12 lg:grid-cols-2 relative z-10">
        <div>
          <div className="relative pl-32 mb-10 max-md:pl-24 max-sm:pl-20">
            <span className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-solid border-[color:var(--border-color)] bg-container shadow-soft text-lg grid place-items-center after:content-[''] after:w-10 after:h-0.5 after:bg-border after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 max-sm:after:hidden">
              <FaRegMap />
            </span>

            <h3 className="text-2xl font-accent text-title py-1.5">Address</h3>
            <p className="text-text">Istanbul, Turkiye</p>
          </div>

          <div className="relative pl-32 mb-10 max-md:pl-24 max-sm:pl-20">
            <span className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-solid border-[color:var(--border-color)] bg-container shadow-soft text-lg grid place-items-center after:content-[''] after:w-10 after:h-0.5 after:bg-border after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 max-sm:after:hidden">
              <FaRegUser />
            </span>

            <h3 className="text-2xl font-accent text-title py-1.5">
              Freelance
            </h3>
            <p className="text-text">Available Right Now!</p>
          </div>

          <div className="relative pl-32 mb-10 max-md:pl-24 max-sm:pl-20">
            <span className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-solid border-[color:var(--border-color)] bg-container shadow-soft text-lg grid place-items-center after:content-[''] after:w-10 after:h-0.5 after:bg-border after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 max-sm:after:hidden">
              <FaRegEnvelope />
            </span>

            <h3 className="text-2xl font-accent text-title py-1.5">
              Send an Email
            </h3>
            <a
              className="text-primary"
              href="mailto:berkantkarakayiss@gmail.com"
            >
              berkantkarakayiss@gmail.com
            </a>
          </div>

          {/* <div className="contact__card">
                    <span className="contact__card-icon">
                        <FaRegAddressBook />
                    </span>

                    <h3 className="contact__card-title">Phone</h3>
                    <a className="contact__card-data" 
                    target="_blank">+90-543-861-80-20</a><br></br>   
                    <a className="contact__card-data" href="https://api.whatsapp.com/send?phone=905438618020&text=Merhaba! Size websiteniz üzerinden ulaştım. Müsait misiniz?     |      Hello! I reached out to you through your website. Are you available?     " 
                    target="_blank" style={{ color: 'hsl(165, 60%, 40%)' }}>Whatsapp</a>         
                </div> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-x-8">
            <div className="grid gap-2 mb-8">
              <label
                className="ml-8 text-xs font-bold text-cs"
                htmlFor="contact-name"
              >
                Your Full Name <b className="text-primary">*</b>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                aria-required="true"
                onChange={handleChange}
                value={form.name}
                className="border-2 border-solid border-[color:var(--border-color)] bg-container text-title h-14 rounded-full px-8"
              />
            </div>

            <div className="grid gap-2 mb-8">
              <label
                className="ml-8 text-xs font-bold text-cs"
                htmlFor="contact-email"
              >
                Your Email Address <b className="text-primary">*</b>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                aria-required="true"
                onChange={handleChange}
                value={form.email}
                className="border-2 border-solid border-[color:var(--border-color)] bg-container text-title h-14 rounded-full px-8"
              />
            </div>
          </div>

          <div className="grid gap-2 mb-8">
            <label
              className="ml-8 text-xs font-bold text-cs"
              htmlFor="contact-subject"
            >
              Your Subject <b className="text-primary">*</b>
            </label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              autoComplete="off"
              required
              aria-required="true"
              onChange={handleChange}
              value={form.subject}
              className="border-2 border-solid border-[color:var(--border-color)] bg-container text-title h-14 rounded-full px-8"
            />
          </div>

          <div className="grid gap-2 mb-8">
            <label
              className="ml-8 text-xs font-bold text-cs"
              htmlFor="contact-message"
            >
              Your Message <b className="text-primary">*</b>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              aria-required="true"
              onChange={handleChange}
              value={form.message}
              className="border-2 border-solid border-[color:var(--border-color)] bg-container text-title h-36 rounded-3xl px-8 py-5 resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-x-8 gap-y-4">
            <p>* Accept the terms and conditions.</p>
            <button type="submit" className="btn text-cs">
              Send Message
            </button>
          </div>
        </form>
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Contact</span>
      </div>
    </section>
  );
};

export default Contact;
