#!/bin/bash

set -e

echo "📝 MatFlow Type Generation Script"
echo "=================================="

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo "Generating Prisma client..."
cd server
pnpm prisma generate
cd ..

echo ""
echo "Building types package..."
pnpm --filter @matflow/types build

echo ""
echo "Building validators package..."
pnpm --filter @matflow/validators build

echo ""
echo -e "${GREEN}✅ Type generation complete!${NC}"
