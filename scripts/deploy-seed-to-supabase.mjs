import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read env variables
const envLocal = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf8');
const envVars = Object.fromEntries(
  envLocal
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function deploy() {
  try {
    console.log('Reading supabase/villages.seed.json...');
    const seedJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'supabase', 'villages.seed.json'), 'utf8'));

    console.log(`Clearing existing ${seedJson.length} villages in Supabase...`);
    
    // Delete everything in the table
    const { error: deleteError } = await supabase
      .from('villages')
      .delete()
      .neq('id', 'dummy_value_to_match_all');

    if (deleteError) {
      throw new Error(`Failed to clear table: ${deleteError.message}`);
    }

    console.log('✓ Successfully cleared old villages.');

    console.log(`Inserting ${seedJson.length} new villages...`);

    // Format for DB table columns
    const villagesToInsert = seedJson.map((v) => ({
      id: v.id,
      name: v.name,
      district: v.district,
      state: v.state,
      lat: v.lat,
      lng: v.lng,
      population: v.population,
      households: v.households,
      overall_score: v.overallScore,
      images: v.images,
      scores: v.scores
    }));

    // Insert in chunks of 5 to avoid any payload limits
    const chunkSize = 5;
    for (let i = 0; i < villagesToInsert.length; i += chunkSize) {
      const chunk = villagesToInsert.slice(i, i + chunkSize);
      console.log(`Uploading chunk ${i / chunkSize + 1} (${chunk.map(v => v.name).join(', ')})...`);
      
      const { error: insertError } = await supabase
        .from('villages')
        .insert(chunk);

      if (insertError) {
        throw new Error(`Failed to insert chunk: ${insertError.message}`);
      }
    }

    console.log(`\n🎉 Success! Deployed all ${seedJson.length} villages to Supabase database successfully!`);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();