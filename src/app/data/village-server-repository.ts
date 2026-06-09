import { createSupabaseAdminClient } from '../../lib/supabase-admin';
import { createSupabaseServerClient } from '../../lib/supabase-server';
import { mapFormValuesToInsert, mapRowToVillage, parseVillageFormData, validateVillageFormValues, type VillageRow, type VillageUpdate } from './village-db';
import type { Village } from './village-types';

const VILLAGES_SELECT =
  'id, name, district, state, lat, lng, population, households, overall_score, images, scores, created_at, updated_at';

export async function listVillagesServer(): Promise<Village[]> {
  // Use Supabase REST endpoint directly to avoid occasional schema-cache errors
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables for server read.');
  }

  const url = new URL(`${supabaseUrl}/rest/v1/villages`);
  url.searchParams.set('select', VILLAGES_SELECT);
  url.searchParams.set('order', 'name.asc');

  const res = await fetch(url.toString(), {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST read failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as VillageRow[];
  return (data || []).map(mapRowToVillage);
}

export async function createVillageServer(formData: FormData) {
  const values = parseVillageFormData(formData);
  validateVillageFormValues(values);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('villages').insert(mapFormValuesToInsert(values));

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateVillageServer(id: string, patch: VillageUpdate) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('villages').update(patch).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteVillageServer(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('villages').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}