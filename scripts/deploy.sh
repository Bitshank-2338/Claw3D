#!/bin/bash
# NEXORA NEURAL HQ - Deploy Script
# Run this from your VPS (not inside Docker)

set -e

DEPLOY_DIR="$HOME/nexora-hq"
REPO_DIR="$HOME/.openclaw/workspace/Claw3D"

echo "⚡ NEXORA NEURAL HQ DEPLOYMENT"
echo "=============================="

# Check if repo exists
if [ ! -d "$REPO_DIR" ]; then
    echo "📦 Cloning Claw3D repository..."
    mkdir -p "$HOME/.openclaw/workspace"
    git clone https://github.com/Bitshank-2338/Claw3D.git "$REPO_DIR"
fi

cd "$REPO_DIR"

# Checkout the nexora branch
echo "🔄 Checking out nexora-neural-hq branch..."
git fetch origin
git checkout nexora-neural-hq || git checkout -b nexora-neural-hq

# Pull latest
git pull origin nexora-neural-hq 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Edit .env with your gateway URL and token!"
fi

# Build
echo "🏗️  Building Next.js app..."
npm run build

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop existing if running
pm2 delete nexora-hq 2>/dev/null || true

# Start with PM2
echo "🚀 Starting Nexora Neural HQ..."
pm2 start npm --name "nexora-hq" -- start

# Save PM2 config
pm2 save

echo ""
echo "✅ NEXORA NEURAL HQ DEPLOYED!"
echo "=============================="
echo "Access at: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Commands:"
echo "  pm2 logs nexora-hq   - View logs"
echo "  pm2 restart nexora-hq - Restart"
echo "  pm2 stop nexora-hq    - Stop"
echo ""
