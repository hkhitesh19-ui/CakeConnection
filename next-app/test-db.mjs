import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) console.error(error);
  
  const fathers = data?.filter(d => d.subcategory?.toLowerCase().includes('father'));
  console.log(fathers?.map(d => ({ id: d.id, name: d.name, subcategory: d.subcategory })));
}

run();
