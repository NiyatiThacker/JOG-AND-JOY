# Task: Audit and Fix Existing Product, Variant, Inventory & Order Flow

## Important Context

This e-commerce application already has an existing product, cart, order, inventory, Supabase backend, and admin dashboard implementation.

**DO NOT rebuild the entire system from scratch.**

The existing logic may be partially working, but it is currently too vague/inconsistent. For example:

- Customers can sometimes order products/variants that are not actually available.
- Inventory availability is not being enforced reliably.
- Stock may not be correctly connected to the exact product variant.
- The current product listing implementation may also have issues, but **DO NOT work on product listing yet**.
- Existing working functionality should be preserved wherever possible.

Your first responsibility is to **inspect and understand the current implementation**, identify where the existing logic breaks, and then make the minimum necessary architectural/code changes to establish a reliable Product → Variant → Inventory → Cart → Order flow.

---

# 1. First: Audit the Existing Implementation

Before changing code, inspect:

- Supabase database schema
- `products` table
- Any existing product variants table
- Inventory/stock-related tables or fields
- Cart tables/logic
- Orders table
- Order items table
- Product detail page
- Add-to-cart logic
- Checkout logic
- Order creation logic
- Admin product management
- Admin inventory management
- Any Supabase RPC/functions
- API/server-side logic
- RLS policies
- Frontend validation
- Backend/database validation

Trace the complete flow:

```text
Admin Product
      ↓
Product Variant
      ↓
Inventory
      ↓
Customer Product Page
      ↓
Color + Size Selection
      ↓
Cart
      ↓
Checkout
      ↓
Order
      ↓
Order Item
      ↓
Inventory Update
```

Identify exactly where the current implementation allows invalid purchases.

Do not assume that the frontend is the only problem. Check database constraints, Supabase queries, RPCs/functions, and RLS policies as well.

---

# 2. Establish the Correct Data Model

The core concept must be:

> A product is the parent entity.  
> A specific color + size combination is a purchasable variant.  
> Inventory belongs to the variant, not simply to the parent product.

Example:

```text
Product:
Oversized Cotton T-Shirt

Variants:

Black / S → Stock 10
Black / M → Stock 15
Black / L → Stock 8
Black / XL → Stock 5

White / S → Stock 12
White / M → Stock 20
White / L → Stock 7
White / XL → Stock 3
```

A customer is never purchasing only:

```text
product_id = 101
```

They are purchasing:

```text
product_id = 101
variant_id = specific Black/M variant
quantity = 2
```

The `variant_id` must therefore be the authoritative reference for inventory.

---

# 3. Existing Database Schema: Adapt, Don't Blindly Replace

Inspect the current schema first.

If equivalent tables already exist, reuse them rather than creating duplicate tables.

The desired conceptual structure is:

```text
products
    ↓
product_variants
    ↓
inventory
```

And:

```text
orders
    ↓
order_items
    ↓
product_variants
```

A product should contain common information such as:

```text
products

id
name
description
category
base_price
status
created_at
updated_at
```

A variant should represent the actual purchasable combination:

```text
product_variants

id
product_id
color
size
sku
price
stock_quantity
```

If the current database uses a different structure, map the existing structure to this concept rather than duplicating data unnecessarily.

---

# 4. Variant Is the Inventory Source of Truth

This is critical.

If the customer selects:

```text
Color: Black
Size: M
Quantity: 2
```

The system must resolve the exact corresponding variant:

```text
product_id = 101
variant_id = X
color = Black
size = M
```

Then check the stock of **that exact variant**.

Do NOT check only:

```text
product.stock
```

because a parent product may have stock while the selected variant is out of stock.

Example:

```text
Black / S → 10
Black / M → 0
White / M → 15
```

The customer must NOT be able to purchase:

```text
Black / M
```

just because the overall product has stock.

---

# 5. Customer Product Page

Inspect the existing product detail page.

When a customer selects:

```text
Black
M
```

the frontend must resolve the corresponding variant.

The selected cart item must contain enough information to identify the exact variant, preferably:

```text
product_id
variant_id
quantity
```

Do not rely only on:

```text
product_id + color + size
```

if a stable `variant_id` already exists.

The variant ID should be the primary reference.

---

# 6. Add-to-Cart Validation

When adding an item to cart:

```text
Customer selects variant
        ↓
Resolve variant
        ↓
Check variant exists
        ↓
Check variant belongs to selected product
        ↓
Check stock > 0
        ↓
Check requested quantity <= available stock
        ↓
Add/update cart
```

Invalid examples must be rejected:

```text
Variant does not exist
Variant belongs to another product
Variant is inactive
Variant stock = 0
Requested quantity > available stock
```

Do not rely only on UI disabling.

For example, hiding the "Add to Cart" button is NOT sufficient.

The backend/database must also reject invalid purchases.

---

# 7. Checkout Validation

This is even more important.

Even if the cart was valid when created, inventory may have changed before checkout.

Example:

```text
Stock = 2

Customer A adds 2 to cart.

Customer B purchases those 2.

Stock = 0

Customer A now attempts checkout.
```

Customer A must NOT be allowed to create the order.

Therefore, checkout/order creation must revalidate inventory.

The authoritative validation must happen as close as possible to the database transaction that creates the order.

---

# 8. Order Creation Must Be Atomic

Do not implement order creation as a loose sequence where the frontend performs:

```text
1. Check stock
2. Create order
3. Create order items
4. Update stock
```

with independent client-side requests if that can result in race conditions.

Instead, use a secure server-side/Supabase PostgreSQL transaction or RPC/function where appropriate.

Conceptually:

```text
START TRANSACTION

For every requested order item:

    Find exact variant

    Verify variant exists

    Verify variant is purchasable

    Verify stock >= requested quantity

    If ANY item fails:
        Reject entire order

    Otherwise:
        Create order
        Create order items
        Decrease variant inventory

COMMIT
```

If one item is unavailable, the order should not be partially created.

---

# 9. Inventory Update

Example:

Current:

```text
Black / M
stock_quantity = 15
```

Customer purchases:

```text
quantity = 2
```

After successful order:

```text
stock_quantity = 13
```

Only the purchased variant should change.

Do NOT decrease stock from the parent product.

Do NOT decrease stock from every color/size.

Do NOT decrease stock when merely viewing a product.

Do NOT decrease stock when merely adding to cart unless the existing architecture explicitly implements reservations.

---

# 10. Prevent Negative Inventory

The database must never allow:

```text
stock_quantity < 0
```

For example:

```text
Stock = 2
Customer requests = 5
```

The order must fail.

It must NOT produce:

```text
stock = -3
```

The validation should happen atomically so simultaneous orders cannot both successfully purchase the same final stock.

---

# 11. Cart Must Not Be the Inventory Source of Truth

The cart is only a temporary customer selection.

Example:

```text
Cart:
Black / M × 2
```

does NOT mean the inventory is automatically reduced by 2.

For the current implementation, use:

```text
Cart
   ↓
Checkout
   ↓
Validate current stock
   ↓
Create successful order
   ↓
Decrease inventory
```

If the existing application already implements inventory reservations, inspect and preserve that system if it is correct. Otherwise, do not introduce reservations unnecessarily in this phase.

---

# 12. Order Items Must Preserve Purchase Information

When creating an order, `order_items` should preserve the information relevant to that historical purchase.

Conceptually:

```text
order_items

id
order_id
product_id
variant_id
product_name
sku
color
size
quantity
unit_price
total_price
```

The important point is that historical orders must not unexpectedly change if the admin later edits the product.

Example:

Customer purchases:

```text
Black / M
₹1299
```

Later admin changes the product price to:

```text
₹1499
```

The old order must still show:

```text
₹1299
```

Use the existing schema where possible, but preserve this historical snapshot behavior.

---

# 13. Admin Inventory Management

Inspect the current admin dashboard.

The admin should be able to see inventory at the **variant level**.

Example:

```text
Product: Oversized Cotton T-Shirt

------------------------------------------------
Color    Size    SKU          Stock    Status
------------------------------------------------
Black    S       TSH-BLK-S    10       In Stock
Black    M       TSH-BLK-M    2        Low Stock
Black    L       TSH-BLK-L    8        In Stock
Black    XL      TSH-BLK-XL   0        Out of Stock
White    S       TSH-WHT-S    12       In Stock
White    M       TSH-WHT-M    20       In Stock
------------------------------------------------
```

If the current admin UI already provides variant stock management, fix its underlying logic rather than rebuilding the UI.

---

# 14. Low Stock / Out of Stock

The system should derive availability from variant inventory.

Conceptually:

```text
stock > low_stock_threshold
    → In Stock

stock > 0 AND stock <= low_stock_threshold
    → Low Stock

stock = 0
    → Out of Stock
```

Do not let the frontend manually maintain an independent availability state that can become inconsistent with Supabase.

The database stock should be authoritative.

---

# 15. Product Availability

A parent product can be considered available if at least one purchasable variant has stock.

Example:

```text
Black / S = 0
Black / M = 0
White / S = 5
```

The product itself can still be displayed because:

```text
White / S
```

is available.

But the customer must NOT be able to select:

```text
Black / M
```

and place an order.

The UI should ideally indicate unavailable variants and prevent their selection, but the backend/database must still enforce the rule.

---

# 16. Order Status and Inventory

Do not confuse:

**Order status**

with

**Inventory status**

For example:

```text
Order:
Pending
Confirmed
Processing
Shipped
Delivered
Cancelled
Returned
```

Inventory is separate.

For the current implementation, establish a clear rule for when inventory is deducted.

If payment is already implemented, use the application's existing payment-success point as the trigger for the final inventory deduction.

Do not randomly deduct inventory when the order is merely created if payment can still fail.

Inspect the existing payment/order flow and integrate the inventory update at the correct successful-purchase point.

---

# 17. Cancellation / Return Safety

Inspect existing cancellation and return logic.

If an already purchased order is cancelled or returned, inventory may need to be restored depending on the business rules.

Do NOT automatically implement complicated return/restock behavior if it does not already exist.

For this phase, at minimum make sure the new inventory logic does not accidentally double-decrease stock when an order status changes.

Example of a bug to avoid:

```text
Order created
→ stock -2

Order confirmed
→ stock -2 again

Order shipped
→ stock -2 again
```

Inventory should only be changed according to one clearly defined inventory transaction point.

---

# 18. Inventory Transaction History

If the existing architecture already has inventory history, inspect and use it.

If not, consider adding a lightweight transaction/audit mechanism rather than only modifying the final stock number.

Conceptually:

```text
+20 → RESTOCK
-2  → SALE
+2  → CANCELLATION/RESTOCK
-1  → MANUAL_ADJUSTMENT
```

This is useful for debugging and admin auditing.

Do not introduce a large unnecessary subsystem if the current application does not need it.

---

# 19. Security

This is a critical requirement.

The customer frontend must NOT be trusted to say:

```text
"I bought quantity = 1"
```

or:

```text
"Stock is available"
```

The database/server must independently determine:

```text
Which variant?
What is its current stock?
What quantity is allowed?
What price should be recorded?
```

Check the existing Supabase RLS policies and database functions.

Customers should not be able to directly manipulate:

```text
stock_quantity
order totals
product prices
order status
```

through client-side requests.

Admin-only operations should remain protected by the existing authentication/authorization system.

---

# 20. Important: Do NOT Work on Product Listing Yet

There is likely a separate issue with the product listing/catalog creation logic.

Leave that for the next phase.

For this task, assume the product/variant data already exists in Supabase and focus on making this flow reliable:

```text
Existing Product
      ↓
Existing Variant
      ↓
Existing Inventory
      ↓
Customer Selection
      ↓
Cart
      ↓
Checkout
      ↓
Inventory Validation
      ↓
Order Creation
      ↓
Inventory Deduction
```

Do not redesign the admin product creation/listing workflow unless a change is absolutely required to make the inventory/order relationship function correctly.

---

# 21. Testing Requirements

After implementing the fixes, test these scenarios.

### Test 1 — Normal purchase

```text
Stock = 10
Customer buys 2

Expected:
Order succeeds
Stock = 8
```

### Test 2 — Exact remaining stock

```text
Stock = 2
Customer buys 2

Expected:
Order succeeds
Stock = 0
```

### Test 3 — Insufficient stock

```text
Stock = 2
Customer buys 3

Expected:
Order rejected
Stock remains 2
No successful order created
```

### Test 4 — Out of stock

```text
Stock = 0
Customer attempts purchase

Expected:
Purchase rejected
No order created
```

### Test 5 — Wrong variant

```text
Product A
Variant belongs to Product B

Expected:
Purchase rejected
```

### Test 6 — Different variants

```text
Black / M = 10
White / M = 5

Customer buys:
Black / M × 2

Expected:

Black / M = 8
White / M = 5
```

### Test 7 — Multiple items

```text
Black / M × 2
White / L × 1
```

Expected:

```text
Both variants validated
Both stock quantities updated
One order created
Correct order items created
```

### Test 8 — Cart becomes stale

```text
Stock = 2

Customer adds 2 to cart

Another customer buys 2

Stock = 0

First customer checks out
```

Expected:

```text
Checkout rejected
No negative stock
No invalid order
```

### Test 9 — Concurrent purchase

Simulate two customers attempting to purchase the final available unit.

Expected:

```text
Only one purchase succeeds.
The other is rejected.
Stock never becomes negative.
```

### Test 10 — Price change

Create an order at:

```text
₹1299
```

Then change product price to:

```text
₹1499
```

Expected:

```text
Existing order remains ₹1299.
```

---

# 22. Development Rules

Before modifying anything:

1. Inspect the existing implementation.
2. Identify the current data flow.
3. Identify duplicated/conflicting sources of truth.
4. Identify why unavailable items can currently be ordered.
5. Fix the root cause.
6. Reuse existing working code where possible.
7. Do not create duplicate tables/functions unnecessarily.
8. Do not rebuild unrelated pages.
9. Do not modify product listing/catalog creation in this phase.
10. Do not break existing authentication, customer accounts, payment, or admin functionality.
11. Keep the implementation consistent with the existing React + Supabase architecture.
12. Prefer database-level validation/transactions for inventory-critical operations.
13. Add clear error handling and user-friendly messages.
14. Test the complete flow after changes.

---

# 23. Final Acceptance Criteria

The implementation is considered correct only when:

```text
Product
   ↓
Variant
   ↓
Inventory
   ↓
Cart
   ↓
Checkout
   ↓
Order
   ↓
Inventory Update
```

has a single consistent source of truth.

Specifically:

- Every purchasable item maps to a valid variant.
- Every variant belongs to the correct product.
- Every variant has authoritative inventory.
- Customers cannot purchase unavailable variants.
- Customers cannot purchase more than available stock.
- Stock cannot become negative.
- Stock is updated only once per successful purchase according to the existing payment/order flow.
- Multiple variants in one order are handled independently.
- Historical order information remains stable after product edits.
- Client-side manipulation cannot bypass inventory validation.
- Existing working features remain intact.
- Product listing/creation logic is left for the next phase.

## Most Important Instruction

**Do not assume the current architecture is wrong. Inspect it first.**

The goal is not to replace the existing e-commerce implementation with a new system.

The goal is to understand the existing implementation, identify the broken links between **products, variants, inventory, cart, and orders**, and repair those links so that the database becomes the reliable source of truth.

After completing this phase, provide a concise implementation report containing:

1. What the existing architecture was doing.
2. What was causing invalid orders.
3. What files/database functions/tables were changed.
4. What inventory/order logic was implemented.
5. What tests were performed and their results.
6. Any remaining issues that should be handled in the **Product Listing phase**.

Do not proceed into Product Listing redesign until this Order + Inventory phase is stable and verified.