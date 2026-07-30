# Changelog: Feature Enhancements & Bug Fixes

## Wishlist & Cart Enhancements
- **Wishlist Variant Tracking**: Upgraded the Wishlist context to store complete variant objects (`{id, size, color}`) instead of just product IDs.
- **Product Card & Quick View Integration**: Modified `ProductCard` and `QuickViewModal` components to accurately pass selected sizes and colors into the Wishlist.
- **Wishlist Rendering**: Updated the Wishlist page (`Wishlist.jsx`) to safely parse variant objects and populate `ProductCard` defaults, ensuring customers see the exact variants they saved.

## Order & Checkout Fixes
- **Cart Payload Mapping**: Resolved a bug in `Checkout.jsx` where Cart items were losing their size and color attributes. The checkout process now accurately reads `item.size` and `item.color`, allowing the Admin Order Panel to correctly render the purchased variants.

## Review Moderation Enhancements
- **Admin Bypass Feature**: Implemented a secret bypass for store admins. Submitting a review with the email `admin@jogandjoy.com` skips the strict Order ID validation and automatically sets the review status to "Approved".
- **Order Details on Review Panel**: Enhanced the Admin Reviews sidebar (`AdminReviews.jsx`) to perform a cross-reference lookup using the associated Order ID. When a review is clicked, it dynamically fetches and displays the full purchase context (Order Date, Status, Shipping Name, and detailed items).
- **Merchant Reply Feedback**: Improved the UX of the merchant reply functionality. Submitting a public reply to an approved review now provides a clear visual success indicator ("✓ Reply Posted!").

## Product & Admin Upgrades
- **Global Stock Registration**: Updated the Product Registration form (`AdminProducts.jsx`) to securely map the `Total Stock` input field to the global `product.stock` payload, moving away from relying purely on variant matrices.
- **Missing Hooks Restored**: Reintroduced the accidentally stripped `quickViewProduct` state variables in `ProductDetails.jsx`, resolving a critical React ReferenceError crash on the storefront.
- **Strict React Hook Flow**: Resolved a `Rendered more hooks than during the previous render` crash in `ProductDetails.jsx` by correctly moving all `useEffect` declarations above early conditional returns (`if (isLoading)`).
