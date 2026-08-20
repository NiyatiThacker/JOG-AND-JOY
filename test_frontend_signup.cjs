const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vaxdvemqlsawdxwmyxvu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk');

async function testSignup() {
  console.log("Starting signup test...");
  const { data, error } = await supabase.auth.signUp({
    email: 'frontendtest@jogandjoy.com',
    password: 'password123',
    options: {
      data: { name: 'Frontend Test', role: 'CUSTOMER' }
    }
  });
  console.log("Signup data:", data);
  console.log("Signup error:", error);
  
  if (data?.user) {
    const addresses = [{
      id: 'addr-12345',
      label: 'Home',
      line1: '123 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '12345',
      isDefault: true
    }];
    const { error: updateErr } = await supabase.from('users').update({ phone: '1234567890', address: '123 Test St', addresses }).eq('id', data.user.id);
    console.log("Update Error:", updateErr);
  }
}
testSignup();
