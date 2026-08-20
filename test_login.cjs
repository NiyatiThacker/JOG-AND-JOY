const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vaxdvemqlsawdxwmyxvu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk');

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'brandnewadmin123@jogandjoy.com',
    password: 'password123'
  });
  console.log("Login data:", data);
  console.log("Login error:", error ? error.message : null);
}
testLogin();
