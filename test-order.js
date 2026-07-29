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

async function testOrder() {
  const newOrder = {
      id: "JJ-TEST-001",
      customerId: "guest",
      customerName: "Test Name",
      customerEmail: "test@example.com",
      customerPhone: "1234567890",
      shippingAddress: { city: "Test City" },
      items: [{ id: "prod-1", name: "Shirt", price: 100, quantity: 1 }],
      subtotal: 100,
      total: 100,
      paymentStatus: 'paid',
      status: 'PROCESSING'
  };

  const { data, error } = await supabase.from('orders').insert([newOrder]).select();
  if (error) {
    console.error("Insert Error:", error);
  } else {
    console.log("Insert Success:", data);
  }
}

testOrder();
