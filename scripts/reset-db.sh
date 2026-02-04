#!/bin/bash

set -e

echo "🗑️  MatFlow Database Reset Script"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}⚠ WARNING: This will delete ALL data in the database!${NC}"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Resetting database..."
echo "---------------------"

cd server

# Reset Prisma migrations and re-seed
pnpm prisma migrate reset --force

cd ..

echo ""
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@matflow.local"
echo "  Password: Admin123!"
echo ""
