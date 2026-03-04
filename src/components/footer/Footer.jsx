"use client";

import React from "react";
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-14 bg-second">
        <div className="container grid gap-4 md:grid-cols-3 items-center text-center md:text-left">
            <div className="flex gap-5 justify-center">
                <a
                  href='https://twitter.com/berkantkrkyss'
                  className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
                  aria-label='Twitter'
                >
                    <FaTwitter />
                </a>

                <a
                  href='https://www.linkedin.com/in/berkant-karakayis/'
                  className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
                  aria-label='LinkedIn'
                >
                    <FaLinkedinIn />
                </a>

                <a
                  href='https://github.com/berkantkarakayis'
                  className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
                  aria-label='GitHub'
                >
                    <FaGithub />
                </a>

                <a
                  href='https://www.instagram.com/berkantkrkys/'
                  className="text-title text-lg transition-colors duration-700 ease-in-out hover:text-primary"
                  aria-label='Instagram'
                >
                    <FaInstagram />
                </a>
            </div>

            <p className="text-xs font-bold text-cs md:text-center">
            <span className="text-primary">&copy;2026.</span> All Rights Reserved</p>

            <p className="text-xs font-bold text-cs md:text-right">Developed by 
            <span className="text-primary"> Berkant Karakayış</span></p>
        </div>
    </footer>
  )
}

export default Footer
