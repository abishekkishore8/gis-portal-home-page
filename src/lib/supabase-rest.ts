const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

export async function fetchSupabaseRest(path: string, init: RequestInit = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase server environment variables.');
  }

  const headers = new Headers(init.headers);
  headers.set('apikey', supabaseKey);
  headers.set('Authorization', `Bearer ${supabaseKey}`);
  headers.set('Accept', 'application/json');

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(`${supabaseUrl}/rest/v1/${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Supabase request failed after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`);
}
