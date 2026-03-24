#!/bin/bash
# NEXORA NEURAL HQ - Deploy Script
# Run this from your VPS (not inside Docker)

set -e

echo ""
echo "⚡ ============================================ ⚡"
echo "       NEXORA NEURAL HQ DEPLOYMENT"
echo "⚡ ============================================ ⚡"
echo ""

# Configuration
REPO_URL="https://github.com/Bitshank-2338/Claw3D.git"
BRANCH="nexora-neural-hq"
DEPLOY_DIR="$HOME/nexora-hq"
APP_PORT="${PORT:-3000}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✓ Node.js: $(node -v)"
echo "✓ npm: $(npm -v)"

# Clone or update repository
if [ -d "$DEPLOY_DIR" ]; then
    echo ""
    echo "📦 Updating existing installation..."
    cd "$DEPLOY_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    echo ""
    echo "📦 Cloning repository..."
    git clone --branch "$BRANCH" "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Neural HQ Configuration
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
NEXT_PUBLIC_GATEWAY_WS_URL=ws://localhost:18789
DEBUG=false
PORT=${APP_PORT}
EOF
    echo "⚠️  Edit .env if your OpenClaw gateway is on a different port/host"
fi

# Build the application
echo ""
echo "🏗️  Building Next.js application..."
npm run build

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo ""
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop existing instance
echo ""
echo "🔄 Restarting application..."
pm2 delete nexora-hq 2>/dev/null || true

# Start with PM2
pm2 start npm --name "nexora-hq" -- start -- -p "$APP_PORT"

# Save PM2 config for auto-restart
pm2 save

# Setup PM2 to start on boot (may require sudo)
pm2 startup 2>/dev/null || echo "⚠️  Run 'pm2 startup' manually to enable auto-start on boot"

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "⚡ ============================================ ⚡"
echo "     NEXORA NEURAL HQ DEPLOYED SUCCESSFULLY!"
echo "⚡ ============================================ ⚡"
echo ""
echo "🌐 Access your Neural HQ at:"
echo "   http://${SERVER_IP}:${APP_PORT}/neural-hq"
echo ""
echo "📊 Useful commands:"
echo "   pm2 logs nexora-hq     - View application logs"
echo "   pm2 monit              - Monitor all processes"
echo "   pm2 restart nexora-hq  - Restart the application"
echo "   pm2 stop nexora-hq     - Stop the application"
echo ""
echo "🔧 To connect to OpenClaw gateway:"
echo "   Edit $DEPLOY_DIR/.env and set NEXT_PUBLIC_GATEWAY_WS_URL"
echo "   to your OpenClaw WebSocket endpoint"
echo ""
