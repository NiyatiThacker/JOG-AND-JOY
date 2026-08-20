const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vaxdvemqlsawdxwmyxvu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGR2ZW1xbHNhd2R4d215eHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDMxNDksImV4cCI6MjEwMjYxOTE0OX0.pO5rAZRH8068ELhDHt1jf2e8XxG6F0TA4Yg_jbFlZPk');

async function checkAdminLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@jogandjoy.com',
    password: 'password123'
  });
  console.log("Admin Login data 1:", data);
  console.log("Admin Login error 1:", error ? error.message : null);

  const { data: d2, error: e2 } = await supabase.auth.signInWithPassword({
    email: 'admin@jogandjoy.com',
    password: 'admin123'
  });
  console.log("Admin Login data 2:", d2);
  console.log("Admin Login error 2:", e2 ? e2.message : null);
}
checkAdminLogin();
