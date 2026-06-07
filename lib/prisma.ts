import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function sanitizeSchemaName(schema: string) {
  return schema.replace(/\\/g, '').replace(/^['"]+|['"]+$/g, '').trim()
}

function normalizeDatabaseUrl(url: string) {
  const parsed = new URL(url)
  const schema = parsed.searchParams.get('schema')

  if (schema) {
    parsed.searchParams.set('schema', sanitizeSchemaName(schema))
  }

  return parsed.toString()
}

function createPrismaClient() {
  const rawConnectionString = process.env.DATABASE_URL
  if (!rawConnectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const parsedConnectionString = new URL(normalizeDatabaseUrl(rawConnectionString))
  const schema = parsedConnectionString.searchParams.get('schema') ?? undefined
  const connectionString = parsedConnectionString.toString()
  const adapter = new PrismaPg(connectionString, { schema })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const client = createPrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient()
    const value = Reflect.get(client as object, property, receiver)

    return typeof value === 'function' ? value.bind(client) : value
  },
})
