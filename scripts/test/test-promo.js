import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testPromo() {
  const payload = {
    id: "test_" + Date.now(),
    title: "Test Promo",
    method: "code",
    code: "TEST10",
    discountType: "percentage",
    value: 10,
    targetScope: "entire_order",
    active: true,
    usageLimit: null,
    usageCount: 0,
    minOrderValue: 0
  };

  console.log("Inserting:", payload);
  const { data, error } = await supabase
    .from('promotions')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("SUPABASE ERROR:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS:", data);
  }
}

testPromo();
