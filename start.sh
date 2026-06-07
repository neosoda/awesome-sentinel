#!/bin/sh

# On définit un dossier temporaire pour le cache npm afin d'éviter les erreurs de permissions
export npm_config_cache=/tmp/.npm

echo "🌱 Running Prisma database migration..."
# migrate deploy est non-interactif et fait pour la production (ne bloque pas le conteneur)
npx --yes prisma migrate deploy || echo "⚠️ Prisma migration failed"

echo "🌾 Running Prisma seed..."
# On ignore les erreurs du seed pour que le serveur démarre quoi qu'il arrive
node prisma/seed.js || echo "⚠️ Prisma seed failed or already seeded"

echo "🚀 Starting Next.js server..."
exec node server.js
