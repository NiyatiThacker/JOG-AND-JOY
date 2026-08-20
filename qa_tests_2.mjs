import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('--- STARTING PHASE 4 INTEGRATION TESTS ---');

  // 1. Fetch a product to test with
  const { data: products } = await anonClient.from('products').select('*').limit(1);
  if (!products || products.length === 0) {
    console.error('❌ No products found to test with.');
    return;
  }
  
  const testProduct = products[0];
  const testPrice = Number(testProduct.basePrice || testProduct.price || 0);
  console.log(`\nUsing Product: ${testProduct.title} (ID: ${testProduct.id}, Real Price: ${testPrice})`);
  
  let testSize = null;
  let testColor = null;
  let initialStock = testProduct.stock || 0;
  
  if (testProduct.variants && testProduct.variants.length > 0) {
    const variant = testProduct.variants.find(v => Number(v.stock) >= 1);
    if (variant) {
      testSize = variant.size;
      testColor = variant.colorHex;
      initialStock = Number(variant.stock);
      console.log(`Using Variant: Size ${testSize}, Color ${testColor}, Initial Stock: ${initialStock}`);
    } else {
      console.log('No variants with stock >= 1 found.');
    }
  } else {
    console.log(`Using Base Product Stock: ${initialStock}`);
  }

  console.log('\n[Test 1] Checkout Math & Exploit Prevention');
  
  const maliciousOrderPayload = {
    orderNumber: 'TEST-HACK-ORDER-' + Date.now(),
    customerId: 'test-user-123',
    shippingCost: -1000, 
    tax: -500,
    discountAmount: 100000, 
    status: 'PROCESSING',
    channel: 'web',
    items: [
      {
        productId: testProduct.id,
        quantity: 1,
        size: testSize,
        color: testColor,
        price: 1, // Malicious price
        title: 'Hacked Title'
      }
    ]
  };

  const { data: orderData, error: orderError } = await anonClient.rpc('create_order_atomic', {
    order_payload: maliciousOrderPayload
  });

  if (orderError) {
    console.log('❌ RPC Error during order creation:', orderError.message);
  } else {
    const finalOrder = orderData;
    console.log(`✅ Order Successfully Placed (ID: ${finalOrder.id})`);
    
    const expectedSubtotal = testPrice * 1;
    let expectedTotal = expectedSubtotal; 
    let expectedDiscount = 100000;
    if (expectedDiscount > expectedSubtotal) {
      expectedDiscount = expectedSubtotal;
    }
    
    console.log(`-> Subtotal check: Expected ${expectedSubtotal}, Got ${finalOrder.subtotal}`);
    if (Number(finalOrder.subtotal) !== Number(expectedSubtotal)) console.log('❌ FAILED: Server trusted client subtotal/price!');
    else console.log('✅ PASS: Server securely forced the correct base price.');
    
    console.log(`-> Shipping check: Expected 0, Got ${finalOrder.shippingCost}`);
    if (Number(finalOrder.shippingCost) < 0) console.log('❌ FAILED: Server accepted negative shipping!');
    else console.log('✅ PASS: Server clamped negative shipping cost.');

    console.log(`-> Discount check: Expected ${expectedDiscount}, Got ${finalOrder.discountAmount}`);
    if (Number(finalOrder.discountAmount) !== Number(expectedDiscount)) console.log('❌ FAILED: Server failed to clamp malicious discount!');
    else console.log('✅ PASS: Server safely clamped the discount to not exceed the order total.');

    console.log('\n[Test 2] Automated Inventory Restock Trigger (Postgres)');
    
    const { data: fetchProd2 } = await anonClient.from('products').select('*').eq('id', testProduct.id).single();
    let stockAfterPurchase = 0;
    if (testSize) {
      const v = fetchProd2.variants.find(v => v.size === testSize && v.colorHex === testColor);
      stockAfterPurchase = Number(v.stock);
    } else {
      stockAfterPurchase = Number(fetchProd2.stock);
    }
    
    console.log(`-> Stock after purchase: Expected ${initialStock - 1}, Got ${stockAfterPurchase}`);
    if (stockAfterPurchase !== initialStock - 1) {
      console.log('❌ FAILED: Stock was not accurately deducted.');
    } else {
      console.log('✅ PASS: Stock was securely deducted.');
      
      console.log('\n[Test 3] Verifying RLS prevents unauthorized order cancellation...');
      await anonClient.from('orders').update({ status: 'CANCELLED' }).eq('id', finalOrder.id);
      
      const { data: updatedOrder } = await anonClient.from('orders').select('status').eq('id', finalOrder.id).single();
      
      if (updatedOrder && updatedOrder.status !== 'CANCELLED') {
        console.log(`✅ PASS: RLS successfully blocked anonymous user from cancelling the order (Status remained: ${updatedOrder.status}).`);
        console.log('   (Note: To fully test the Restock Trigger, an Admin must cancel the order in the dashboard).');
      } else {
        console.log('❌ FAILED: Anonymous user was able to cancel the order! RLS is broken!');
      }
    }
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests();
