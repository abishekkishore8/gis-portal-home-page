import type { Village } from './village-types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type VillageRow = {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  households: number;
  overall_score: number;
  images: string[];
  scores: Json;
  created_at?: string;
  updated_at?: string;
};

export type VillageInsert = Omit<VillageRow, 'created_at' | 'updated_at'>;

export type VillageUpdate = Partial<Omit<VillageInsert, 'id'>>;

export type VillageFormValues = {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  households: number;
  overallScore: number;
  images: string[];
  scores: Village['scores'];
};

function toJson(value: unknown): Json {
  return value as Json;
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeScores(scores: unknown): Village['scores'] {
  if (!Array.isArray(scores)) {
    return [];
  }

  return scores.map((category) => {
    const categoryValue = category as Record<string, unknown>;
    const subCategories = Array.isArray(categoryValue.subCategories)
      ? categoryValue.subCategories.map((subCategory) => {
          const subCategoryValue = subCategory as Record<string, unknown>;
          return {
            subCategory: String(subCategoryValue.subCategory ?? ''),
            score: toFiniteNumber(subCategoryValue.score),
            maxScore: toFiniteNumber(subCategoryValue.maxScore),
            individualScore: toFiniteNumber(subCategoryValue.individualScore),
            formulaValue: toFiniteNumber(subCategoryValue.formulaValue, toFiniteNumber(subCategoryValue.individualScore)),
            formulaExpression:
              typeof subCategoryValue.formulaExpression === 'string'
                ? subCategoryValue.formulaExpression
                : undefined,
            indicators: Array.isArray(subCategoryValue.indicators)
              ? (subCategoryValue.indicators as Village['scores'][number]['subCategories'][number]['indicators'])
              : [],
          };
        })
      : [];

    const formulaTotal = toFiniteNumber(
      categoryValue.formulaTotal,
      subCategories.reduce((sum, subCategory) => sum + subCategory.formulaValue, 0)
    );
    const scoreOnScale10 = toFiniteNumber(
      categoryValue.scoreOnScale10,
      toFiniteNumber(categoryValue.scoreOnScale5, formulaTotal / 10)
    );

    return {
      category: String(categoryValue.category ?? ''),
      output: String(categoryValue.output ?? 'Medium'),
      scoreOnScale10,
      formulaTotal,
      rankingFormula:
        typeof categoryValue.rankingFormula === 'string' ? categoryValue.rankingFormula : undefined,
      subCategories,
    };
  });
}

export function mapVillageToRow(village: Village): VillageInsert {
  return {
    id: village.id,
    name: village.name,
    district: village.district,
    state: village.state,
    lat: village.lat,
    lng: village.lng,
    population: village.population,
    households: village.households,
    overall_score: village.overallScore,
    images: village.images,
    scores: toJson(village.scores),
  };
}

export function mapRowToVillage(row: VillageRow): Village {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    state: row.state,
    lat: Number(row.lat),
    lng: Number(row.lng),
    population: Number(row.population),
    households: Number(row.households),
    overallScore: Number(row.overall_score),
    images: Array.isArray(row.images) ? row.images : [],
    scores: normalizeScores(row.scores),
  };
}

export function parseVillageFormData(formData: FormData): VillageFormValues {
  const imagesValue = String(formData.get('images') ?? '[]');
  const scoresValue = String(formData.get('scores') ?? '[]');

  return {
    id: String(formData.get('id') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    district: String(formData.get('district') ?? '').trim(),
    state: String(formData.get('state') ?? '').trim(),
    lat: Number(formData.get('lat') ?? 0),
    lng: Number(formData.get('lng') ?? 0),
    population: Number(formData.get('population') ?? 0),
    households: Number(formData.get('households') ?? 0),
    overallScore: Number(formData.get('overallScore') ?? 0),
    images: JSON.parse(imagesValue) as string[],
    scores: JSON.parse(scoresValue) as Village['scores'],
  };
}

export function validateVillageFormValues(values: VillageFormValues) {
  if (!values.id || !values.name || !values.district || !values.state) {
    throw new Error('Village id, name, district, and state are required.');
  }

  if (!Number.isFinite(values.lat) || !Number.isFinite(values.lng)) {
    throw new Error('Latitude and longitude must be valid numbers.');
  }

  if (!Array.isArray(values.images) || !Array.isArray(values.scores)) {
    throw new Error('Images and scores must be valid JSON arrays.');
  }
}

export function mapFormValuesToInsert(values: VillageFormValues): VillageInsert {
  return {
    id: values.id,
    name: values.name,
    district: values.district,
    state: values.state,
    lat: values.lat,
    lng: values.lng,
    population: values.population,
    households: values.households,
    overall_score: values.overallScore,
    images: values.images,
    scores: toJson(values.scores),
  };
}