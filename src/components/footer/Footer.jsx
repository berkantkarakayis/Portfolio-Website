"use client";

import React from "react";
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer__container container grid">
            <div className='footer__socials'>
                <a
                  href='https://twitter.com/berkantkrkyss'
                  className='footer__social-link'
                  aria-label='Twitter'
                >
                    <FaTwitter />
                </a>

                <a
                  href='https://www.linkedin.com/in/berkant-karakayis/'
                  className='footer__social-link'
                  aria-label='LinkedIn'
                >
                    <FaLinkedinIn />
                </a>

                <a
                  href='https://github.com/berkantkarakayis'
                  className='footer__social-link'
                  aria-label='GitHub'
                >
                    <FaGithub />
                </a>

                <a
                  href='https://www.instagram.com/berkantkrkys/'
                  className='footer__social-link'
                  aria-label='Instagram'
                >
                    <FaInstagram />
                </a>
            </div>

            <p className="footer__copyright text-cs">
            <span>&copy;2026.</span> All Rights Reserved</p>

            <p className="footer__copyright text-cs">Developed by 
            <span> Berkant Karakayış</span></p>
        </div>
    </footer>
  )
}

export default Footer
