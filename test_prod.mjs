import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: 'brandnewadmin123@jogandjoy.com',
    password: 'securepassword123'
  });
  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }
  
  const token = authData.session.access_token;
  const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: 'Bearer ' + token } }
  });
  
  const record = {
    id: crypto.randomUUID(),
    title: 'Test New Product',
    name: 'Test New Product', // some forms send name instead of title
    basePrice: 999,
    price: 999,
    stock: 10,
    status: 'live',
    variants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const { data, error } = await authedClient.from('products').insert([record]).select().single();
  
  console.log('Insert Error:', JSON.stringify(error, null, 2));
  console.log('Insert Data:', data);
}
run();
