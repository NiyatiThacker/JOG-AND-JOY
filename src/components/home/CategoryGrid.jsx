import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ChevronLeft, ChevronRight, ShoppingBag, Check, Sparkles, ArrowRight } from "lucide-react";

const freshArrivalsSection = {
  eyebrow: "NEW ARRIVALS",
  heading: "Trending Activewear & Essentials",
  ctaLabel: "Shop All Products",
  ctaHref: "/products"
};

const products = [
  {
    id: "p1",
    name: "Speedster Quick-Dry Sports Tee",
    categoryName: "KIDS T-SHIRTS",
    description: "Moisture-wicking active tee with micro-ventilation channels. Keeps...",
    price: 599,
    variants: [1, 2, 3], // used for size count
    images: ["https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "kids",
    slug: "speedster-tee",
    isBestSeller: true
  },
  {
    id: "p2",
    name: "Flex-Knee Fleece Cuffed Joggers",
    categoryName: "KIDS JOGGERS & TRACK PANTS",
    description: "Featuring double-stitched knee patches for extra abrasion...",
    price: 799,
    variants: [1, 2, 3, 4],
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "kids",
    slug: "flex-knee-joggers",
    isNewArrival: true
  },
  {
    id: "p3",
    name: "Breezy-Deck Elastic Bermuda",
    categoryName: "KIDS SHORTS & BERMUDAS",
    description: "Everyday summer bermudas engineered with 4-way stretch...",
    price: 549,
    variants: [1, 2, 3],
    images: ["https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "kids",
    slug: "breezy-bermuda",
    isBestSeller: true
  },
  {
    id: "p4",
    name: "Comfy Cotton Night Suit Set",
    categoryName: "KIDS NIGHT & PAJAMA SUITS",
    description: "Ultra-soft breathable cotton set for a cozy night sleep.",
    price: 899,
    variants: [1, 2, 3, 4],
    images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "kids",
    slug: "cotton-night-suit",
    isNewArrival: true
  },
  {
    id: "p5",
    name: "Vibrant Casual Active Frock",
    categoryName: "GIRLS' FROCKS",
    description: "Stylish and comfortable frock for everyday play.",
    price: 999,
    variants: [1, 2, 3, 4],
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "girls",
    slug: "vibrant-active-frock",
    isBestSeller: true
  },
  {
    id: "p6",
    name: "Sunshine Twirl Tiered Cotton Frock",
    categoryName: "GIRLS' FROCKS",
    description: "Flowy, twirl-tested A-line frock crafted from lightweight breathab...",
    price: 749,
    variants: [1, 2, 3, 4],
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"], // Using similar frock image
    categorySlug: "girls",
    slug: "sunshine-twirl-frock",
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "p7",
    name: "Blooming Meadow Printed Dress",
    categoryName: "GIRLS' FROCKS",
    description: "Bright floral print casual dress featuring smocked bodice stretch...",
    price: 799,
    variants: [1, 2, 3],
    images: ["https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "girls",
    slug: "blooming-meadow-dress",
    isNewArrival: true
  },
  {
    id: "p8",
    name: "Play-Pro Organic Cotton Graphic Tee",
    categoryName: "KIDS T-SHIRTS",
    description: "Built for nonstop playgrounds and weekend adventures. Crafted fro...",
    price: 499,
    variants: [1, 2, 3, 4],
    images: ["https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80"], // Using similar tee image
    categorySlug: "kids",
    slug: "play-pro-organic-tee",
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "p9",
    name: "Dino Print Cozy Romper",
    categoryName: "NEWBORN ESSENTIALS",
    description: "Soft and snuggly romper with cute dinosaur prints for your little one.",
    price: 549,
    variants: [1, 2],
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "newborn",
    slug: "dino-print-romper",
    isBestSeller: true
  },
  {
    id: "p10",
    name: "Classic Denim Dungarees",
    categoryName: "KIDS JOGGERS & TRACK PANTS",
    description: "Durable and stylish denim overalls for everyday wear.",
    price: 1199,
    variants: [1, 2, 3, 4, 5],
    images: ["https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"],
    categorySlug: "kids",
    slug: "classic-denim-dungarees",
    isNewArrival: true
  }
];

export default function CategoryGrid() {
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const animFrameRef = useRef(null);

  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const total = products.length || 1;
  const angleStep = 360 / total;

  // Auto rotation
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      if (!isDragging) {
        const delta = (time - lastTime) / 1000;
        setRotation((prev) => (prev - delta * 6) % 360);
      }
      lastTime = time;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging]);

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + total) % total;
    setActiveIndex(nextIdx);
    setRotation(-nextIdx * angleStep);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % total;
    setActiveIndex(nextIdx);
    setRotation(-nextIdx * angleStep);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRotationRef.current = rotation;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startXRef.current;
    const newRot = startRotationRef.current + diffX * 0.35;
    setRotation(newRot);

    // Calculate nearest active card
    const normalized = ((-newRot % 360) + 360) % 360;
    const index = Math.round(normalized / angleStep) % total;
    setActiveIndex(index);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
    setRotation(-index * angleStep);
  };

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        id: product.id,
        name: product.name,
        category: product.categoryName,
        price: product.price,
        image: product.images[0]
      },
      undefined,
      undefined,
      e
    );

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const activeProduct = products[activeIndex] || products[0];

  return (
    <section
      className="fresh-arrivals-section"
      style={{
        position: "relative",
        backgroundColor: "#FAF7F2",
        padding: "80px 0 100px",
        overflow: "hidden",
      }}
    >
      {/* Multi-color Doodle Pattern Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #f4a2b3 0%, #f26b3a 35%, #f7c844 70%, #fbd7c8 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/category_section.jpeg)",
            backgroundSize: "350px",
            backgroundRepeat: "repeat",
            mixBlendMode: "screen",
            filter: "grayscale(1) contrast(1.8)",
            opacity: 0.8,
          }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4" style={{ position: "relative", zIndex: 2 }}>
        {/* Section Header with Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "64px",
            gap: "16px",
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{
                textAlign: "left",
                color: "#E05A47",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                margin: 0,
              }}
            >
              <Sparkles size={14} /> {freshArrivalsSection.eyebrow}
            </span>
            <h2
              className="section-heading"
              style={{
                textAlign: "left",
                margin: "6px 0 0 0",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: 900,
                color: "#2C302E",
              }}
            >
              {freshArrivalsSection.heading}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Manual Scroll Arrows */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handlePrev}
                aria-label="Previous product"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #EADBCE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#2C302E",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next product"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #EADBCE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#2C302E",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <Link
              to={freshArrivalsSection.ctaHref}
              className="btn"
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "0.92rem",
                backgroundColor: "#E05A47",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "white",
                textDecoration: "none",
                fontWeight: 700
              }}
            >
              {freshArrivalsSection.ctaLabel} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Circular Gallery Stage */}
      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "#666" }}>
          Loading products gallery...
        </div>
      ) : (
        <div
          className="circular-3d-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            position: "relative",
            width: "100%",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "2500px",
            transformStyle: "preserve-3d",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            zIndex: 1,
            marginTop: "20px",
            paddingTop: "20px",
          }}
        >
          <div
            className="circular-3d-ring"
            style={{
              position: "absolute",
              width: "240px",
              height: "380px",
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg) rotateX(0deg)`,
              transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {products.map((product, idx) => {
              const itemAngle = idx * angleStep;
              const isSelected = activeIndex === idx;

              return (
                <div
                  key={product.id}
                  onClick={() => handleCardClick(idx)}
                  className="product-3d-card"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "240px",
                    height: "380px",
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1.5px solid #EADBCE",
                    boxShadow: isSelected
                      ? "0 16px 36px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)"
                      : "0 6px 18px rgba(0, 0, 0, 0.05)",
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${itemAngle}deg) translateZ(420px)`,
                    transition: "transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  {/* Product Image & Badges */}
                  <Link
                    to={`/product/${product.id}`}
                    onClick={(e) => {
                      if (isDragging) e.preventDefault();
                    }}
                    style={{
                      position: "relative",
                      display: "block",
                      width: "100%",
                      height: "180px",
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        zIndex: 2,
                      }}
                    >
                      {product.isNewArrival && (
                        <span
                          style={{
                            backgroundColor: "#E05A47",
                            color: "#ffffff",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          New Arrival
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span
                          style={{
                            backgroundColor: "#FEF8E7",
                            color: "#D97706",
                            border: "1px solid #FDE6B5",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "10px",
                            textTransform: "uppercase",
                          }}
                        >
                          Bestseller
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Details & Actions */}
                  <div
                    style={{
                      padding: "12px 14px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: "#3B82F6",
                          letterSpacing: "0.05em",
                          display: "block",
                          marginBottom: "2px",
                        }}
                      >
                        {product.categoryName}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        style={{ textDecoration: "none", color: "#2C302E" }}
                      >
                        <h3
                          style={{
                            fontSize: "0.92rem",
                            fontWeight: 800,
                            margin: "0 0 2px 0",
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "#666666",
                          lineHeight: 1.3,
                          margin: "0 0 8px 0",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#2C302E" }}>
                          ₹{product.price}
                        </span>
                        <span style={{ fontSize: "0.76rem", color: "#777777", fontWeight: 600 }}>
                          {product.variants.length} Sizes
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          backgroundColor: addedId === product.id ? "#2E7D32" : "#2C302E",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={15} /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} /> Quick Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Hint */}
      <div style={{ textAlign: "center", marginTop: "65px", position: "relative", zIndex: 10 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 22px",
            borderRadius: "30px",
            backgroundColor: "#ffffff",
            border: "1.5px solid #EADBCE",
            color: "#555555",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <Sparkles size={14} color="#E05A47" /> Drag or click arrows to explore 3D gallery
        </span>
      </div>
    </section>
  );
}
