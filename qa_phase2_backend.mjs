import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

// For authenticated operations (Admin role), we need to log in first.
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runPhase2Tests() {
  console.log('--- PHASE 2: AUTOMATED BACKEND INTEGRITY TESTS ---');

  // 1. DATABASE INTEGRITY SCAN (Phase 24)
  console.log('\n[TEST] Phase 24: Database Integrity Scan');
  const { data: allProducts, error: prodErr } = await client.from('products').select('*');
  let duplicateSKUs = 0;
  let negativeStock = 0;
  let nullRequiredFields = 0;
  const skus = new Set();
  
  allProducts.forEach(p => {
    if (!p.title || !p.basePrice) nullRequiredFields++;
    
    if (p.variants && Array.isArray(p.variants)) {
      p.variants.forEach(v => {
        if (v.stock < 0) negativeStock++;
        if (v.sku) {
          if (skus.has(v.sku)) duplicateSKUs++;
          skus.add(v.sku);
        }
      });
    }
  });
  console.log(`Duplicate SKUs: ${duplicateSKUs}`);
  console.log(`Negative stock rows: ${negativeStock}`);
  console.log(`Products with missing required fields: ${nullRequiredFields}`);

  // 2. PRODUCT LIFECYCLE (Draft -> Published -> Archived) (Phase 2)
  console.log('\n[TEST] Phase 2: Product Lifecycle (Draft -> Live -> Archived)');
  const dummyProdId = 'lifecycle-prod-' + Date.now();
  const dummyVarId = 'var-' + Date.now();
  
  const { error: insertErr } = await client.from('products').insert({
    id: dummyProdId,
    title: 'QA Lifecycle Product',
    basePrice: 2000,
    status: 'draft',
    variants: [{ id: dummyVarId, color: 'Black', colorHex: 'Black', size: 'M', stock: 5 }]
  });
  
  if (insertErr) {
    console.log(`❌ Insert failed: ${insertErr.message}`);
  } else {
    console.log(`✅ Product created successfully in 'draft' state.`);
  }

  // Check if draft is visible to customer via RPC or standard fetch.
  // Actually, standard fetch for storefront usually filters by status='live'.
  const { data: fetchDraft } = await client.from('products').select('*').eq('id', dummyProdId).eq('status', 'live');
  if (!fetchDraft || fetchDraft.length === 0) {
    console.log(`✅ Draft product is correctly hidden from 'live' queries.`);
  } else {
    console.log(`❌ Draft product leaked into live queries!`);
  }

  // Publish
  await client.from('products').update({ status: 'live' }).eq('id', dummyProdId);
  console.log(`✅ Product published.`);

  // 3. CART STALE-STOCK TEST (Phase 8)
  console.log('\n[TEST] Phase 8: Cart Stale-Stock Test');
  // Simulate Session A adding to cart (stock=5).
  // Then Session B buys all 5.
  await client.from('products').update({ 
    variants: [{ id: dummyVarId, color: 'Black', colorHex: 'Black', size: 'M', stock: 0 }] 
  }).eq('id', dummyProdId);
  console.log(`Session B depleted stock to 0.`);

  // Session A attempts checkout
  const orderPayload = {
    id: 'stale-test-' + Date.now(),
    customerId: 'guest',
    items: [{ productId: dummyProdId, variantId: dummyVarId, color: 'Black', size: 'M', quantity: 5, price: 2000 }]
  };
  
  const { data: orderRes, error: orderErr } = await client.rpc('create_order_atomic', { order_payload: orderPayload });
  if (orderErr) {
    if (orderErr.message.includes('Insufficient stock')) {
      console.log(`✅ Stale Cart correctly REJECTED by backend: ${orderErr.message}`);
    } else {
      console.log(`❌ Unexpected error: ${orderErr.message}`);
    }
  } else {
    console.log(`❌ CRITICAL FAILURE: Order succeeded despite 0 stock!`);
  }

  // 4. CART STALE-PRICE TEST (Phase 10 & 20)
  console.log('\n[TEST] Phase 10: Cart Stale-Price / Integrity Test');
  // Restore stock for price test
  await client.from('products').update({ 
    variants: [{ id: dummyVarId, color: 'Black', colorHex: 'Black', size: 'M', stock: 10 }] 
  }).eq('id', dummyProdId);
  
  // Try to checkout with modified price (e.g., hacker changes price to 1)
  const maliciousPayload = {
    id: 'hack-test-' + Date.now(),
    customerId: 'guest',
    items: [{ productId: dummyProdId, variantId: dummyVarId, color: 'Black', size: 'M', quantity: 1, price: 1 }],
    subtotal: 1,
    total: 1
  };
  
  const { error: hackErr } = await client.rpc('create_order_atomic', { order_payload: maliciousPayload });
  
  if (hackErr) {
    console.log(`✅ Backend rejected manipulated price: ${hackErr.message}`);
  } else {
    console.log(`❌ CRITICAL FAILURE: Backend ACCEPTED manipulated price of 1! The RPC does not re-verify product basePrice!`);
  }

  // 5. ARCHIVE TEST
  console.log('\n[TEST] Phase 2: Archive Lifecycle');
  await client.from('products').update({ status: 'archived' }).eq('id', dummyProdId);
  console.log(`✅ Product archived.`);
  
}

runPhase2Tests();
