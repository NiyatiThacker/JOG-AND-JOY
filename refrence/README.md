# Joy & Joy - Premium E-commerce Storefront

Welcome to the Joy & Joy storefront repository! This project is a modern, high-fidelity e-commerce platform built with React, Vite, and TailwindCSS.

## 🚀 Recent UI Overhaul & Features

We recently pushed a major visual and interactive overhaul to the storefront:

### 1. Vibrant Theme Standardization
- Overhauled the **Women (`/women`)** page, dropping the minimalist black & white style in favor of a vibrant, colorful aesthetic (Misty Rose pastel overlays, bright highlights) to perfectly match the Men's and Kids' sections.
- Upgraded the **New Arrivals** "Shop By Department" banners with extremely vivid Tailwind colors (Sky Blue, Indigo, Rose).
- Updated the global **Shop All (`/products`)** catalog page to utilize the premium, editorial-style product cards (with "Add to Tote" hover effects) established in the category pages.

### 2. Interactive Wishlist & Micro-Animations
- Implemented a "popping" scale micro-animation on all product card heart icons when a user adds an item to their wishlist.
- Added a one-click **"Clear All"** button to the main Wishlist page.

### 3. Global Pagination
- Implemented strict, interactive 16-item pagination across the **Men, Women, Kids, and New Arrivals** pages.
- Engineered a smooth auto-scroll to snap users perfectly back to the top of the product grid upon changing pages.

### 4. Inline Expandable Filtering
- Rebuilt the global **Shop All** page's filtering system. Clicking the "Filters" button now seamlessly expands an interactive, inline UI pane displaying clickable pill buttons for Main Categories and Age Groups, instantly sorting the 4-column grid.

---

## 🚀 Previous Feature Implementations (Feature Branch: feature-dharmendra)

We completely overhauled the storefront's navigation, visual fidelity, and cart experience. 

### 1. Dedicated Category Pages
Replaced standard generic filters with beautiful, bespoke landing pages for each major department:
- **Kids (`/kids`)**: Playful mint-green aesthetic featuring age-group navigation and "cute" imagery curation.
- **Men (`/men`)**: Dark moss green and neon yellow theme featuring a dynamic infinite horizontal marquee.
- **Women (`/women`)**: Vibrant pastel rose aesthetic with a 4-pane asymmetrical bento grid.
- **New Arrivals (`/new-arrivals`)**: A hybrid layout highlighting the newest inventory drops.

### 2. Premium "Fly-to-Cart" Animation
Implemented a global Web Animations API (WAAPI) effect. Whenever a user clicks **Add to Bag** on any product card, quick-view modal, or details page, a miniature version of the product image physically flies across the screen into the Shopping Bag icon, providing highly satisfying user feedback.

### 3. Dedicated Cart Page
Upgraded from a simple slide-out drawer to a full-page Cart UI (`/cart`):
- Tabular item layout with thumbnail, color/size variants, and interactive quantity adjusters.
- A sticky Order Summary pane with dynamic subtotal, shipping, and discount calculations.
- Integrated coupon logic.
- Quick-delete Trash icon functionality.

### 4. Distributor Network Portal
Added a brand new `DistributorNetworkPage` (`/distributor-network`) to facilitate global B2B partnerships with a beautiful, 3-column value proposition layout.

### 5. Architectural & UX Enhancements
- **Category Navigation**: Built the `CategoryCircles` component for highly visual cross-department navigation (Men, Women, Kids) on the Homepage.
- **Global Scroll-to-Top**: Engineered a zero-touch, global interception layer that smoothly scrolls users back to the top of the page if they click a navigation link pointing to the page they are currently on.
- **Data Filtering Strictness**: Enforced strict `useMemo` filtering across all pages to ensure no cross-contamination of products between Kids, Men, and Women departments.
- **Image Standardization**: Upgraded all hero banners, product fallback images, and category circles to premium, high-quality Unsplash assets.

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
