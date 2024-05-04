import React from 'react';
import profileImg from '../../assets/profile-img.png';
import shapeOne from '../../assets/shape-1.png';
import shapeTwo from '../../assets/shape-2.png';
import resume from '../../assets/Resume/resume.pdf';

import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram,  } from 'react-icons/fa';
import './home.css';

const Home = () => {
  return (
  <section className='home' id='home'>
    <div className="home__wrapper">
      <div className="home__container container">
        <p className="home__subtitle text-cs">
          Hello, <span> My Name Is</span>
        </p>

        <h1 className="home__title text-cs">
          <span>BERKANT</span> 
        </h1>

        <h1 className="home__title text-cs">
          KARAKAYIŞ
        </h1>

        <p className='home__job'>
          <span className='text-cs'>I Am</span> <b>Software Developer</b>
        </p>

        <div className="home__img-wrapper">
          <div className="home__banner">
            <img src={profileImg} alt="" className='home__profile'/>
          </div>

          <p className="home__data home__data-one">
            <span className="text-lg">
              1 <b>+</b>
            </span>

            <span className="text-sm text-cs">
              Years of <span>Experience</span>
            </span>
          </p>

          <p className="home__data home__data-two">
            <span className="text-lg">
              34 <b>+</b>
            </span>

            <span className="text-sm text-cs">
              Completed <span>Projects</span>
            </span>
          </p>

          <img src={shapeOne} alt="" className='shape shape__1'/>
          <img src={shapeTwo} alt="" className='shape shape__2'/>
          <img src={shapeTwo} alt="" className='shape shape__3'/>
      </div>

      <p className="home__text">
        From Turkiye, Istanbul. A passionate developer.
        I am an impatient fast learner. Eager to achieve
         great things. I’m ready to give you my best.
      </p>

      <div className='home__socials'>
        <a href='https://twitter.com/berkantkrkyss' className='home__social-link'>
          <FaTwitter />
        </a>

        <a href='https://www.linkedin.com/in/berkant-karakayis/' className='home__social-link'>
          <FaLinkedinIn />
        </a>

        <a href='https://github.com/berkantkarakayis' className='home__social-link'>
          <FaGithub />
        </a>

        <a href='https://www.instagram.com/berkantkrkys/' className='home__social-link'>
          <FaInstagram />
        </a>
      </div>

      <div className="home__btns">
        <a href={resume} download="Berkant-Karakayış" target='_blank' className="btn text-cs">
          Download CV
        </a>

        <a href="#skills" className="hero__link text-cs">
          My Skills
        </a>
      </div>
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt='' className='shape'></img>
      </div>
    </div>

    <div className="section__bg-wrapper">
      <span className="bg__title">F.E Developer</span>
    </div>
  </section>
)};

export default Home;
