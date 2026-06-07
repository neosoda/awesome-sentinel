#!/bin/sh

# On définit un dossier temporaire pour le cache npm afin d'éviter les erreurs de permissions
export npm_config_cache=/tmp/.npm

echo "🌱 Running Prisma database push..."
# db push est parfait pour les déploiements automatisés sans fichiers de migrations
npx prisma db push --accept-data-loss || echo "⚠️ Prisma database push failed"

echo "🌾 Running Prisma seed..."
# On ignore les erreurs du seed pour que le serveur démarre quoi qu'il arrive
node prisma/seed.js || echo "⚠️ Prisma seed failed or already seeded"

echo "🚀 Starting Next.js server..."
exec node server.js
