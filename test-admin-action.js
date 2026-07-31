import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAdmin() {
  // 1. Sign up a new user
  const email = `admin_${Date.now()}@test.com`;
  const password = 'password123';
  
  console.log('Signing up:', email);
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: 'Test Admin', role: 'ADMIN' } }
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError);
    return;
  }

  // Wait a moment for trigger to sync
  await new Promise(r => setTimeout(r, 1000));

  // Verify the role is ADMIN in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single();
    
  if (userError) {
    console.error('Failed to get user role:', userError);
    return;
  }
  
  console.log('User role:', userData.role);

  // 2. Try to update an order (this tests the Admin RLS policy)
  console.log('Attempting to update order status...');
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .update({ status: 'COMPLETED' })
    .eq('id', 'JJ-TEST-002')
    .select()
    .single();

  if (orderError) {
    console.error('Admin RLS failed! Could not update order:', orderError);
  } else {
    console.log('Success! Admin updated order:', orderData.id, 'to status:', orderData.status);
  }
}

testAdmin();
