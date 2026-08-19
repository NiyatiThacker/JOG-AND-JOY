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
  
  const record = {
    id: crypto.randomUUID(),
    label: 'Test Node Category',
    slug: 'test-node-category',
    order: 1,
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const { data, error } = await client.from('categories').insert([record]).select().single();
  
  console.log('Insert Error:', error);
  console.log('Insert Data:', data);
}
run();
