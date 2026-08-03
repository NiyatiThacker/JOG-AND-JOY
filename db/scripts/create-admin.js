import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
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

async function createAdmin() {
  console.log('🔄 Attempting to register Admin User...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'niyati.thacker@gmail.com',
    password: 'niyatithacker',
    options: {
      data: {
        name: 'Niyati Thacker',
        role: 'ADMIN'
      }
    }
  });

  if (error) {
    console.error('❌ Registration Failed:');
    console.error(error.message);
  } else {
    console.log('✅ Admin User Registered Successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Role:', data.user.user_metadata.role);
  }
}

createAdmin();
