import React, { useEffect, useRef } from 'react';
import './ParallaxHeader.css';

const ParallaxHeader: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="parallax-header">
      <div className="parallax-background" ref={parallaxRef}></div>
      <div className="parallax-content">
        <h1 className="parallax-title">Cryptonite</h1>
        <p className="parallax-subtitle">מידע ודו"חות מעולם המטבעות הווירטואליים</p>
      </div>
    </div>
  );
};

export default ParallaxHeader;






