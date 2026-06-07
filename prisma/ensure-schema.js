const { Client } = require('pg')

function normalizeDatabaseUrl(url) {
  const parsed = new URL(url)
  const schema = parsed.searchParams.get('schema')

  if (schema) {
    parsed.searchParams.set('schema', schema.replace(/^['"]+|['"]+$/g, ''))
  }

  return parsed
}

function quoteIdentifier(value) {
  return `"${value.replace(/"/g, '""')}"`
}

async function main() {
  const rawDatabaseUrl = process.env.DATABASE_URL

  if (!rawDatabaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const parsed = normalizeDatabaseUrl(rawDatabaseUrl)
  const schema = parsed.searchParams.get('schema')

  if (!schema) {
    console.log('ℹ️ No PostgreSQL schema configured, skipping schema bootstrap')
    return
  }

  parsed.searchParams.delete('schema')

  const client = new Client({
    connectionString: parsed.toString(),
  })

  await client.connect()
  await client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schema)}`)
  await client.end()

  console.log(`✅ PostgreSQL schema ensured: ${schema}`)
}

main().catch((error) => {
  console.error('❌ Failed to ensure PostgreSQL schema')
  console.error(error)
  process.exit(1)
})
