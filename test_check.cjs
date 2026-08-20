const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://sggqxskdyuiteejmlhow.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZ3F4c2tkeXVpdGVlam1saG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDA3NzgsImV4cCI6MjEwMDg3Njc3OH0.49Wh0oM2BaEmchVy0A1wFCkKMz5B1p4TfandCzDL3i8');

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("SELECT * :", data, error);
}
check();
