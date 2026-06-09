import pg from 'pg';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

const client = new pg.Client({
  host: 'db.ddjvuubxrbtkxglhtvpb.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.PGPASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const dbResult = await client.query(
    'select current_database() as db, current_user as username'
  );
  console.log('connection');
  console.log(JSON.stringify(dbResult.rows, null, 2));

  const tablesResult = await client.query(`
    select table_schema, table_name
    from information_schema.tables
    where table_schema not in ('pg_catalog', 'information_schema')
    order by table_schema, table_name
    limit 20
  `);
  console.log('tables');
  console.log(JSON.stringify(tablesResult.rows, null, 2));
} finally {
  await client.end();
}