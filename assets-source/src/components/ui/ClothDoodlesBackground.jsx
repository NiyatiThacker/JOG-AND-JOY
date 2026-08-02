import React from 'react';
import { motion } from 'framer-motion';

const doodles = [
  // T-Shirt Doodle (Top Left)
  {
    top: '5%',
    left: '3%',
    color: '#EF4A45',
    size: 'w-12 h-12',
    duration: 5,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L2 6v4l4-2v14h12V8l4 2V6l-4-4-4 2-4-2z" />
      </svg>
    )
  },
  // Hanger Doodle (Top Right)
  {
    top: '8%',
    right: '5%',
    color: '#00A3E0',
    size: 'w-14 h-14',
    duration: 6,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L2 14h20L14.2 7A3 3 0 0 0 12 2z" />
        <path d="M2 14v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4" />
      </svg>
    )
  },
  // Shorts Doodle (Upper Mid Left)
  {
    top: '18%',
    left: '6%',
    color: '#F7B633',
    size: 'w-10 h-10',
    duration: 4.5,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v6l-4 10h-3.5L12 14l-0.5 6H8L4 10V4z" />
      </svg>
    )
  },
  // Button Doodle (Upper Mid Right)
  {
    top: '22%',
    right: '8%',
    color: '#3BB573',
    size: 'w-10 h-10',
    duration: 5.5,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
        <circle cx="9" cy="15" r="1" fill="currentColor" />
        <circle cx="15" cy="15" r="1" fill="currentColor" />
      </svg>
    )
  },
  // Frock / Dress Doodle (Mid Left)
  {
    top: '38%',
    left: '4%',
    color: '#F36E21',
    size: 'w-12 h-12',
    duration: 6.5,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l2 6-4 2v12H10V10L6 8l2-6z" />
        <path d="M6 22h12" />
      </svg>
    )
  },
  // Needle & Thread Doodle (Mid Right)
  {
    top: '42%',
    right: '4%',
    color: '#EF4A45',
    size: 'w-12 h-12',
    duration: 5.2,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2l-10 10" />
        <path d="M12 12c-2 2-5 2-7 0s-2-5 0-7 5-2 7 0" />
        <circle cx="20" cy="4" r="1" />
      </svg>
    )
  },
  // Scissors Doodle (Lower Mid Left)
  {
    top: '58%',
    left: '5%',
    color: '#00A3E0',
    size: 'w-11 h-11',
    duration: 4.8,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="8.5" y1="8.5" x2="20" y2="20" />
        <line x1="8.5" y1="15.5" x2="20" y2="4" />
      </svg>
    )
  },
  // Crown / Sparkle Doodle (Lower Mid Right)
  {
    top: '64%',
    right: '6%',
    color: '#F7B633',
    size: 'w-12 h-12',
    duration: 6.2,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18h20L18 8l-6 5-6-5-4 10z" />
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="4" cy="7" r="1.5" fill="currentColor" />
        <circle cx="20" cy="7" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  // T-Shirt Doodle 2 (Bottom Left)
  {
    top: '78%',
    left: '3%',
    color: '#3BB573',
    size: 'w-14 h-14',
    duration: 5.4,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L2 6v4l4-2v14h12V8l4 2V6l-4-4-4 2-4-2z" />
      </svg>
    )
  },
  // Hanger & Sock Doodle (Bottom Right)
  {
    top: '84%',
    right: '5%',
    color: '#F36E21',
    size: 'w-12 h-12',
    duration: 6.8,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L2 14h20L14.2 7A3 3 0 0 0 12 2z" />
        <path d="M2 14v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4" />
      </svg>
    )
  }
];

export default function ClothDoodlesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {doodles.map((d, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            right: d.right,
            color: d.color,
            opacity: 0.18
          }}
          className={`${d.size} select-none`}
          animate={{
            y: [0, -16, 0],
            rotate: [-6, 6, -6],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          {d.svg}
        </motion.div>
      ))}
    </div>
  );
}
