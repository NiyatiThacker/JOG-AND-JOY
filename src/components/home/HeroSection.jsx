"use client";

import React from 'react';
import ImageTrail from "./ImageTrail";

const trailImages = [
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1471286174574-e9627710ee7e?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502224562085-639556652f33?w=400&h=400&fit=crop&q=80",
];

export default function HeroSection() {
  return (
    <section className="hero-section" style={{
      position: "relative",
      height: "calc(100vh - 70px)",
      backgroundColor: "#FAF6F0", // Warm cream/sand background matching the logo layout
      color: "#1a1a1a",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "crosshair"
    }}>
      {/* Background Subtle Grid Pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.05,
        backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      {/* Image Trail interactive overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "auto"
      }}>
        <ImageTrail items={trailImages} variant={1} />
      </div>

      {/* Main Tagline Layout Container */}
      <div className="container" style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        pointerEvents: "none",
        width: "100%",
        maxWidth: "960px",
        padding: "0 20px"
      }}>
        {/* Left Side decorative tilted blue lines sticker */}
        <div style={{
          position: "absolute",
          left: "2%",
          top: "10%",
          display: "flex",
          gap: "8px",
          transform: "rotate(-15deg)",
          opacity: 0.95
        }} className="sticker-left max-md:hidden">
          <span style={{ width: "6px", height: "30px", backgroundColor: "var(--color-blue)", borderRadius: "4px", display: "inline-block" }} />
          <span style={{ width: "6px", height: "30px", backgroundColor: "var(--color-blue)", borderRadius: "4px", display: "inline-block" }} />
          <span style={{ width: "6px", height: "30px", backgroundColor: "var(--color-blue)", borderRadius: "4px", display: "inline-block" }} />
        </div>

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
        <h1 className="font-neue-metana" style={{
          fontSize: "clamp(2.2rem, 5vw, 4.4rem)",
          fontWeight: 900,
          color: "#2F1B2B", // Dark purple-gray ink
          lineHeight: "1.25",
          margin: "0 0 24px",
          width: "100%",
          letterSpacing: "-0.01em"
        }}>
          {/* Dress - custom styled script style */}
          <span style={{
            color: "var(--color-accent)", // Logo red
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            fontWeight: "normal",
            marginRight: "16px"
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
            width: "48px",
            height: "48px",
            marginLeft: "12px",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            boxShadow: "0 4px 10px rgba(237, 107, 33, 0.25)"
          }}>
            🤠
          </span>
          <br />

          {/* Yellow Card Highlight for 'Colorful' */}
          <span style={{
            display: "inline-block",
            backgroundColor: "var(--color-yellow)", // Logo Yellow
            color: "var(--color-accent)", // Logo Red text
            padding: "2px 24px",
            borderRadius: "20px",
            marginRight: "16px",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 4px 0 #222222",
            border: "1.5px solid #222222"
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
              bottom: "-8px",
              width: "100%",
              height: "7px",
              backgroundColor: "var(--color-yellow)",
              borderRadius: "4px",
              borderBottom: "1.5px solid #222222"
            }} />
          </span>
        </h1>

        {/* Subtext description */}
        <p style={{
          fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
          color: "#555555",
          maxWidth: "640px",
          lineHeight: "1.6",
          margin: "0 0 40px",
          fontWeight: 500
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
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#666666",
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

      {/* Interactive mouse trail hint in corner */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        fontSize: "0.85rem",
        color: "#888888",
        pointerEvents: "none",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--color-accent)",
          display: "inline-block"
        }} />
        Move mouse to reveal trail
      </div>
    </section>
  );
}
