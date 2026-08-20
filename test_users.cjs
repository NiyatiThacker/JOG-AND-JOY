const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('', '');
async function test() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log(data || error);
}
test();
