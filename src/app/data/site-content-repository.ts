import { createSupabaseServerClient } from '../../lib/supabase-server';
import type { SiteContent } from './site-content';

type SiteContentRow = {
  key: string;
  content: SiteContent;
};

export async function getSiteContentServer(): Promise<SiteContent> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('key, content')
    .eq('key', 'homepage')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load site content: ${error.message}`);
  }

  const row = data as SiteContentRow | null;

  if (!row?.content) {
    throw new Error('Missing homepage site content in Supabase.');
  }

  return row.content;
}