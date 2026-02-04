#!/bin/bash

set -e

echo "🧹 MatFlow Docker Cleanup Script"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}⚠ WARNING: This will stop and remove all MatFlow Docker containers and volumes!${NC}"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Stopping containers..."
docker-compose down

echo ""
echo "Removing volumes..."
docker-compose down -v

echo ""
echo "Removing orphan containers..."
docker-compose rm -f

echo ""
echo -e "${GREEN}✅ Docker cleanup complete!${NC}"
echo ""
echo "Run 'docker-compose up -d' to start fresh containers."
