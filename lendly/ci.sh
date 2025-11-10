#!/bin/bash

# CI script for Lendly
# Runs typecheck, lint, and build

set -e

echo "🔍 Running typecheck..."
pnpm exec tsc --noEmit

echo "✅ Typecheck passed"

echo "🔍 Running linter..."
pnpm lint

echo "✅ Lint passed"

echo "🔍 Generating Prisma Client..."
pnpm db:generate

echo "🔍 Building application..."
pnpm build

echo "✅ Build passed"
echo "🎉 All checks passed!"

