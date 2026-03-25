#!/bin/bash
# Nexora Neural HQ - Secure Deployment Script

set -e

echo "🔐 Nexora Neural HQ - Secure Deployment Starting..."

# Check 1Password CLI authentication
if ! op whoami &>/dev/null; then
    echo "❌ Error: 1Password CLI not authenticated"
    echo "Please run: op signin"
    exit 1
fi

# Inject secrets into environment
echo "🔑 Injecting secure credentials from 1Password..."
op inject -i .env.secure -o .env

# Validate required environment variables
echo "✅ Validating environment configuration..."
source .env

if [[ -z "$STUDIO_ACCESS_TOKEN" || -z "$GITHUB_TOKEN" ]]; then
    echo "❌ Error: Missing required credentials in environment"
    exit 1
fi

echo "📦 Building Nexora Neural HQ..."
npm run build

echo "🚀 Starting production server..."
npm run start

echo "✅ Nexora Neural HQ deployed successfully!"
echo "🌐 Access: http://localhost:3000"
echo "🔒 All credentials loaded securely from 1Password"