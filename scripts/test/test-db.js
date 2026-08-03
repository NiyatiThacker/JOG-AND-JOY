import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually to avoid needing dotenv package
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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Attempting to connect to Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
      console.error('❌ Connection failed! Supabase returned an error:');
      console.error(error);
    } else {
      console.log('✅ Connection successful!');
      console.log('Successfully queried the "products" table.');
      console.log('Data returned:', data);
    }
  } catch (err) {
    console.error('❌ Unexpected error during connection:');
    console.error(err);
  }
}

testConnection();
