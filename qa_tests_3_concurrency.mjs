import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConcurrency() {
  console.log('--- STARTING CONCURRENCY TEST ---');

  // 1. Create a dummy product with 1 stock
  const dummyProduct = {
    id: 'concurrency-test-' + Date.now(),
    title: 'Concurrency Test Shirt',
    basePrice: 100,
    status: 'live',
    variants: [
      {
        id: 'var-1',
        color: 'Black',
        colorHex: 'Black',
        size: 'M',
        stock: 1
      }
    ]
  };
  
  const { error: insertError } = await client.from('products').insert([dummyProduct]);
  if (insertError) {
    console.error('Failed to create dummy product:', insertError.message);
    return;
  }
  
  const product = dummyProduct;
  
  const variant = product.variants[0];
  console.log(`Setting stock of Product ${product.id}, Variant ${variant.id} to 1...`);
  
  // Set stock to 1
  const updatedVariants = [...product.variants];
  updatedVariants[0].stock = 1;
  await client.from('products').update({ variants: updatedVariants }).eq('id', product.id);

  console.log('Stock updated. Firing 3 concurrent orders...');

  // 2. Fire 3 concurrent orders
  const orderPayload = {
    id: 'test-order-' + Date.now(),
    customerId: 'guest',
    customerEmail: 'test@example.com',
    items: [
      {
        productId: product.id,
        variantId: variant.id,
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 100
      }
    ],
    total: 100
  };

  const requests = [];
  for (let i = 0; i < 3; i++) {
    const payload = JSON.parse(JSON.stringify(orderPayload));
    payload.id = payload.id + '-' + i;
    
    // We call the RPC that handles atomic ordering
    requests.push(
      client.rpc('create_order_atomic', { order_payload: payload }).then(res => ({ id: i, ...res }))
    );
  }

  const results = await Promise.all(requests);
  
  let successCount = 0;
  let failCount = 0;
  results.forEach(res => {
    if (res.error) {
      console.log(`Request ${res.id} failed:`, res.error.message);
      failCount++;
    } else {
      console.log(`Request ${res.id} succeeded.`);
      successCount++;
    }
  });

  console.log(`\nResults: ${successCount} succeeded, ${failCount} failed.`);
  if (successCount === 1 && failCount === 2) {
    console.log('✅ Concurrency protection works perfectly. Only one order succeeded.');
  } else {
    console.log('❌ Concurrency protection FAILED. Multiple orders succeeded or all failed unexpectedly.');
  }

  // Check final stock
  const { data: finalProducts } = await client.from('products').select('*').eq('id', product.id);
  const finalStock = finalProducts[0].variants[0].stock;
  console.log(`Final stock: ${finalStock}`);
  if (finalStock === 0) {
    console.log('✅ Final stock is correctly 0.');
  } else if (finalStock < 0) {
    console.log('❌ Final stock is NEGATIVE.');
  } else {
    console.log('❌ Final stock is incorrect.');
  }
}

testConcurrency();
