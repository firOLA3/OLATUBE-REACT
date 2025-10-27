    // components/LogoAnimationPage.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/olalogo.png';
import './LogoAnimationPage.css';

const LogoAnimationPage = () => {
  const navigate = useNavigate();
  const [animateOut, setAnimateOut] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animateOut && imgRef.current) {
      const handleAnimationEnd = () => {
        navigate('/signup');
      };
      imgRef.current.addEventListener('animationend', handleAnimationEnd);
      return () => {
        if (imgRef.current) {
          imgRef.current.removeEventListener('animationend', handleAnimationEnd);
        }
      };
    }
  }, [animateOut, navigate]);

  return (
    <div className="logo-animation-container">
      <img
        ref={imgRef}
        src={logo}
        alt="Ola Company Logo"
        className={`logo-animation-img animate__animated ${animateOut ? 'animate__fadeOutUp' : 'animate__bounceIn'}`}
        width={234}
        height={57}
      />
    </div>
  );
};

export default LogoAnimationPage;