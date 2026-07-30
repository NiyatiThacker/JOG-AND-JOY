"use client";

import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero-section" style={{
      position: "relative",
      height: "calc(100vh - 70px)",
      color: "#1a1a1a",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "crosshair"
    }}>
      {/* Background Video (Swapped from KidsPage) */}
      <video
        src="/videos/kids-hero-new.mp4"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={(e) => { e.currentTarget.playbackRate = 2; }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      {/* Main Tagline Layout Container */}
      <div className="container" style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        padding: "6vh 4vw 6vh 4vw"
      }}>


        {/* Right Side decorative crayon/sketch sticker */}
        <div style={{
          position: "absolute",
          right: "2%",
          top: "8%",
          width: "42px",
          height: "42px",
          backgroundColor: "#FAF6F0",
          border: "2px solid #ED6B21", // Orange border
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          transform: "rotate(12deg)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          opacity: 0.95
        }} className="sticker-right max-md:hidden">
          🖍️
        </div>

        {/* Playful Headline Layout */}
        <h1 style={{
          fontFamily: "var(--font-heading-primary)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
          fontWeight: 900,
          color: "#2F1B2B",
          textShadow: "0 0 25px rgba(255,255,255,0.7), 0 0 10px rgba(255,255,255,0.5)",
          lineHeight: "1.3",
          margin: "0 0 24px",
          width: "100%",
          textAlign: "right",
          alignSelf: "flex-end",
          letterSpacing: "-0.01em"
        }}>
          {/* Dress - custom styled script style with overlaid blue lines */}
          <span style={{
            position: "relative",
            display: "inline-block",
            color: "var(--color-accent)", // Logo red
            fontFamily: "var(--font-heading-secondary)",
            fontWeight: "normal",
            marginRight: "12px",
            textShadow: "0 0 15px rgba(255,255,255,0.6)"
          }}>

            Dress
          </span>
          Your Little Ones in
          
          {/* Emoji Badge inline */}
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ED6B21", // Logo orange
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            marginLeft: "10px",
            fontSize: "1.2rem",
            verticalAlign: "middle",
            boxShadow: "0 4px 10px rgba(237, 107, 33, 0.4)",
            textShadow: "none"
          }}>
            🤠
          </span>
          <br />

          {/* Yellow Card Highlight for 'Colorful' */}
          <span style={{
            display: "inline-block",
            backgroundColor: "var(--color-yellow)", // Logo Yellow
            color: "var(--color-accent)", // Logo Red text
            padding: "0px 18px",
            borderRadius: "16px",
            marginRight: "12px",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 3px 0 #222222",
            border: "1.5px solid #222222",
            textShadow: "none"
          }}>
            Colorful
          </span>

          {/* Underlined 'Confidence!' word */}
          <span style={{
            position: "relative",
            display: "inline-block"
          }}>
            Confidence!
            {/* Draw a thick yellow underline */}
            <span style={{
              position: "absolute",
              left: 0,
              bottom: "-4px",
              width: "100%",
              height: "5px",
              backgroundColor: "var(--color-yellow)",
              borderRadius: "4px",
              borderBottom: "1.5px solid #222222",
              boxShadow: "none"
            }} />
          </span>
        </h1>

        {/* Bottom Content Wrapper to push them down together */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Subtext description */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)",
          color: "#2F1B2B",
          textShadow: "0 0 15px rgba(255,255,255,0.8)",
          maxWidth: "640px",
          lineHeight: "1.6",
          margin: "0 0 40px",
          fontWeight: 600
        }}>
          Where every clothing sparks imagination allowing your child to express themselves!
        </p>

        {/* CTAs Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
          width: "100%",
          pointerEvents: "auto"
        }}>
          {/* Left social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "var(--color-accent)"
            }}>
              952+
            </span>
            
            {/* Avatar Stack */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80" 
                alt="User"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #ffffff", objectFit: "cover" }} 
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" 
                alt="User"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #ffffff", marginLeft: "-10px", objectFit: "cover" }} 
              />
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80" 
                alt="User"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #ffffff", marginLeft: "-10px", objectFit: "cover" }} 
              />
            </div>
            
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#2F1B2B",
              textShadow: "0 0 10px rgba(255,255,255,0.8)",
              textAlign: "left",
              lineHeight: 1.2
            }}>
              Families<br />Prefer Us!
            </span>
          </div>

          {/* Shop Now Action Button */}
          <a href="/products" className="btn" style={{
            backgroundColor: "var(--color-accent)", // Logo Red
            color: "#ffffff",
            padding: "14px 36px",
            borderRadius: "30px",
            fontSize: "1.05rem",
            fontWeight: 700,
            border: "1.5px solid #222222",
            boxShadow: "0 4px 0 #222222",
            transition: "transform 0.1s, box-shadow 0.1s"
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(2px)";
            e.currentTarget.style.boxShadow = "0 2px 0 #222222";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 0 #222222";
          }}
          >
            Shop Now &rarr;
          </a>

          {/* Play Video Action Circle */}
          <a 
            href="/why-us"
            aria-label="Play video review"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--color-green)", // Dark logo green
              border: "1.5px solid #222222",
              boxShadow: "0 3px 0 #222222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ▶️
          </a>
        </div>
      </div>
    </div>

    </section>
  );
}
