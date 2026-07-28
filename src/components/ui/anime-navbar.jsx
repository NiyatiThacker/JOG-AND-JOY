import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"

const cn = (...classes) => classes.filter(Boolean).join(' ')

export function AnimeNavBar({ items, className, defaultActive = "Home" }) {
  const location = useLocation()
  const [hoveredTab, setHoveredTab] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Find the matching nav item based on the current path
    const currentItem = items.find(
      (item) => 
        location.pathname === item.url || 
        (item.url !== '/' && location.pathname.startsWith(item.url))
    );
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, [location.pathname, items]);

  return (
    <div className={`relative ${className || ''}`}>
      <div className="flex justify-center w-full max-w-full overflow-x-auto hide-scrollbar px-2 py-12 -my-12">
        <motion.div 
          className="p-[2px] rounded-full mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          style={{
            background: 'linear-gradient(90deg, #EF4A45, #00A3E0, #39B54A, #FFD800)',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/95 backdrop-blur-xl py-1 px-1 rounded-full relative">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={(e) => {
                  setActiveTab(item.name)
                }}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-[11px] md:text-sm font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300 whitespace-nowrap",
                  "text-slate-500 hover:text-slate-800",
                  isActive && "text-slate-900"
                )}
                style={{ 
                  color: isActive || hoveredTab === item.name ? item.color : undefined 
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ backgroundColor: `${item.color}25` }}
                  />
                )}

                <motion.span
                  className="hidden md:inline relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
                <motion.span 
                  className="md:hidden relative z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </motion.span>
          
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-slate-100 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="anime-mascot"
                    className="absolute -top-[35px] left-1/2 -translate-x-1/2 pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Cute Child Mascot */}
                    <div className="relative w-14 h-14 scale-75 origin-bottom">

                      {/* Head */}
                      <motion.div 
                        className="absolute w-11 h-11 rounded-full left-1/2 -translate-x-1/2 overflow-hidden shadow-sm border border-slate-200/50"
                        style={{ backgroundColor: '#FFE0C2' }}
                        animate={ hoveredTab ? { y: -4, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } } : { y: [0, -2, 0], transition: { duration: 2, repeat: Infinity } } }
                      >
                        {/* Hair */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-[#4A3B32]" />
                        <div className="absolute top-0 left-1 w-3 h-5 bg-[#4A3B32] rounded-full" />
                        <div className="absolute top-0 right-1 w-3 h-5 bg-[#4A3B32] rounded-full" />
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-2 bg-[#4A3B32] rounded-b-full" />
                        
                        {/* Eyes */}
                        <motion.div 
                          className="absolute w-2 h-2 bg-slate-800 rounded-full"
                          animate={ hoveredTab ? { scaleY: [1, 0.1, 1], transition: { duration: 0.2 } } : { scaleY: [1, 1, 0.1, 1, 1], transition: { duration: 4, times: [0, 0.95, 0.97, 0.99, 1], repeat: Infinity } } }
                          style={{ left: '25%', top: '45%' }}
                        />
                        <motion.div 
                          className="absolute w-2 h-2 bg-slate-800 rounded-full"
                          animate={ hoveredTab ? { scaleY: [1, 0.1, 1], transition: { duration: 0.2 } } : { scaleY: [1, 1, 0.1, 1, 1], transition: { duration: 4, times: [0, 0.95, 0.97, 0.99, 1], repeat: Infinity } } }
                          style={{ right: '25%', top: '45%' }}
                        />

                        {/* Cheeks */}
                        <div className="absolute w-2 h-1 bg-red-400 rounded-full opacity-50" style={{ left: '15%', top: '60%' }} />
                        <div className="absolute w-2 h-1 bg-red-400 rounded-full opacity-50" style={{ right: '15%', top: '60%' }} />
                        
                        {/* Mouth */}
                        <motion.div 
                          className="absolute w-2.5 h-1.5 border-b-2 border-slate-800 rounded-full"
                          animate={ hoveredTab ? { scaleY: 2, y: 1, backgroundColor: '#EF4A45', borderBottomWidth: 0, height: '4px', borderRadius: '0 0 10px 10px' } : { scaleY: 1, y: 0 } }
                          style={{ left: '50%', top: '62%', translateX: '-50%' }}
                        />
                      </motion.div>
                      
                      {/* Hands peeking */}
                      <motion.div 
                        className="absolute bottom-1.5 left-1 w-3 h-3 rounded-full shadow-sm border border-slate-200/50"
                        style={{ backgroundColor: '#FFE0C2', zIndex: 10 }}
                        animate={ hoveredTab ? { y: -2 } : { y: 0 } }
                      />
                      <motion.div 
                        className="absolute bottom-1.5 right-1 w-3 h-3 rounded-full shadow-sm border border-slate-200/50"
                        style={{ backgroundColor: '#FFE0C2', zIndex: 10 }}
                        animate={ hoveredTab ? { y: -2 } : { y: 0 } }
                      />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
