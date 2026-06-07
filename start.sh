#!/bin/sh
set -e

# On définit un dossier temporaire pour le cache npm afin d'éviter les erreurs de permissions
export npm_config_cache=/tmp/.npm

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL environment variable is required"
  exit 1
fi

echo "🌱 Running Prisma database push..."
# db push est utilisé ici car le projet ne versionne pas encore de migrations SQL.
# On ne démarre pas l'application si le schéma n'a pas pu être créé.
npx prisma db push --accept-data-loss --skip-generate

echo "🌾 Running Prisma seed..."
# On ignore les erreurs du seed pour que le serveur démarre quoi qu'il arrive
if [ -f prisma/seed.js ]; then
  node prisma/seed.js || echo "⚠️ Prisma seed failed or already seeded"
else
  echo "⚠️ Prisma seed.js not found, skipping seed"
fi

echo "🚀 Starting Next.js server..."
exec node server.js
