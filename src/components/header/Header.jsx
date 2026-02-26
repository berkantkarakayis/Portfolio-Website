import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom';
import { links } from "../../Data";
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram,  } from 'react-icons/fa';
import {BsSun, BsMoon} from 'react-icons/bs';
import './header.css';
import { Link } from 'react-scroll';
import { animateScroll } from 'react-scroll';
import shapeOne from '../../assets/shape-1.png';

const getStorageTheme = () =>{
    let theme = 'light-theme';
    if(localStorage.getItem('theme')){
        theme = localStorage.getItem('theme');
    }
    return theme;
}

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollNav, setScrollNav] = useState(false);
  const [theme, setTheme] = useState(getStorageTheme());
  const themeToggleRef = useRef(null);

  const scrollTop = () => {
    animateScroll.scrollToTop();
  };

  const changeNav = () => {
    if(window.scrollY >= 80) {
        setScrollNav(true);
    }
    else{
        setScrollNav(false);
    }
  };

  const toggleTheme = async () => {
    if (!themeToggleRef.current) {
      setTheme(theme === 'light-theme' ? 'dark-theme' : 'light-theme');
      return;
    }

    if (!document.startViewTransition) {
      setTheme(theme === 'light-theme' ? 'dark-theme' : 'light-theme');
      return;
    }

    const { top, left, width, height } =
      themeToggleRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === 'light-theme' ? 'dark-theme' : 'light-theme');
      });
    }).ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNav);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showMenu);
  }, [showMenu]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className={`${scrollNav ? 'scroll-header': ''}
    header`}>
        <nav className="nav">
            <Link to='/' onClick={scrollTop} className="nav__logo text-cs">
                Berkant
            </Link>

            <div className={`${showMenu ? 'nav__menu show-menu' :
            'nav__menu'}`}>
               <div className="nav__data">
                    <ul className="nav__list">
                        {links.map(({name, path}, index)=>{
                            return(
                                <li className="nav__item" key={index}>
                                    <Link 
                                        className='nav__link text-cs'
                                        to={path}
                                        spy={true} 
                                        hashSpy={true}
                                        smooth={true} 
                                        offset={-100} 
                                        duration={500} 
                                        onClick={() => setShowMenu(!showMenu)}
                                    >
                                        {name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <div className='header__socials'>
                        <a href='https://twitter.com/berkantkrkyss' className='header__social-link'>
                            <FaTwitter />
                        </a>

                        <a href='https://www.linkedin.com/in/berkant-karakayis/' className='header__social-link'>
                            <FaLinkedinIn />
                        </a>

                        <a href='https://github.com/berkantkarakayis' className='header__social-link'>
                            <FaGithub />
                        </a>

                        <a href='https://www.instagram.com/berkantkrkys/' className='header__social-link'>
                            <FaInstagram />
                        </a>
                    </div>
               </div>

               <div className="section__deco deco__left header__deco">
                    <img src={shapeOne} alt='' className='shape'></img>
                </div>
            </div>

            <div className="nav__btns">
                <div
                    ref={themeToggleRef}
                    className="theme__toggler"
                    onClick={toggleTheme}
                >
                    {theme === 'light-theme' ? <BsMoon /> : <BsSun />}
                </div>

                <div className={`${showMenu ? 'nav__toggle animate-toggle' :
                    'nav__toggle'}`} onClick={() =>
                    setShowMenu(!showMenu)}>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Header
