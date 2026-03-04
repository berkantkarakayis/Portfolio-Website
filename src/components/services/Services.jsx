"use client";

import React from "react";
import { services } from "../../Data";
import { FaArrowRight } from "react-icons/fa";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper/modules";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";

const Services = () => {
  return (
    <section className="section bg-second" id="services">
      <h2 className="section__title text-cs">What I Do</h2>
      <p className="section__subtitle">
        My <span>Services</span>
      </p>

      <Swiper
        pagination={{
          clickable: true,
          el: ".services-pagination",
          bulletClass:
            "services-bullet border-2 border-title bg-container opacity-100 relative w-3 h-3 rounded-full",
          bulletActiveClass: "bg-primary w-3.5 h-3.5 translate-y-0.5",
        }}
        breakpoints={{
          540: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination]}
        className="container text-center mySwiper"
      >
        {services.map(({ name, title, description }, index) => {
          return (
            <SwiperSlide className="card card-one" key={index}>
              <span className="text-cs block text-title text-xs font-bold mb-16">
                {name}
              </span>

              <h3 className="text-2xl mb-4">{title}</h3>
              <p className="min-h-44">{description}</p>

              <a href="#pricing" className="link">
                See Pricing
                <FaArrowRight className="link__icon" />
              </a>

              <img src={shapeTwo} alt="" className="shape c__shape" />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="services-pagination relative inline-flex items-center gap-5 mt-12 before:content-[''] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-title" />

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape"></img>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Services</span>
      </div>
    </section>
  );
};

export default Services;
