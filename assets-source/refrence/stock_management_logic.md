# Lotus E-Commerce: Stock Management & Order Flow Architecture

This document details the complete end-to-end stock management logic implemented in the Lotus e-commerce application, covering the Supabase database layer, backend RPC logic, frontend order processing, and UI stock validation.

---

## 1. Database Schema & Data Models

Stock management is centered around product variants. Each variant of a product maintains its own independent stock count. 

### `product_variants` Table Structure
The core of the stock tracking exists in the `product_variants` table.

```sql
CREATE TABLE product_variants (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku             TEXT UNIQUE,
  size            TEXT,
  "colorName"     TEXT,
  "stockQuantity" INTEGER NOT NULL DEFAULT 0, -- Holds the actual available stock
  -- ...other fields
);
```
> [!NOTE]
> The parent `products` table has a legacy `"inStock": BOOLEAN` field, but accurate stock relies primarily on the aggregation of `"stockQuantity"` across all variants associated with that product.

---

## 2. Atomic Stock Decrement Logic (Backend)

To prevent race conditions (e.g., two users purchasing the last available shirt simultaneously), the backend relies on an atomic **Remote Procedure Call (RPC)** defined in Supabase via `plpgsql`.

### The `decrement_stock` RPC
This function ensures that the decrement happens entirely on the database side, verifying that stock is sufficient in the exact same transaction as the decrement.

```sql
CREATE OR REPLACE FUNCTION decrement_stock(v_id UUID, qty INT)
RETURNS void AS $$
BEGIN
  -- Attempt atomic decrement, ensuring quantity is sufficient
  UPDATE public.product_variants
  SET "stockQuantity" = "stockQuantity" - qty
  WHERE id = v_id AND "stockQuantity" >= qty;

  -- If no rows were updated, either the variant doesn't exist OR stock is insufficient
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variant %', v_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```
> [!IMPORTANT]
> Because it relies on `WHERE ... AND "stockQuantity" >= qty`, it acts as an atomic lock. It strictly prevents the stock from silently dropping below zero at the database level.

---

## 3. Order Placement & Stock Mutation Flow (Frontend API)

The `createOrder` workflow (`src/lib/api.js`) connects the customer's checkout action to the stock adjustments. The implementation uses a hybrid approach: prioritizing atomic backend execution with a resilient client-side fallback.

### Execution Flow:
1. **Order Insertion:** The complete order payload is inserted into the `orders` table first. 
2. **Missing Customer Fallback:** If the insertion fails due to an invalid/missing `customerId` (Foreign Key constraint `23503`), the system degrades gracefully to a guest checkout, inserting the order with a null `customerId` and logging to `localStorage`.
3. **Iterative Stock Decrement:** The system loops through each item in the order payload.
4. **Primary Atomic Call:** For each item, it invokes the atomic `decrement_stock` RPC.
5. **Resilient Client-Side Fallback:** If the RPC fails (either because the RPC hasn't been deployed yet, or it threw an `Insufficient stock` exception), the system performs a non-atomic fallback update.

```javascript
// Excerpt from createOrder in src/lib/api.js
for (const item of orderPayload.items) {
  if (item.variantId) {
    // 1. Attempt atomic decrement via RPC first
    const { error: rpcError } = await supabase.rpc('decrement_stock', {
      v_id: item.variantId,
      qty: item.quantity
    });

    if (rpcError) {
      // 2. Fallback to client-side decrement if RPC is missing OR stock was insufficient
      const { data: variant } = await supabase.from('product_variants')
          .select('stockQuantity').eq('id', item.variantId).single();
      
      if (variant) {
        // Enforce a hard floor of 0 via Math.max
        await supabase.from('product_variants').update({
          stockQuantity: Math.max(0, variant.stockQuantity - item.quantity)
        }).eq('id', item.variantId);
      }
    }
  }
}
```
> [!WARNING]
> Because the fallback catches *all* RPC errors (including `Insufficient stock`), if a race condition occurs and stock runs out, the order is still preserved and the stock hits `0` exactly. This is an explicit design choice favoring completed checkout conversions over strict rejection during peak traffic spikes.

---

## 4. UI Validations & Context Guards

To prevent users from adding items that are out of stock before they reach checkout, the application implements safeguards in the UI and state management (`CartContext.jsx`, `QuickView.jsx`, `CartDrawer.jsx`).

### `CartContext.jsx` Limits
When items are added or updated in the cart, the reducer explicitly checks against the variant's `stockQuantity` limit provided by the payload.

```javascript
// Enforcing limits when modifying quantity
const stockLimit = i.stockQuantity;
// If stock limit is known, cap the final quantity
const finalQty = stockLimit !== undefined && stockLimit !== null 
    ? Math.min(requestedQty, stockLimit) 
    : requestedQty;
```

### Components (`QuickView.jsx` & `CartDrawer.jsx`)
- **Add to Cart Buttons:** Disabled dynamically if `isOutOfStock = currentVariant.stockQuantity <= 0`.
- **Cart Drawer Quantities:** Stepper inputs visually dim and disable if the user tries to increase quantity beyond the `stockQuantity` boundary.

---

## 5. Admin Stock Orchestration

The Admin Dashboard (`AdminInventory.jsx`) directly interfaces with the `product_variants` stock via mutations.

- Administrators view stock across all variants categorized intelligently by health thresholds (`Out of Stock`, `Low`, `Healthy`).
- Adjusting stock fires an API mutation that overwrites the `stockQuantity` directly on the variants array and updates the aggregate total `stock` on the parent product model for search/filter indexing.
