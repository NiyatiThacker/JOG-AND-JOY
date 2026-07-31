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

async function testLogin() {
  console.log('🔄 Attempting to sign in with email and password...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'niyati.thacker@gmail.com',
    password: 'niyatithacker',
  });

  if (error) {
    console.error('❌ Login Error:', error);
  } else {
    console.log('✅ Login Success! User ID:', data.user.id);
  }
}

testLogin();
