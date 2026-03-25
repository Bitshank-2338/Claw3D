#!/bin/bash
# Nexora Neural HQ - Secure Development Script

set -e

echo "🔐 Nexora Neural HQ - Secure Development Starting..."

# Check 1Password CLI authentication
if ! op whoami &>/dev/null; then
    echo "❌ Error: 1Password CLI not authenticated"
    echo "Please run: op signin"
    exit 1
fi

# Inject secrets into environment
echo "🔑 Injecting secure credentials from 1Password..."
op inject -i .env.secure -o .env

echo "🛠️  Starting development server..."
npm run dev

echo "✅ Nexora Neural HQ development server started!"
echo "🌐 Access: http://localhost:3000"