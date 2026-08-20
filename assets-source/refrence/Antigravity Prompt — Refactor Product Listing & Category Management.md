# Task: Refactor and Stabilize Existing Product Listing, Category Management & Storefront Logic

## IMPORTANT CONTEXT

The application already has a working e-commerce implementation with:

- React frontend
- Supabase backend
- Admin Dashboard
- Customer storefront
- Product creation
- Product variants
- Inventory management
- Cart
- Orders

The **Order + Inventory flow has already been audited/fixed separately**.

The established rule is:

> Product → Variant → Inventory → Cart → Order

A customer purchases a **specific variant**, not a generic product.

For example:

```text
Product:
Oversized T-Shirt

Variants:
Black / S → variant_id A → stock 10
Black / M → variant_id B → stock 5
White / S → variant_id C → stock 8
```

The order system uses the exact `variant_id` and validates current stock before creating an order.

### DO NOT REBUILD THE ORDER/INVENTORY SYSTEM.

This task is specifically about making the **Product Listing + Category Management + Storefront Catalog** clean, dynamic, reliable, and compatible with the already-established variant/inventory/order architecture.

---

# 1. FIRST: AUDIT THE EXISTING IMPLEMENTATION

Before changing code, inspect the existing implementation.

Important existing areas include, but are not limited to:

```text
AdminProducts.jsx
Products.jsx
useCombinedProducts.js
ProductCard
Product Detail Page
Category Management
Supabase product tables
Supabase category tables
Variant tables
Image handling
Collection handling
```

Trace the complete current flow:

```text
Admin Category Management
        ↓
Admin Product Creation
        ↓
Product + Category + Variants + Images
        ↓
Supabase
        ↓
useCombinedProducts.js
        ↓
Products.jsx
        ↓
ProductCard
        ↓
Product Detail
        ↓
Variant Selection
        ↓
Cart
        ↓
Existing Order/Inventory Logic
```

Identify where the current implementation:

- duplicates business logic
- hardcodes categories
- transforms category names unnecessarily
- creates fake product metadata
- mixes presentation logic with business logic
- allows incomplete products to become visible
- creates ambiguous variant data
- duplicates price calculations
- duplicates inventory calculations

Do not assume the current architecture is completely wrong.

**Preserve working functionality and refactor only where necessary.**

---

# 2. CORE ARCHITECTURAL PRINCIPLE

The application must follow this rule:

> **Anything the client may change in the future must be stored as data, not hardcoded into React logic.**

This includes:

- Categories
- Subcategories
- Collections
- Product information
- Variants
- Pricing
- Images
- Product status
- New Arrival flags

The React application should consume these values dynamically.

It must NOT contain assumptions such as:

```javascript
if category === "Boy"
```

or:

```javascript
const kidsCategories = [
    "Boys",
    "Girls",
    "Newborn",
    "Unisex"
];
```

or:

```javascript
if category === "Men's Collection"
```

The client should be able to change the catalog structure from the Admin Dashboard without requiring code changes.

---

# 3. CATEGORY MANAGEMENT IS THE SOURCE OF TRUTH

The business currently has two main categories:

```text
Kids
Men
```

There are NO hardcoded "Boy" or "Girl" categories.

The client is expected to manage categories themselves from the Admin Dashboard.

Therefore:

### DO NOT hardcode:

```text
Kids
Men
Boy
Girl
Boys
Girls
Newborn
Women's Collection
Men's Collection
```

as application logic.

The existing Category Management tab should be the source of truth.

The client should be able to:

- Add categories
- Edit categories
- Activate/deactivate categories
- Reorder categories if supported
- Add subcategories if the current system supports hierarchical categories
- Modify category names without breaking product relationships

---

# 4. CATEGORY DATABASE RELATIONSHIP

Inspect the existing category schema first.

If the current schema already supports categories adequately, reuse it.

The desired conceptual model is:

```text
categories

id
name
slug
parent_id
is_active
sort_order
created_at
updated_at
```

If hierarchical categories are supported:

```text
Kids
├── T-Shirts
├── Bottomwear
├── Dresses
└── Nightwear

Men
├── T-Shirts
├── Shirts
├── Jeans
└── Jackets
```

If the client only has:

```text
Kids
Men
```

that is also valid.

The system must not assume that subcategories always exist.

---

# 5. PRODUCTS MUST REFERENCE CATEGORY IDs

A product should reference a category through its ID.

Conceptually:

```text
products

id
title
slug
description
brand
category_id
original_price
discount_percentage
selling_price
fabric
care_instructions
shipping_information
status
is_new_arrival
created_at
updated_at
```

The important relationship is:

```text
products.category_id
        ↓
categories.id
```

Do NOT use category name strings as the primary relationship.

Do NOT create frontend mappings such as:

```text
"Boy" → "Boys"
```

The database relationship must be authoritative.

---

# 6. REMOVE THE CURRENT CATEGORY TRANSLATION LAYER

The current implementation uses:

```text
useCombinedProducts.js
```

to normalize/translate category names before sending data to the UI.

For example:

```text
"Boy" → "Boys"
```

This approach must be removed or minimized.

`useCombinedProducts.js` should NOT be responsible for deciding what category a product belongs to.

Instead, if this hook is retained, its responsibility should be limited to:

```text
Fetch products
Fetch related categories
Fetch variants
Fetch images
Normalize database response
Return clean product data
```

It should NOT:

- invent categories
- rename categories
- assign products to Kids/Men based on strings
- generate fake popularity
- generate fake trending labels
- contain hardcoded category arrays

---

# 7. PRODUCT CREATION FLOW

The existing `AdminProducts.jsx` already supports:

### Basic Details

- Title
- Brand/Vendor
- Description
- Fabric
- Care instructions
- Shipping instructions

Keep this functionality.

### Pricing

The existing pricing engine supports:

```text
Original Price
Discount Percentage
        ↓
Selling Price
```

Keep this functionality.

The final price calculation must be consistent.

---

# 8. VARIANT MATRIX MUST REMAIN

The current Variant Matrix is a strong part of the existing implementation and should be preserved.

Admin selects:

```text
Colors:
Black
White

Sizes:
S
M
L
XL
```

The system generates:

```text
Black / S
Black / M
Black / L
Black / XL

White / S
White / M
White / L
White / XL
```

Each combination represents one unique purchasable variant.

Conceptually:

```text
product_variants

id
product_id
color
color_hex
size
sku
price_override
stock_quantity
```

---

# 9. VARIANT UNIQUENESS

Ensure the system cannot create duplicate variants for the same product.

Conceptually:

```text
UNIQUE(product_id, color, size)
```

For example, this must NOT be possible:

```text
Black / M
Black / M
```

Also ensure SKUs are unique.

Conceptually:

```text
UNIQUE(sku)
```

If the current database already has suitable constraints, preserve them.

If not, add them carefully.

---

# 10. INVENTORY RELATIONSHIP

The Order + Inventory system has already established that:

> Inventory belongs to the specific variant.

Therefore:

```text
Product
   ↓
Variant
   ↓
Stock
```

Example:

```text
Black / M → stock 10
White / M → stock 3
```

Do NOT use a single product stock value for purchasing.

The existing product-level stock may continue to exist as an aggregate:

```text
product stock =
SUM(all variant stock)
```

but it must NOT be the source of truth for customer purchases.

The exact variant stock remains authoritative.

---

# 11. PRODUCT PUBLISHING

Do not automatically expose every saved product to customers.

Introduce or strengthen a product lifecycle:

```text
draft
published
archived
```

### Draft

Admin is still creating/editing the product.

Customer cannot see it.

### Published

Product appears on the storefront.

### Archived

Product is removed from normal storefront browsing but historical orders remain intact.

Do not physically delete products that may be referenced by historical orders.

---

# 12. PUBLISH VALIDATION

Before allowing a product to become `published`, validate:

```text
✓ Title exists
✓ Category exists
✓ Category is active
✓ Product has valid pricing
✓ Product has at least one variant
✓ Every variant has valid color
✓ Every variant has valid size
✓ Every variant has a unique SKU
✓ Every variant has valid price
✓ Every variant has stock >= 0
✓ Product has required image(s)
```

If validation fails:

```text
Product remains draft
```

and the admin should receive a clear explanation of what is missing.

Do not allow an incomplete product to become purchasable.

---

# 13. PRICE OVERRIDE RULE

The existing system supports variant-specific price overrides.

Keep this feature.

The rule must be unambiguous:

```text
If variant.price_override exists:
    effective_price = variant.price_override

Otherwise:
    effective_price = product.selling_price
```

Do not allow:

- ProductCard to calculate one price
- Product detail to calculate another
- Cart to calculate another
- Order system to calculate another

The effective price should be clearly defined.

The final order price must still be validated by the trusted backend/database flow.

---

# 14. IMAGE MANAGEMENT

Preserve the existing ability to:

- Upload up to 7 images
- Use Cloudinary/direct URL
- Reorder images
- Set the first/main image
- Associate specific images with variants if already supported

Make sure image ownership is clear.

Conceptually:

```text
Product
 ├── Product Images
 │
 └── Variant Images
       ├── Black
       └── White
```

Do not break the existing image upload functionality.

---

# 15. COLLECTIONS MUST BE DATA-DRIVEN

The current product supports seasonal collections:

```text
Summer
Winter
Monsoon
Festive
```

If collections are currently hardcoded, refactor them into database-managed entities if the existing architecture supports this cleanly.

Conceptually:

```text
collections

id
name
slug
is_active
sort_order
created_at
updated_at
```

The client should eventually be able to create:

```text
Summer 2026
Festive
Back to School
Winter
Clearance
```

without developer intervention.

Do not hardcode seasonal collection names into storefront logic.

---

# 16. NEW ARRIVAL

Keep the existing:

```text
is_new_arrival
```

flag if it is stored in the database and controlled by admin.

This is legitimate product metadata.

---

# 17. REMOVE FAKE BEST SELLER / TRENDING LOGIC

The current bridge logic uses placeholder calculations such as:

```text
every 2nd/3rd product
```

to assign:

- Best Seller
- Trending

This must be removed.

Do NOT randomly assign merchandising badges.

If actual sales analytics already exist, use them.

Otherwise:

```text
Best Seller → do not display until backed by real sales data
Trending → do not display until backed by real metrics
```

Do not generate fake customer-facing business data.

---

# 18. STOREFRONT CATEGORY TABS MUST BE DYNAMIC

The current `Products.jsx` must NOT contain:

```javascript
kidsCategories = [...]
maleCategories = [...]
femaleCategories = [...]
```

Instead:

```text
Fetch active categories
        ↓
Render categories dynamically
```

If the database currently contains:

```text
Kids
Men
```

the storefront should display:

```text
All | Kids | Men
```

If the client later adds:

```text
Accessories
```

the storefront automatically becomes:

```text
All | Kids | Men | Accessories
```

No code change.

---

# 19. CATEGORY FILTERING

Filtering should work using category IDs, not category-name matching.

Conceptually:

```text
selectedCategoryId
        ↓
products.category_id
        ↓
matching products
```

If hierarchical categories exist, support parent/child filtering using database relationships.

Do not implement logic such as:

```javascript
product.category.includes("Kids")
```

unless there is a genuine search requirement.

Prefer relational filtering.

---

# 20. SEARCH

Preserve the current product-name search.

At minimum:

```text
Search
 ↓
product title
```

It may later expand to:

```text
title
brand
description
category
SKU
```

but do not overcomplicate this refactor unnecessarily.

---

# 21. AGE FILTER

The current storefront has age filtering such as:

```text
0-2 Years
3-5 Years
```

Do NOT mix age with category.

Category:

```text
Kids
```

Age:

```text
3-5 Years
```

Size:

```text
4-5Y
```

These are separate concepts.

Inspect the existing implementation and preserve it if it is already working.

If age groups are hardcoded but the client needs to manage them in the future, consider moving them to configurable data.

Do not break the current filter while refactoring categories.

---

# 22. PRODUCT CARD RESPONSIBILITY

`ProductCard` should primarily be a presentation component.

It should receive clean product data and display:

```text
Main Image
Title
Effective Price
Original Price
Discount
New Arrival
Availability
```

It should NOT:

- determine category
- invent badges
- calculate fake popularity
- query inventory independently
- modify product data

---

# 23. PRODUCT DETAIL PAGE

The product detail page is the bridge between Product Listing and the existing Order/Inventory system.

When customer selects:

```text
Color = Black
Size = M
```

the frontend must resolve:

```text
variant_id = exact Black/M variant
```

Then Add to Cart should pass:

```text
product_id
variant_id
quantity
```

The Order/Inventory system will handle authoritative validation.

Do not duplicate inventory validation logic unnecessarily in the Product Listing layer.

The UI may disable unavailable variants for better UX, but the backend/database remains authoritative.

---

# 24. PRODUCT AVAILABILITY

Do not treat the parent product as unavailable simply because one variant is out of stock.

Example:

```text
Black / M = 0
White / M = 5
```

Product remains available.

Black/M should be disabled.

White/M remains purchasable.

If all variants are out of stock:

```text
Black / M = 0
White / M = 0
Black / L = 0
```

the product can remain `published`, but the storefront should clearly display:

```text
Out of Stock / Currently Unavailable
```

Do not automatically delete or archive the product because inventory reached zero.

---

# 25. DO NOT DUPLICATE ORDER/INVENTORY LOGIC

The Order + Inventory system already established the following:

```text
Customer
 ↓
Select Variant
 ↓
Cart
 ↓
Checkout
 ↓
Authoritative variant stock validation
 ↓
Order
 ↓
Inventory decrease
```

Product Listing must simply provide clean:

```text
product_id
variant_id
color
size
sku
price
stock/availability
```

Do not create another stock calculation system inside `Products.jsx`.

---

# 26. REFACTOR `useCombinedProducts.js`

After auditing the current implementation, simplify this hook as much as possible.

Its ideal responsibility:

```text
useProducts / useCombinedProducts
│
├── Fetch published products
├── Fetch categories
├── Fetch variants
├── Fetch images
├── Fetch collections
└── Return normalized data
```

It should NOT:

```text
✗ Translate category names
✗ Invent category groups
✗ Create fake Best Sellers
✗ Create fake Trending
✗ Decide Kids/Men based on strings
✗ Modify inventory
✗ Create order logic
```

If the name `useCombinedProducts.js` is no longer meaningful after refactoring, it is acceptable to rename it to something clearer such as:

```text
useProducts.js
```

but only if doing so does not create unnecessary breakage.

---

# 27. REFACTOR `Products.jsx`

`Products.jsx` should mainly handle:

```text
Fetch/display products
Search
Category selection
Filters
Sorting
Pagination if already supported
```

It should NOT contain hardcoded business categories.

Conceptually:

```text
products
categories
        ↓
Products.jsx
        ↓
Search
Category
Age
Collection
Price
Availability
Sort
        ↓
ProductCard
```

---

# 28. KEEP FILTERS SEPARATE FROM DATA NORMALIZATION

Do not put filtering logic inside the product-fetching hook.

Bad architecture:

```text
useCombinedProducts
    ↓
fetch
    ↓
categorize
    ↓
filter
    ↓
sort
    ↓
fake badges
    ↓
return
```

Prefer:

```text
useProducts
    ↓
fetch/normalize
    ↓
Products.jsx
    ↓
filter/sort/search
```

This makes the system easier to debug and maintain.

---

# 29. ADMIN PRODUCT LIST

The admin should be able to see:

```text
Product
Category
Price
Variant Count
Total Stock
Status
Created Date
```

Example:

```text
Oversized T-Shirt
Kids
8 variants
Stock: 42
Published
```

Actions:

```text
Edit
Duplicate
Publish / Unpublish
Archive
```

Do not physically delete products with historical orders.

---

# 30. PRODUCT EDITING

When editing an existing product:

- Preserve product ID.
- Preserve existing variant IDs where possible.
- Do not create duplicate variants unnecessarily.
- Do not silently delete variants that have historical order references.
- Do not reset inventory accidentally.
- Do not change historical order information.

If a variant is no longer sold, prefer marking it inactive/archived rather than destroying historical references.

This is especially important because the Order/Inventory system now depends on stable variant identity.

---

# 31. CRITICAL RELATIONSHIP WITH ORDERS

The final architecture must preserve:

```text
Product
   ↓
Variant
   ↓
Order Item
```

Historical orders should reference the variant that was actually purchased.

Therefore:

**Do not recreate variant IDs every time an admin edits a product.**

Example:

Before editing:

```text
Black / M
variant_id = 123
```

After editing the product title/description/price:

```text
Black / M
variant_id = 123
```

The identity remains stable.

---

# 32. TESTING REQUIREMENTS

After implementation, test the following.

### Test 1 — Dynamic categories

Database:

```text
Kids
Men
```

Expected storefront:

```text
All | Kids | Men
```

Add:

```text
Accessories
```

Expected storefront automatically:

```text
All | Kids | Men | Accessories
```

No code changes.

---

### Test 2 — Category modification

Rename:

```text
Kids
```

to:

```text
Children
```

Expected:

- Existing products remain linked correctly.
- Storefront displays `Children`.
- No products become orphaned.
- No frontend code changes are required.

---

### Test 3 — Product creation

Create:

```text
Oversized T-Shirt
Category: Kids
```

with:

```text
Black / S
Black / M
White / S
White / M
```

Expected:

- Product saved.
- Correct category ID stored.
- Four unique variants created.
- Each variant has its own SKU.
- Each variant has independent stock.

---

### Test 4 — Duplicate variant

Attempt:

```text
Black / M
Black / M
```

Expected:

```text
Rejected
```

No duplicate variant.

---

### Test 5 — Draft product

Create product but do not publish.

Expected:

```text
Visible in Admin
Not visible on storefront
Not purchasable
```

---

### Test 6 — Published product

Publish a valid product.

Expected:

```text
Visible on storefront
Correct category
Correct variants
Correct price
Correct images
Correct stock availability
```

---

### Test 7 — Variant availability

Set:

```text
Black / M = 0
White / M = 5
```

Expected:

```text
Black / M → unavailable
White / M → selectable
```

---

### Test 8 — Product completely out of stock

Set all variants to:

```text
stock = 0
```

Expected:

```text
Product remains published
Customer sees unavailable/out-of-stock state
Customer cannot purchase
```

---

### Test 9 — Product edit

Edit product title/category/description.

Expected:

- Existing product ID remains unchanged.
- Existing variant IDs remain unchanged.
- Inventory remains unchanged unless intentionally modified.
- Existing orders remain unaffected.

---

### Test 10 — Order compatibility

Customer selects:

```text
Black / M
```

Expected cart:

```text
product_id
variant_id
quantity
```

The existing Order/Inventory system must receive the exact variant ID and perform its existing authoritative stock validation.

---

# 33. FINAL ARCHITECTURE

The final data flow should be:

```text
             ADMIN
               │
               ▼
     CATEGORY MANAGEMENT
               │
               ▼
          categories
               │
               ▼
      PRODUCT MANAGEMENT
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
    Product  Variants  Images
       │       │
       │       ▼
       │    Inventory
       │
       ▼
     Publish
       │
       ▼
    SUPABASE
       │
       ▼
  STOREFRONT CATALOG
       │
 ┌─────┼───────────────┐
 ▼     ▼               ▼
Search Category      Filters
       │
       ▼
  Product Card
       │
       ▼
 Product Detail
       │
       ▼
Color + Size
       │
       ▼
 variant_id
       │
       ▼
    CART
       │
       ▼
EXISTING ORDER SYSTEM
       │
       ▼
INVENTORY VALIDATION
       │
       ▼
     ORDER
       │
       ▼
 STOCK DECREASE
```

---

# 34. MOST IMPORTANT RULES

Before considering this task complete, verify these rules:

### Rule 1
**Categories are data, not hardcoded React logic.**

### Rule 2
**Products reference category IDs.**

### Rule 3
**Variants are the actual purchasable entities.**

### Rule 4
**Inventory belongs to variants.**

### Rule 5
**Product-level stock is only an aggregate/reporting value.**

### Rule 6
**Product listing never bypasses the existing Order/Inventory validation.**

### Rule 7
**Category changes from Admin automatically propagate to storefront.**

### Rule 8
**No fake Best Seller/Trending badges.**

### Rule 9
**Product status controls storefront visibility.**

### Rule 10
**Existing product/variant IDs must remain stable when editing.**

### Rule 11
**Do not break existing authentication, Supabase, cart, order, inventory, or image functionality.**

### Rule 12
**Do not rebuild the application from scratch. Audit first, then make targeted changes.**

---

# FINAL INSTRUCTION TO ANTIGRAVITY

Do not start coding immediately.

First inspect the existing Product Listing implementation and produce a short internal implementation plan identifying:

1. Current product schema
2. Current category schema
3. Current variant schema
4. Current image schema
5. Current collection implementation
6. Current `AdminProducts.jsx` responsibilities
7. Current `useCombinedProducts.js` responsibilities
8. Current `Products.jsx` responsibilities
9. Current category hardcoding/mapping
10. Current fake merchandising logic
11. Any conflicts with the already-fixed Order/Inventory architecture

Then implement the refactor.

**Preserve existing working functionality.**

**Do not rebuild the Order/Inventory system.**

**Do not redesign unrelated UI.**

**Do not introduce unnecessary new tables if the existing schema already supports the requirement.**

The final goal is a clean, dynamic, client-manageable product catalog where:

```text
Admin manages categories
        ↓
Admin creates products
        ↓
Products reference category IDs
        ↓
Admin creates valid variants
        ↓
Variants own inventory
        ↓
Admin publishes product
        ↓
Storefront dynamically displays published products
        ↓
Customer selects exact variant
        ↓
Existing Order/Inventory system handles purchase
```

The client should be able to manage the catalog independently without developer intervention for normal category, collection, product, variant, pricing, inventory, or publishing operations.