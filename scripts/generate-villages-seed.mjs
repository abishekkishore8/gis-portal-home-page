import { fileURLToPath } from 'node:url';
import { writeFile, readFile } from 'node:fs/promises';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const mainWorkbookPath = path.join(rootDir, 'Digital Microplanning.xlsx');
const listWorkbookPath = path.join(rootDir, 'List of Microplan villages Phase I& II.xlsx');
const phase2DatabaseWorkbookPath = path.join(rootDir, 'Final microplan database Phase-2.xlsx');

const demoImages = [
  'https://images.unsplash.com/photo-1759738104613-5eafde92c12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjByaXZlcmJhbmt8ZW58MXx8fHwxNzcyNDQ2MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1661932912833-b645500de79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc3MjQ0NjM2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1708593343442-7595427ddf7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwY29tbXVuaXR5JTIwbWVldGluZ3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1765635550191-a2a2ba9c07ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMGVudmlyb25tZW50JTIwY29uc2VydmF0aW9uJTIwZ3JlZW58ZW58MXx8fHwxNzcyNDQ2MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

const photosSourceDir = path.join(rootDir, 'village', 'Photos for Ashish');
const photosDestBaseDir = path.join(rootDir, 'public', 'village-photos');

// Ensure destination base folder exists
if (!fs.existsSync(photosDestBaseDir)) {
  fs.mkdirSync(photosDestBaseDir, { recursive: true });
}

// Read all subfolders in Photos for Ashish
let photoFolders = [];
if (fs.existsSync(photosSourceDir)) {
  photoFolders = fs.readdirSync(photosSourceDir).filter(f => fs.statSync(path.join(photosSourceDir, f)).isDirectory());
}

// Function to find a matching photo folder for a village
function getVillageImages(sheetName, slug) {
  const normSheet = normalizeName(sheetName);
  const normSlug = slug;
  
  // Find a folder whose normalized name contains or is contained in our normalized sheet name
  const matchedFolder = photoFolders.find(folder => {
    const normFolder = normalizeName(folder).replace('photos', '').trim();
    // Special spelling aliases
    if (normFolder === 'nawali' && normSheet === 'nawli') return true;
    if (normFolder === 'pathanpurva' && normSheet === 'pathanpurwa') return true;
    if (normFolder === 'niwari khadar' && normSheet === 'niwadi khadar') return true;
    
    return normSheet.includes(normFolder) || normFolder.includes(normSheet);
  });

  if (matchedFolder) {
    const srcDir = path.join(photosSourceDir, matchedFolder);
    const destDir = path.join(photosDestBaseDir, normSlug);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const files = fs.readdirSync(srcDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    if (files.length > 0) {
      const copiedImages = [];
      files.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);
        // Copy file
        fs.copyFileSync(srcPath, destPath);
        copiedImages.push(`/village-photos/${normSlug}/${file}`);
      });
      console.log(`✓ Copied ${copiedImages.length} real photos for ${sheetName} to public/village-photos/${normSlug}`);
      return copiedImages;
    }
  }

  return demoImages;
}

const slugify = (value) => String(value)
  .normalize('NFKD')
  .replace(/[^\w\s-]/g, '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/-+/g, '-');

const normalizeName = (value) => String(value)
  .normalize('NFKD')
  .replace(/[^\w\s]/g, ' ')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

// Mapping dictionary from sheet names in Digital Microplanning.xlsx to correct metadata names
const sheetToMetadataMap = {
  'Deer Forest': 'Deer forest',
  'Madanpur': 'Madanpur ',
  'Chittupur': 'Chhitupur',
  'Daranagar': 'Daranagar (Vidurkuti)',
  'Dinkarpur': 'Dinkarpur',
  'Khawaspur': 'Khawaspur',
  'Molnapur': 'Molnapur',
  'Nawwa Awwal': 'Nuawwawal',
  'Niwadi Khadar': 'Niwari Khadar',
  'Pathanpurwa': '(Sewada) Pathanpurva',
  'Raghunathpur': 'Raghunathpur',
  'Rajepur': 'Rajepur',
  'Siswa': 'Siswa',
  'Nawli': 'Nawli',
  'Nayachar': 'Nayachar',
  'Rampur Ghat': 'Rampur ghat',
  'Tajewala': 'Tajewala',
  'Rasalpur': 'Rasalpur',
  'Domri': 'Domari',
  'Ghat Jamni': 'Ghat Jamni',
  'Maskaliya': 'Maskalaya',
  'Rampur': 'Rampur',
  'Shahjadpur': 'Sahjadpur',
  'Udaygarhi': 'Udaigarhi',
  'Dhaka': 'Dhaka',
  'Mokimpur': 'Mokimpur',
  'Rajghat': 'Rajghat',
  'Tatepur': 'Tatepur',
  'Siror': 'Siror',
  'Teentanga': 'Tintanga Diyara (South)',
  'Ashnahi Patti': 'Ashay',
  'Beelpur': 'Beelpur',
  'Beerbal': 'Beerbal',
  'Betalbasan': 'Betalbasan',
  'Saidpur': 'Saidpur',
  'Sonbarsa': 'Sonbarsha'
};

const metadataAliases = new Map([
  ['chittupur', 'chhitupur'],
  ['madanpur', 'madanpur '],
  ['nawwa awwal', 'nuawwawal'],
  ['sonbarsa', 'sonbarsha'],
  ['rampur ghat', 'rampur ghat'],
  ['pathanpurwa', '(sewada) pathanpurva'],
  ['daranagar', 'daranagar (vidurkuti)'],
  ['deer forest', 'deer forest'],
  ['dinkarpur', 'dinkarpur'],
  ['nawli', 'nawli'],
  ['niwadi khadar', 'niwari khadar'],
  ['rajepur', 'rajepur'],
  ['saidpur', 'saidpur'],
  ['siswa', 'siswa'],
  ['domri', 'domari'],
  ['maskaliya', 'maskalaya'],
  ['shahjadpur', 'sahjadpur'],
  ['udaygarhi', 'udaigarhi'],
  ['teentanga', 'tintanga diyara (south)'],
  ['ashnahi patti', 'ashay']
]);

// Map theme names from sheet to categories in solutions.ts
const categoryDefs = [
  { name: 'Community Awareness', match: '1. Awareness' },
  { name: 'Community Based Institution', match: '2. Community' },
  { name: 'Hygiene and Sanitation', match: '3. Sanitation' },
  { name: 'Livelihood and Skill Development', match: '4. Livelihood' },
  { name: 'Renewable Energy', match: '5. Alternative' },
  { name: 'Agriculture', match: '6. Agriculture' },
  { name: 'Animal Husbandry', match: '7. Livestock' },
  { name: 'Fishery', match: '8. Fisheries' },
  { name: 'Biodiversity Conservation Plan', match: '9. Biodiversity' }
];

function parsePhaseListMetadata() {
  const workbook = xlsx.readFile(listWorkbookPath, { cellFormula: true, cellNF: true, cellText: true });
  
  // Parse Phase 2
  const sheet2 = workbook.Sheets['Phase 2'];
  const rows2 = xlsx.utils.sheet_to_json(sheet2, { defval: '' });
  const p2Data = rows2
    .filter((row) => typeof row['Phase II Microplan details'] === 'number' && row.__EMPTY_1)
    .map((row) => ({
      name: String(row.__EMPTY_1 ?? '').trim(),
      block: String(row.__EMPTY_2 ?? '').trim(),
      district: String(row.__EMPTY_3 ?? '').trim(),
      state: String(row.__EMPTY_4 ?? '').trim(),
      lat: Number(row.__EMPTY_5),
      lng: Number(row.__EMPTY_6),
      river: String(row.__EMPTY ?? '').trim(),
    }));

  // Parse Phase 1
  const sheet1 = workbook.Sheets['Phase 1'];
  const rows1 = xlsx.utils.sheet_to_json(sheet1, { defval: '' });
  const p1Data = rows1
    .filter((row) => typeof row['List of Completed village level Microplans ( Phase -1)'] === 'number' && row.__EMPTY_1)
    .map((row) => ({
      name: String(row.__EMPTY_1 ?? '').trim(),
      block: String(row.__EMPTY_2 ?? '').trim(),
      district: String(row.__EMPTY_3 ?? '').trim(),
      state: String(row.__EMPTY_6 ?? '').trim(),
      lat: Number(row.__EMPTY_4),
      lng: Number(row.__EMPTY_5),
      river: String(row.__EMPTY ?? '').trim(),
    }));

  return [...p2Data, ...p1Data];
}

function parsePhase2Demographics() {
  const workbook = xlsx.readFile(phase2DatabaseWorkbookPath, { cellFormula: true, cellNF: true, cellText: true });
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets['original'], { defval: '' });
  return rows.map((row) => ({
    name: String(row['Name of Village'] ?? '').trim(),
    population: Number(row['Total population'] || 0),
    households: Number(row['Total no of Households'] || 0),
  }));
}

async function generateSeed() {
  console.log('Loading metadata...');
  const metadataList = parsePhaseListMetadata();
  const demographicsList = parsePhase2Demographics();

  console.log('Loading Digital Microplanning.xlsx...');
  const wb = xlsx.readFile(mainWorkbookPath);
  const sheets = wb.SheetNames.filter(s => s !== 'Indicators');

  const villages = [];

  for (const sheetName of sheets) {
    try {
      console.log(`Parsing sheet: ${sheetName}...`);
      const sheet = wb.Sheets[sheetName];
      const range = xlsx.utils.decode_range(sheet['!ref']);
      
      const rows = [];
      for (let r = 0; r <= range.e.r; r++) {
        const c0 = sheet[xlsx.utils.encode_cell({ r, c: 0 })]?.v || '';
        const c1 = sheet[xlsx.utils.encode_cell({ r, c: 1 })]?.v || '';
        const c2 = sheet[xlsx.utils.encode_cell({ r, c: 2 })]?.v || '';
        rows.push({ r, c0, c1, c2 });
      }

      // Resolve metadata
      const mappedName = sheetToMetadataMap[sheetName] || sheetName;
      const normalizedMappedName = normalizeName(mappedName);

      let metadata = metadataList.find(m => normalizeName(m.name) === normalizedMappedName);
      if (!metadata) {
        // Try alias lookup
        const alias = metadataAliases.get(normalizedMappedName);
        if (alias) {
          metadata = metadataList.find(m => normalizeName(m.name) === normalizeName(alias));
        }
      }

      if (!metadata) {
        console.warn(`⚠️ Warning: Could not find location metadata for sheet "${sheetName}" (mapped as "${mappedName}")`);
        continue;
      }

      // Resolve demographics
      let demographics = demographicsList.find(d => normalizeName(d.name) === normalizedMappedName);
      if (!demographics) {
        const alias = metadataAliases.get(normalizedMappedName);
        if (alias) {
          demographics = demographicsList.find(d => normalizeName(d.name) === normalizeName(alias));
        }
      }

      const population = demographics?.population || 2500;
      const households = demographics?.households || 500;

      // Extract Categories dynamically
      const scores = [];
      categoryDefs.forEach((def, index) => {
        const startIdx = rows.findIndex(row => String(row.c0).includes(def.match) || String(row.c1).includes(def.match));
        if (startIdx === -1) {
          console.warn(`⚠️ Warning: Could not find category start for: ${def.name} in sheet ${sheetName}`);
          return;
        }

        const nextDef = categoryDefs[index + 1];
        const endIdx = nextDef 
          ? rows.findIndex(row => String(row.c0).includes(nextDef.match) || String(row.c1).includes(nextDef.match)) 
          : rows.findIndex(row => String(row.c0).includes('Final Theme-wise') || String(row.c0).includes('Overall Score'));

        const indicators = [];
        for (let i = startIdx + 1; i < endIdx; i++) {
          const row = rows[i];
          // Ensure we don't accidentally parse row cells that are part of the 'Interpretation' legend table
          const isLegendRow = String(row.c1).includes('Good') || String(row.c1).includes('Moderate') || String(row.c1).includes('Poor') || String(row.c1).includes('Very');
          const hasNumericIndex = typeof row.c0 === 'number' || (typeof row.c0 === 'string' && /^\d+$/.test(row.c0.trim()));
          
          if (hasNumericIndex && !isLegendRow) {
            indicators.push({ name: String(row.c1).trim(), score: Number(row.c2 || 0) });
          }
        }

        const sum = indicators.reduce((s, ind) => s + ind.score, 0);
        const rawThemeScore = indicators.length ? sum / indicators.length : 0;
        const scoreOnScale10 = rawThemeScore;
        const formulaTotal = Math.round(rawThemeScore * 20);

        let output = 'Medium';
        if (rawThemeScore < 2.5) output = 'Low';
        else if (rawThemeScore > 4.0) output = 'High';

        const subCategories = indicators.map((ind) => ({
          subCategory: ind.name,
          score: 5,
          maxScore: 5,
          individualScore: ind.score,
          formulaValue: ind.score,
          indicators: [
            {
              name: ind.name,
              maxIndividualScore: 5,
              individualScore: ind.score
            }
          ]
        }));

        scores.push({
          category: def.name,
          output,
          scoreOnScale10,
          formulaTotal,
          subCategories
        });
      });

      // Calculate Overall Score dynamically from categories
      const overallScore = (scores.reduce((s, c) => s + c.scoreOnScale10, 0) / scores.length);

      villages.push({
        id: slugify(sheetName),
        name: metadata.name,
        district: metadata.district,
        state: metadata.state,
        lat: metadata.lat,
        lng: metadata.lng,
        population,
        households,
        images: getVillageImages(sheetName, slugify(sheetName)),
        overallScore,
        scores
      });

    } catch (error) {
      console.error(`❌ Error parsing sheet "${sheetName}":`, error.message);
    }
  }

  // Write files
  console.log(`Writing seed files for ${villages.length} villages...`);

  const escapeLiteral = (value) => String(value).replace(/'/g, "''");

  const rowsSql = villages
    .map((village) => {
      const images = escapeLiteral(JSON.stringify(village.images));
      const scoresJson = escapeLiteral(JSON.stringify(village.scores));

      return `('${escapeLiteral(village.id)}', '${escapeLiteral(village.name)}', '${escapeLiteral(village.district)}', '${escapeLiteral(village.state)}', ${village.lat}, ${village.lng}, ${village.population}, ${village.households}, ${village.overallScore}, '${images}'::jsonb, '${scoresJson}'::jsonb)`;
    })
    .join(',\n');

  // TRUNCATE is included to completely delete old villages and load the new ones freshly!
  const sql = `truncate table public.villages;\n\ninsert into public.villages (id, name, district, state, lat, lng, population, households, overall_score, images, scores)\nvalues\n${rowsSql}\non conflict (id) do update set\n  name = excluded.name,\n  district = excluded.district,\n  state = excluded.state,\n  lat = excluded.lat,\n  lng = excluded.lng,\n  population = excluded.population,\n  households = excluded.households,\n  overall_score = excluded.overall_score,\n  images = excluded.images,\n  scores = excluded.scores;\n`;

  await writeFile(path.join(rootDir, 'supabase', 'villages.seed.sql'), sql, 'utf8');
  await writeFile(path.join(rootDir, 'supabase', 'villages.seed.json'), JSON.stringify(villages, null, 2), 'utf8');

  console.log('Re-generating bootstrap-all.sql...');
  const schemaPath = path.join(rootDir, 'supabase', 'villages.schema.sql');
  const contentSeedPath = path.join(rootDir, 'supabase', 'site-content.seed.sql');
  
  const schemaContent = await readFile(schemaPath, 'utf8');
  const contentSeedContent = await readFile(contentSeedPath, 'utf8');
  
  const bootstrapAllContent = `${schemaContent.trim()}\n\n${sql.trim()}\n\n${contentSeedContent.trim()}\n`;
  await writeFile(path.join(rootDir, 'supabase', 'bootstrap-all.sql'), bootstrapAllContent, 'utf8');

  console.log(`✓ Successfully updated seed files and bootstrap-all.sql for all ${villages.length} villages.`);
}

generateSeed();
