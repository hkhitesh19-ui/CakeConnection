const { createClient } = require('@supabase/supabase-js');
const url = 'https://miuxrcsckygnuxhdhiam.supabase.co';
const key = 'sb_publishable_mj5ErbBN5Wny-5J92mTeRg_ODfFYQD_';

console.log("Initializing supabase client...");
const supabase = createClient(url, key);

async function run() {
  console.log("Calling supabase.auth.getUser()...");
  try {
    const res = await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
    ]);
    console.log("Result:", res);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
