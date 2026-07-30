import React from 'react';
import CardNav from './CardNav';

export default function Navbar({ onOpenProfile }) {
  const navItems = [
    {
      label: "Shop",
      bgColor: "#FFD800",
      textColor: "#0f172a",
      links: [
        { label: "New Arrivals", href: "/new-arrivals", ariaLabel: "New Arrivals" },
        { label: "All Products", href: "/products", ariaLabel: "All Products" },
        { label: "Kids Wear", href: "/kids", ariaLabel: "Kids Wear" },
        { label: "Best Sellers", href: "/products", ariaLabel: "Best Sellers" }
      ]
    },
    {
      label: "Explore",
      bgColor: "#AEE6FF",
      textColor: "#0f172a",
      links: [
        { label: "About Us", href: "/about-us", ariaLabel: "About Us" },
        { label: "Why Choose Us", href: "/why-us", ariaLabel: "Why Choose Us" },
        { label: "Contact Us", href: "/contact-us", ariaLabel: "Contact Us" }
      ]
    },
    {
      label: "Business",
      bgColor: "#EF4A45",
      textColor: "#ffffff",
      links: [
        { label: "Distributors", href: "/distributor-network", ariaLabel: "Distributors" }
      ]
    }
  ];

  return (
    <div className="sticky top-0 w-full h-[96px] md:h-[96px] max-md:h-[72px] bg-[#FFF8EC] block select-none z-50 shadow-sm">
      <CardNav
        items={navItems}
        baseColor="transparent"
        menuButtonColor="#2D2D2D"
        openMenuButtonColor="#EF4A45"
        accentColor="#EF4A45"
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
}
