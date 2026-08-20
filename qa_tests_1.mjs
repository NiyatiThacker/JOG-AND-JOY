import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

// We use the anon client for RLS tests
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('--- STARTING QA BACKEND TESTS ---');

  // Test 1: Data Consistency - Check for negative stock and duplicate variants
  console.log('\n[Test 1] Data Consistency (Products & Variants)');
  const { data: products, error: prodError } = await anonClient.from('products').select('*');
  
  if (prodError) {
    console.error('Failed to fetch products:', prodError);
  } else {
    let negativeStockCount = 0;
    let duplicateVariantsCount = 0;
    
    products.forEach(p => {
      if (p.variants && Array.isArray(p.variants)) {
        const variantIds = new Set();
        p.variants.forEach(v => {
          // Negative stock check
          if (v.stock < 0) {
            console.log(`❌ Negative stock found: Product ${p.id}, Variant ${v.id}, Stock: ${v.stock}`);
            negativeStockCount++;
          }
          
          // Duplicate variants check
          const signature = `${v.color}-${v.size}`;
          if (variantIds.has(signature)) {
            console.log(`❌ Duplicate variant found: Product ${p.id}, Signature: ${signature}`);
            duplicateVariantsCount++;
          }
          variantIds.add(signature);
        });
      }
    });

    if (negativeStockCount === 0) console.log('✅ No negative stock variants found.');
    if (duplicateVariantsCount === 0) console.log('✅ No duplicate variants found within the same product.');
  }

  // Test 2: RLS Security - Anonymous Product Manipulation
  console.log('\n[Test 2] RLS Security (Products Table)');
  const { data: insertProd, error: insertProdError } = await anonClient
    .from('products')
    .insert([{ title: 'Hacked Product', price: 1, status: 'live', categoryId: 'some-cat-id' }])
    .select();
    
  if (insertProdError) {
    console.log('✅ Successfully blocked unauthorized product creation:', insertProdError.message);
  } else {
    console.log('❌ RLS FAILURE: Anonymous user was able to create a product!');
    console.log(insertProd);
  }

  const { data: updateProd, error: updateProdError } = await anonClient
    .from('products')
    .update({ price: 1 })
    .neq('id', 'nonexistent'); // Try to update any product

  if (updateProdError) {
    console.log('✅ Successfully blocked unauthorized product modification:', updateProdError.message);
  } else {
    console.log('❌ RLS FAILURE: Anonymous user was able to update a product!');
  }

  // Test 3: RLS Security - Anonymous Categories Manipulation
  console.log('\n[Test 3] RLS Security (Categories Table)');
  const { error: insertCatError } = await anonClient
    .from('categories')
    .insert([{ label: 'Fake Category' }]);
    
  if (insertCatError) {
    console.log('✅ Successfully blocked unauthorized category creation:', insertCatError.message);
  } else {
    console.log('❌ RLS FAILURE: Anonymous user was able to create a category!');
  }

  // Test 4: RLS Security - Anonymous Orders Manipulation
  console.log('\n[Test 4] RLS Security (Orders Table)');
  const { error: updateOrderError } = await anonClient
    .from('orders')
    .update({ total_amount: 0 })
    .neq('id', 'nonexistent');
    
  if (updateOrderError) {
    console.log('✅ Successfully blocked unauthorized order modification:', updateOrderError.message);
  } else {
    console.log('❌ RLS FAILURE: Anonymous user was able to update an order!');
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests();
