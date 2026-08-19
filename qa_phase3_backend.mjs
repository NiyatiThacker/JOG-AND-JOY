import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

// Setup anon client
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// We just use the anonClient for now


async function runPhase3Tests() {
  console.log('--- PHASE 3: SECURITY & PRICING VERIFICATION ---');

  // We need to create a test product via Anon (which should FAIL after Phase 3 SQL)
  console.log('\n[TEST 1] RLS Anonymous Write Protection');
  const { error: anonErr } = await anonClient.from('products').insert({
    id: 'anon-test-' + Date.now(),
    title: 'Anon Product',
    basePrice: 500,
  });
  
  if (anonErr) {
    console.log(`✅ RLS correctly blocked anonymous insert: ${anonErr.message}`);
  } else {
    console.log(`❌ CRITICAL FAILURE: RLS allowed anonymous product creation!`);
  }

  // To truly test Auth, we need to sign up a test customer and a test admin.
  // Wait, I cannot sign up an admin easily without the frontend if RLS blocks role escalation.
  // For the sake of the checkout pricing test, we can use the anonClient since we allowed guests, 
  // but let's test if the price manipulation is blocked!

  console.log('\n[TEST 2] Checkout Price Manipulation');
  // First, we need an existing product. Let's find one.
  const { data: products } = await anonClient.from('products').select('id, variants').limit(1);
  if (!products || products.length === 0) {
    console.log('No products found to test checkout.');
    return;
  }
  const prod = products[0];
  const varId = prod.variants?.[0]?.id || null;

  // The client attempts to buy a product but fakes the price to 1.
  const maliciousPayload = {
    id: 'hack-test-3-' + Date.now(),
    customerId: 'guest',
    items: [{ 
      productId: prod.id, 
      variantId: varId, 
      quantity: 1, 
      price: 1 // Malicious price
    }],
    subtotal: 1,
    total: 1
  };
  
  const { data: orderRes, error: hackErr } = await anonClient.rpc('create_order_atomic', { order_payload: maliciousPayload });
  
  if (hackErr) {
    console.log(`❌ Order failed entirely (perhaps due to stock or auth): ${hackErr.message}`);
  } else if (orderRes) {
    // Check if the backend recalculated the total
    if (orderRes.total > 1) {
      console.log(`✅ Backend successfully ignored malicious client price and calculated authoritative total: ${orderRes.total}`);
    } else {
      console.log(`❌ CRITICAL FAILURE: Backend STILL ACCEPTED manipulated price of 1! Total is: ${orderRes.total}`);
    }
  }

  console.log('\n--- PHASE 3 TESTS COMPLETE ---');
}

runPhase3Tests();
