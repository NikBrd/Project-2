import React, { useEffect, useRef } from 'react';
import './ParallaxBackground.css';

const ParallaxBackground: React.FC = () => {
  const parallaxRef1 = useRef<HTMLDivElement>(null);
  const parallaxRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // First image moves much slower (0.15 speed) - stays visible throughout scroll
      if (parallaxRef1.current) {
        // Calculate position to keep image visible throughout scroll
        const offset = scrolled * 0.15;
        parallaxRef1.current.style.transform = `translateY(${offset}px)`;
      }
      
      // Second image moves even slower (0.1 speed) for subtle depth effect
      if (parallaxRef2.current) {
        const offset = scrolled * 0.1;
        parallaxRef2.current.style.transform = `translateY(${offset}px)`;
      }
    };

    // Call once to set initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="parallax-background-wrapper">
      <div className="parallax-background-image" ref={parallaxRef1}></div>
      <div className="parallax-background-image secondary" ref={parallaxRef2}></div>
      <div className="parallax-overlay"></div>
    </div>
  );
};

export default ParallaxBackground;

