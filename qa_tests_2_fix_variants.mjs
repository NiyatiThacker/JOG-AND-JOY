import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
// WARNING: To UPDATE products we need the ANON key if RLS is open, but since we are locking RLS, this might fail unless we do it BEFORE locking RLS, or if we use service role.
// Since we don't have service role, we rely on the currently OPEN RLS to clean up the data BEFORE the user applies the qa-fixes-1.sql!
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixVariants() {
  console.log('--- STARTING VARIANT CLEANUP ---');

  const { data: products, error } = await client.from('products').select('*');
  
  if (error) {
    console.error('Failed to fetch products:', error);
    return;
  }

  for (const p of products) {
    if (p.variants && Array.isArray(p.variants)) {
      const variantIds = new Set();
      const cleanedVariants = [];
      let modified = false;

      p.variants.forEach(v => {
        // Skip invalid variants
        if (!v.color || !v.size || v.color === 'undefined' || v.size === 'undefined') {
          console.log(`🗑️ Removing invalid variant in Product ${p.id} (Color: ${v.color}, Size: ${v.size})`);
          modified = true;
          return;
        }

        const signature = `${v.color}-${v.size}`;
        if (variantIds.has(signature)) {
          console.log(`🗑️ Removing duplicate variant in Product ${p.id} (Signature: ${signature})`);
          modified = true;
          return;
        }

        variantIds.add(signature);
        cleanedVariants.push(v);
      });

      if (modified) {
        console.log(`Updating Product ${p.id} with cleaned variants...`);
        const { error: updateError } = await client
          .from('products')
          .update({ variants: cleanedVariants })
          .eq('id', p.id);
          
        if (updateError) {
          console.error(`❌ Failed to update Product ${p.id}:`, updateError.message);
        } else {
          console.log(`✅ Product ${p.id} cleaned successfully.`);
        }
      }
    }
  }

  console.log('--- VARIANT CLEANUP COMPLETE ---');
}

fixVariants();
