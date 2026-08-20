import { createSupabaseAdminClient } from '../../lib/supabase-admin';
import { createSupabaseServerClient } from '../../lib/supabase-server';
import { fetchSupabaseRest } from '../../lib/supabase-rest';
import { mapFormValuesToInsert, mapRowToVillage, parseVillageFormData, validateVillageFormValues, type VillageRow, type VillageUpdate } from './village-db';
import type { Village } from './village-types';

const VILLAGES_SELECT =
  'id, name, district, state, lat, lng, population, households, overall_score, images, scores, created_at, updated_at';

export async function listVillagesServer(): Promise<Village[]> {
  const params = new URLSearchParams({ select: VILLAGES_SELECT, order: 'name.asc' });
  const res = await fetchSupabaseRest(`villages?${params.toString()}`);

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