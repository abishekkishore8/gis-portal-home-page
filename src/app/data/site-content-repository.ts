import { createSupabaseServerClient } from '../../lib/supabase-server';
import { fetchSupabaseRest } from '../../lib/supabase-rest';
import type { SiteContent } from './site-content';

type SiteContentRow = {
  key: string;
  content: SiteContent;
};

export async function getSiteContentServer(): Promise<SiteContent> {
  const res = await fetchSupabaseRest('site_content?select=key,content&key=eq.homepage&limit=1');
  if (!res.ok) {
    throw new Error(`Failed to load site content: ${res.status} ${await res.text()}`);
  }

  const rows = (await res.json()) as SiteContentRow[];
  const row = rows[0] ?? null;

  if (!row?.content) {
    throw new Error('Missing homepage site content in Supabase.');
  }

  return row.content;
}