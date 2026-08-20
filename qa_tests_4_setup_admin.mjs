import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vaxdvemqlsawdxwmyxvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk';

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupAdmin() {
  // Try to insert a user (since RLS might block insert if not admin, but users table might be open for registration?)
  // Let's check users table RLS. 
  // In qa-fixes-1.sql: DROP POLICY IF EXISTS "Enable all access for all users" ON users;
  // Wait, qa-fixes-1.sql DID NOT recreate a policy for users!
  // I only did products, categories, orders, settings, promotions.
  // Wait, let's look at qa-fixes-1.sql:
  // "CREATE POLICY ... ON users" wasn't there!
  // If no policy is created for users, it denies ALL access!
  
  const { data: users, error } = await client.from('users').select('*');
  console.log('Users fetch:', users, error);

  // If RLS blocked it, we're in trouble. Let's try to insert anyway.
  const { error: insertError } = await client.from('users').insert({
    email: 'admin@jogandjoy.com',
    password: 'password123',
    role: 'admin',
    name: 'Admin'
  });
  console.log('Insert result:', insertError);
}

setupAdmin();
