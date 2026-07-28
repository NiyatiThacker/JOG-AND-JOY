import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function BrandLogo({ className = 'h-10', showTagline = true, animate = false, linkTo = '/' }) {
  const logoRef = useRef(null);

  useEffect(() => {
    if (!animate || !logoRef.current) return;

    const logo = logoRef.current;
    
    // Initial State: positioned off-screen to the left, slightly rotated and shrunk
    gsap.set(logo, { x: -100, opacity: 0, scale: 0.8, rotate: -15 });

    const tl = gsap.timeline({ delay: 0.3 });
    
    // 1. Slide in from left with rotation
    tl.to(logo, {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.65,
      ease: 'power2.out'
    });

    // 2. Thematic landing squish impact (compresses vertically, expands horizontally)
    tl.to(logo, {
      scaleY: 0.82,
      scaleX: 1.15,
      duration: 0.1,
      ease: 'power1.inOut'
    });

    // 3. First bouncy jump (stretches vertically, narrows horizontally)
    tl.to(logo, {
      y: -18,
      scaleY: 1.18,
      scaleX: 0.88,
      duration: 0.24,
      ease: 'power2.out'
    });

    // 4. Fall back to ground
    tl.to(logo, {
      y: 0,
      scaleY: 0.88,
      scaleX: 1.08,
      duration: 0.2,
      ease: 'power2.in'
    });

    // 5. Second smaller jump (settling down)
    tl.to(logo, {
      y: -6,
      scaleY: 1.06,
      scaleX: 0.95,
      duration: 0.16,
      ease: 'power2.out'
    });

    // 6. Final settle on the ground plane
    tl.to(logo, {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      duration: 0.14,
      ease: 'power1.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [animate]);

  const handleHover = () => {
    if (!logoRef.current) return;
    
    const logo = logoRef.current;
    
    // Terminate any active tweens on the logo to start a fresh clean hover jump
    gsap.killTweensOf(logo);
    
    const hoverTl = gsap.timeline();
    // Squish on prep
    hoverTl.to(logo, { scaleY: 0.84, scaleX: 1.12, duration: 0.08 });
    // Spring up
    hoverTl.to(logo, { y: -12, scaleY: 1.12, scaleX: 0.9, duration: 0.2, ease: 'power2.out' });
    // Land
    hoverTl.to(logo, { y: 0, scaleY: 0.92, scaleX: 1.06, duration: 0.16, ease: 'power2.in' });
    // Settle back to original 1:1
    hoverTl.to(logo, { scaleY: 1, scaleX: 1, duration: 0.1 });
  };

  return (
    <Link 
      to={linkTo} 
      className="flex flex-col items-start group select-none"
      onMouseEnter={handleHover}
    >
      <div ref={logoRef} className="origin-bottom">
        <img
          src="/images/official_logo.png"
          alt="JOG&JOY® - Love is in the wear"
          className={`${className} w-auto object-contain`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="hidden font-black text-xl text-[#2D2D2D]">
          JOG<span className="text-[#00A3E0]">&</span>JOY<sup className="text-xs text-[#EF4A45]">®</sup>
          {showTagline && <span className="block text-[10px] text-[#9DA3A8] font-bold">Love is in the wear</span>}
        </div>
      </div>
    </Link>
  );
}
