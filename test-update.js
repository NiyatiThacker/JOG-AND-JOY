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

async function testUpdate() {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'SHIPPED', updatedAt: new Date().toISOString() })
    .eq('id', 'JJ-TEST-001')
    .select()
    .single();

  if (error) {
    console.error("Update Error:", error);
  } else {
    console.log("Update Success:", data);
  }
}

testUpdate();
