#!/bin/bash

set -e

echo "🚀 MatFlow Setup Script"
echo "========================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    fi
}

echo ""
echo "Checking prerequisites..."
echo "-------------------------"

MISSING=0

check_command "node" || MISSING=1
check_command "pnpm" || MISSING=1
check_command "docker" || MISSING=1
check_command "docker-compose" || MISSING=1

if [ $MISSING -eq 1 ]; then
    echo ""
    echo -e "${RED}Please install missing prerequisites and try again.${NC}"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher (current: $NODE_VERSION)${NC}"
    exit 1
fi

echo ""
echo "Installing dependencies..."
echo "--------------------------"
pnpm install

echo ""
echo "Setting up environment..."
echo "-------------------------"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please edit .env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping${NC}"
fi

echo ""
echo "Starting Docker services..."
echo "---------------------------"
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 5

# Check if PostgreSQL is ready
echo "Checking PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U matflow > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Check if Redis is ready
echo "Checking Redis..."
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    echo "Waiting for Redis..."
    sleep 2
done
echo -e "${GREEN}✓ Redis is ready${NC}"

echo ""
echo "Running database migrations..."
echo "------------------------------"
cd server
pnpm prisma migrate dev --name init
cd ..

echo ""
echo "Seeding database..."
echo "-------------------"
cd server
pnpm prisma db seed
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ MatFlow setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "You can now start the development servers:"
echo ""
echo "  pnpm dev"
echo ""
echo "Or start individual services:"
echo ""
echo "  pnpm --filter @matflow/server dev   # API Server"
echo "  pnpm --filter @matflow/web dev      # Web App"
echo "  pnpm --filter @matflow/desktop tauri dev  # Desktop App"
echo "  pnpm --filter @matflow/mobile start # Mobile App"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@matflow.local"
echo "  Password: Admin123!"
echo ""
