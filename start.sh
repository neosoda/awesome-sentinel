#!/bin/sh
set -e

echo "🌱 Running Prisma database push..."
npx --yes prisma db push

echo "🌾 Running Prisma seed..."
npx --yes tsx prisma/seed.ts

echo "🚀 Starting Next.js server..."
exec node server.js
