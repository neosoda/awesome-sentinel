import { defineConfig } from 'prisma/config'

function normalizeDatabaseUrl(url: string) {
  const parsed = new URL(url)
  const schema = parsed.searchParams.get('schema')

  if (schema) {
    parsed.searchParams.set('schema', schema.replace(/^['"]+|['"]+$/g, ''))
  }

  return parsed.toString()
}

const rawDatabaseUrl = process.env.DATABASE_URL

if (!rawDatabaseUrl) {
  throw new Error('DATABASE_URL environment variable is required for Prisma CLI commands')
}

const databaseUrl = normalizeDatabaseUrl(rawDatabaseUrl)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
})
