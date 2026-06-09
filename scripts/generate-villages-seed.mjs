import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import xlsx from 'xlsx';

import { readdir } from 'node:fs/promises';
import path from 'node:path';

const phase2Dir = fileURLToPath(new URL('../village/Phase2', import.meta.url));
const listWorkbookPath = fileURLToPath(new URL('../List of Microplan villages Phase I& II.xlsx', import.meta.url));
const phase2DatabaseWorkbookPath = fileURLToPath(new URL('../Final microplan database Phase-2.xlsx', import.meta.url));

const demoImages = [
  'https://images.unsplash.com/photo-1759738104613-5eafde92c12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjByaXZlcmJhbmt8ZW58MXx8fHwxNzcyNDQ2MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1661932912833-b645500de79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc3MjQ0NjM2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1708593343442-7595427ddf7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2aWxsYWdlJTIwY29tbXVuaXR5JTIwbWVldGluZ3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1765635550191-a2a2ba9c07ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMGVudmlyb25tZW50JTIwY29uc2VydmF0aW9uJTIwZ3JlZW58ZW58MXx8fHwxNzcyNDQ2MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

const categoryNameMap = {
  'Community based institution': 'Community Based Institution',
  'Liveliood and skill development': 'Livelihood and Skill Development',
};

const maxIndicatorScoreMap = {
  'Self employed': 60,
  Employment: 40,
  'Constructed toilet %': 40,
  'Toilet in use %': 40,
  'If relevant community toilet': 20,
  'Accessed by household village level': 70,
  'If presence ghat? installed dustbin sufficient': 30,
  'Collection of waste': 25,
  Segregation: 20,
  Dumping: 15,
  Management: 40,
  'Implementation of Scheme related to renewable energy': 50,
  'Scale of household benefitted': 50,
  'Meeting scheduled implemented scale': 100,
  Participation: 20,
  'Conservation Activity scale': 40,
  'Land percent under organic farming': 60,
  'Percent of used insecticides, fertilised, pesticides': 40,
  'Land percent under inorganic farming': 40,
  'Percent of non used insecticides, fertilised, pesticides': 30,
  'Change in traditional crops': 30,
  'Conservation friendly Source of fodder': 60,
  'High productivity breed used': 40,
  'Scale of proper Fishing gear': 40,
  'Non dependence on fishing': 50,
  'Use of pisciculture fish farming': 10,
};

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

const metadataAliases = new Map([
  ['beerwal', 'beerbal'],
  ['nawwa awwal', 'nuawwawal'],
  ['sonbarsa', 'sonbarsha'],
  ['kunja rampur ghat', 'rampur ghat'],
  ['pathanpurva', 'sewada pathanpurva'],
  ['daranagar', 'daranagar vidurkuti'],
  ['chhitupur', 'chitturpur'],
  ['deer forest', 'deer forest'],
  ['dinkarpur', 'dinkerpur'],
  ['nawli', 'navli'],
  ['niwari khadar', 'nivadi khadar'],
  ['rajepur', 'rajapur'],
  ['saidpur', 'saeedpur'],
  ['siswa', 'sisva'],
]);

const villageOverrides = new Map([
  ['nawwa-awwal', {
    population: 7300,
    households: 1400,
  }],
]);

function findMetadataForWorkbook(workbookVillageName, metadataByName) {
  const normalized = normalizeName(workbookVillageName);
  const alias = metadataAliases.get(normalized);

  if (alias && metadataByName.has(alias)) {
    return metadataByName.get(alias);
  }

  if (metadataByName.has(normalized)) {
    return metadataByName.get(normalized);
  }

  for (const [candidateName, metadata] of metadataByName.entries()) {
    if (candidateName.includes(normalized) || normalized.includes(candidateName)) {
      return metadata;
    }
  }

  return undefined;
}

function getCell(sheet, headerIndex, rowIndex, header) {
  const columnIndex = headerIndex[header];
  if (columnIndex == null) {
    return undefined;
  }

  return sheet[xlsx.utils.encode_cell({ r: rowIndex, c: columnIndex })];
}

function getCellFormula(sheet, headerIndex, rowIndex, header) {
  return getCell(sheet, headerIndex, rowIndex, header)?.f ?? '';
}

function parseVillageWorkbook(workbookPath) {
  const workbook = xlsx.readFile(workbookPath, { cellFormula: true, cellNF: true, cellText: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  const range = xlsx.utils.decode_range(sheet['!ref']);
  const headers = [];

  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const address = xlsx.utils.encode_cell({ r: 0, c: column });
    headers[column] = String(sheet[address]?.v ?? '').trim();
  }

  const headerIndex = Object.fromEntries(headers.map((header, index) => [header, index]));
  const normalizedRows = rows.map((row, index) => ({
    rowNumber: index + 2,
    category: String(row.Category ?? '').trim(),
    subCategory: String(row['Sub Category'] ?? '').trim(),
    score: toNumber(row.Score),
    indicatorName: String(row['category (individual category per hundread unit)'] ?? '').trim(),
    indicatorWeight: toNumber(row['Indivividual Score']),
    userScore: toNumber(row['User Score']),
    formulaValue: toNumber(row.Formula),
    formulaExpression: getCellFormula(sheet, headerIndex, index + 1, 'Formula'),
    output: String(row.Output ?? '').trim(),
    categoryRanking: toNumber(row['Category Ranking']),
    categoryRankingFormula: getCellFormula(sheet, headerIndex, index + 1, 'Category Ranking'),
    modelVillageRanking: toNumber(row['Model Village Ranking']),
  }));

  const grouped = new Map();
  let currentCategory = '';

  for (const row of normalizedRows) {
    if (row.category) {
      currentCategory = row.category;
    }

    const rawCategory = currentCategory;
    if (!rawCategory) {
      continue;
    }

    const category = categoryNameMap[rawCategory] ?? rawCategory;
    const categoryEntry = grouped.get(category) ?? {
      category,
      output: row.output || 'Medium',
      scoreOnScale10: clamp(row.categoryRanking || row.modelVillageRanking || 0, 0, 10),
      formulaTotal: 0,
      rankingFormula: row.categoryRankingFormula || '',
      subCategories: [],
    };

    if (row.output) {
      categoryEntry.output = row.output;
    }

    if (row.categoryRanking) {
      categoryEntry.scoreOnScale10 = clamp(row.categoryRanking, 0, 10);
    }

    if (!row.subCategory) {
      const lastSubCategory = categoryEntry.subCategories.at(-1);
      if (lastSubCategory && row.indicatorName) {
        lastSubCategory.indicators.push({
          name: row.indicatorName,
          maxIndividualScore: row.indicatorWeight || (maxIndicatorScoreMap[row.indicatorName] ?? 100),
          individualScore: row.userScore,
        });
      }

      grouped.set(category, categoryEntry);
      continue;
    }

    categoryEntry.subCategories.push({
      subCategory: row.subCategory,
      score: row.score,
      maxScore: row.score,
      individualScore: row.userScore,
      formulaValue: row.formulaValue,
      formulaExpression: row.formulaExpression || undefined,
      indicators: row.indicatorName
        ? [{
            name: row.indicatorName,
            maxIndividualScore: row.indicatorWeight || (maxIndicatorScoreMap[row.indicatorName] ?? 100),
            individualScore: row.userScore,
          }]
        : [],
    });

    categoryEntry.formulaTotal += row.formulaValue;
    grouped.set(category, categoryEntry);
  }

  const scores = Array.from(grouped.values());
  const overallScore = scores.length
    ? normalizedRows[0]?.modelVillageRanking || scores.reduce((sum, category) => sum + category.scoreOnScale10, 0) / scores.length
    : 0;

  return { scores, overallScore };
}

function parsePhaseListMetadata() {
  const workbook = xlsx.readFile(listWorkbookPath, { cellFormula: true, cellNF: true, cellText: true });
  const sheet = workbook.Sheets['Phase 2'] ?? workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  return rows
    .filter((row) => typeof row['Phase II Microplan details'] === 'number' && row.__EMPTY_1)
    .map((row) => ({
      serial: toNumber(row['Phase II Microplan details']),
      river: String(row.__EMPTY ?? '').trim(),
      name: String(row.__EMPTY_1 ?? '').trim(),
      block: String(row.__EMPTY_2 ?? '').trim(),
      district: String(row.__EMPTY_3 ?? '').trim(),
      state: String(row.__EMPTY_4 ?? '').trim(),
      lat: toNumber(row.__EMPTY_5),
      lng: toNumber(row.__EMPTY_6),
      status: String(row.__EMPTY_7 ?? '').trim(),
    }));
}

function parsePhase2DatabaseMetadata() {
  const workbook = xlsx.readFile(phase2DatabaseWorkbookPath, { cellFormula: true, cellNF: true, cellText: true });
  const sheet = workbook.Sheets.original ?? workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  return rows
    .filter((row) => row['Name of Village'])
    .map((row) => ({
      name: String(row['Name of Village'] ?? '').trim(),
      district: String(row.District ?? '').trim(),
      state: String(row.State ?? '').trim(),
      population: toNumber(row['Total population']),
      households: toNumber(row['Total no of Households']),
    }));
}

function findDatabaseMetadataForVillage(workbookVillageName, databaseMetadataByName) {
  const normalized = normalizeName(workbookVillageName);
  const alias = metadataAliases.get(normalized);

  if (databaseMetadataByName.has(normalized)) {
    return databaseMetadataByName.get(normalized);
  }

  if (alias && databaseMetadataByName.has(alias)) {
    return databaseMetadataByName.get(alias);
  }

  for (const [candidateName, metadata] of databaseMetadataByName.entries()) {
    if (candidateName.includes(normalized) || normalized.includes(candidateName)) {
      return metadata;
    }
  }

  return undefined;
}

const metadataRows = parsePhaseListMetadata();
const metadataByName = new Map(metadataRows.map((row) => [normalizeName(row.name), row]));
const databaseMetadataRows = parsePhase2DatabaseMetadata();
const databaseMetadataByName = new Map(databaseMetadataRows.map((row) => [normalizeName(row.name), row]));
const ignoredWorkbookNames = new Set([
  'final individual scoring sheet.xlsx',
]);

const workbookFiles = (await readdir(phase2Dir))
  .filter((fileName) => fileName.toLowerCase().endsWith('.xlsx'))
  .filter((fileName) => !ignoredWorkbookNames.has(fileName.toLowerCase()))
  .sort((left, right) => left.localeCompare(right));

const villages = workbookFiles.map((fileName) => {
  const workbookPath = path.join(phase2Dir, fileName);
  const workbookVillageName = path.basename(fileName, path.extname(fileName)).trim();
  const metadata = findMetadataForWorkbook(workbookVillageName, metadataByName);
  const databaseMetadata = findDatabaseMetadataForVillage(workbookVillageName, databaseMetadataByName);

  if (!metadata) {
    throw new Error(`Missing Phase 2 metadata for workbook: ${fileName}`);
  }

  const { scores, overallScore } = parseVillageWorkbook(workbookPath);

  return {
    id: slugify(workbookVillageName),
    name: metadata.name,
    district: metadata.district,
    state: metadata.state,
    lat: metadata.lat,
    lng: metadata.lng,
    population: villageOverrides.get(slugify(workbookVillageName))?.population ?? databaseMetadata?.population ?? 0,
    households: villageOverrides.get(slugify(workbookVillageName))?.households ?? databaseMetadata?.households ?? 0,
    images: demoImages,
    overallScore,
    scores,
  };
});

const escapeLiteral = (value) => String(value).replace(/'/g, "''");

const rowsSql = villages
  .map((village) => {
    const images = escapeLiteral(JSON.stringify(village.images));
    const scoresJson = escapeLiteral(JSON.stringify(village.scores));

    return `('${escapeLiteral(village.id)}', '${escapeLiteral(village.name)}', '${escapeLiteral(village.district)}', '${escapeLiteral(village.state)}', ${village.lat}, ${village.lng}, ${village.population}, ${village.households}, ${village.overallScore}, '${images}'::jsonb, '${scoresJson}'::jsonb)`;
  })
  .join(',\n');

const sql = `insert into public.villages (id, name, district, state, lat, lng, population, households, overall_score, images, scores)\nvalues\n${rowsSql}\non conflict (id) do update set\n  name = excluded.name,\n  district = excluded.district,\n  state = excluded.state,\n  lat = excluded.lat,\n  lng = excluded.lng,\n  population = excluded.population,\n  households = excluded.households,\n  overall_score = excluded.overall_score,\n  images = excluded.images,\n  scores = excluded.scores;\n`;

await writeFile(new URL('../supabase/villages.seed.sql', import.meta.url), sql, 'utf8');
await writeFile(new URL('../supabase/villages.seed.json', import.meta.url), JSON.stringify(villages, null, 2), 'utf8');

console.log(`Generated seed files for ${villages.length} Phase 2 villages.`);
