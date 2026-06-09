import { readFile } from 'node:fs/promises';
import dns from 'node:dns';
import pg from 'pg';

dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

const clientConfig = connectionString
  ? {
      connectionString,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST ?? 'db.ddjvuubxrbtkxglhtvpb.supabase.co',
      port: Number(process.env.PGPORT ?? 5432),
      user: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE ?? 'postgres',
      ssl: { rejectUnauthorized: false },
    };

const client = new pg.Client(clientConfig);

if (!connectionString && !process.env.PGPASSWORD) {
  throw new Error('Missing PGPASSWORD. Set it before running db:setup:villages, or provide DATABASE_URL/SUPABASE_DB_URL.');
}

const bootstrapSql = await readFile(new URL('../supabase/bootstrap-all.sql', import.meta.url), 'utf8');

try {
  await client.connect();
  await client.query('begin');
  await client.query(bootstrapSql);
  await client.query('commit');

  const villageResult = await client.query('select count(*)::int as count from public.villages');
  const siteContentResult = await client.query('select count(*)::int as count from public.site_content');
  console.log(
    `Villages table ready with ${villageResult.rows[0]?.count ?? 0} rows and site_content ready with ${siteContentResult.rows[0]?.count ?? 0} rows.`
  );
} catch (error) {
  try {
    await client.query('rollback');
  } catch {
    // Ignore rollback failures when the connection drops before the transaction can be closed.
  }

  if (error instanceof Error) {
    throw new Error(
      `Failed to apply bootstrap SQL. Check DATABASE_URL/SUPABASE_DB_URL or PGHOST/PGPORT/PGUSER/PGDATABASE/PGPASSWORD and confirm the Supabase database accepts the selected Postgres connection. Original error: ${error.message}`
    );
  }

  throw error;
} finally {
  await client.end();
}