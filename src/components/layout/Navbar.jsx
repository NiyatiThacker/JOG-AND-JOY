import React from 'react';
import StaggeredMenu from './StaggeredMenu';
import { useAuth } from '../../context/AuthContext';
export default function Navbar({ onOpenProfile }) {
  const { user } = useAuth();
  const menuItems = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: "New Arrivals", link: "/new-arrivals" },
    { label: "Kids Wear", link: "/kids" },
    { label: "About Us", link: "/about-us" },
    { label: "Why Choose Us", link: "/why-us" },
    { label: "Contact Us", link: "/contact-us" },
    { label: "Distributors", link: "/distributor-network" },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ label: "Admin Dashboard", link: "/admin" });
  }

  const socialItems = [
    { label: 'Instagram', link: 'https://instagram.com/jognjoy' },
    { label: 'Facebook', link: 'https://facebook.com/jognjoy' },
    { label: 'WhatsApp', link: 'https://wa.me/917922139665' }
  ];

  return (
    <div className="relative w-full h-[96px] md:h-[96px] max-md:h-[72px] bg-[#FFF8EC] block select-none z-40">
      <StaggeredMenu
        position="left"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#2D2D2D"
        openMenuButtonColor="#EF4A45"
        changeMenuColorOnOpen={true}
        colors={['#FFD800', '#AEE6FF', '#EF4A45']}
        accentColor="#EF4A45"
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
}
