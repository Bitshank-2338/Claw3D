# Nexora Neural HQ - Secure Credential Management

## 🔐 1Password CLI Setup Complete

### Current Status:
✅ **1Password CLI Authenticated** - Service account active
✅ **GitHub CLI Authenticated** - Bitshank-2338 account connected  
✅ **Nexora Keys Vault** - Existing credential storage ready
✅ **Repository Updated** - Remote now points to your Claw3D fork

### Existing Credentials in Nexora Keys Vault:
- **Sentry DSN** - Error tracking
- **Sentry Token** - Monitoring access
- **SonarCloud Token** - Security analysis
- **SonarCloud Organization URL** - Security service endpoint
- **SonarCloud Host URL** - Security service host
- **GitHub Token** - Repository access

### Additional Credentials Needed for Nexora Neural HQ:

**Core Application:**
```bash
# Studio Access Token for production deployment
op item create --category=password --title="Nexora Studio Token" --vault="Nexora Keys" \
  password="nexora_hq_studio_$(date +%Y%m%d)" \
  notesPlain="Studio access token for Nexora Neural HQ external deployment"

# OpenClaw Gateway Token (from your existing setup)
op item create --category=password --title="OpenClaw Gateway Token" --vault="Nexora Keys" \
  password="your_openclaw_gateway_token_here" \
  notesPlain="OpenClaw Gateway authentication for agent communication"
```

**Optional Integrations:**
```bash
# ElevenLabs API Key (for voice features)
op item create --category=password --title="ElevenLabs API Key" --vault="Nexora Keys" \
  password="your_elevenlabs_api_key_here" \
  notesPlain="Voice synthesis for agent interactions"

# Production Database URLs (if using external storage)
op item create --category=password --title="Nexora Production DB" --vault="Nexora Keys" \
  password="postgresql://user:pass@host:port/db" \
  notesPlain="Production database connection for Nexora HQ"
```

## 🔧 Environment Configuration with 1Password

### Secure .env Setup:
```bash
# Create environment file with 1Password references
cat > .env.production << 'EOF'
# Core Configuration
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
PORT=3000
HOST=0.0.0.0
DEBUG=false

# Secure Credentials (loaded via op inject)
STUDIO_ACCESS_TOKEN="op://Nexora Keys/Nexora Studio Token/password"
OPENCLAW_GATEWAY_TOKEN="op://Nexora Keys/OpenClaw Gateway Token/password"
GITHUB_TOKEN="op://Nexora Keys/GitHub Token/password"

# External Services
SENTRY_DSN="op://Nexora Keys/Sentry DSN/password"
SENTRY_TOKEN="op://Nexora Keys/Sentry Token/password"
SONARCLOUD_TOKEN="op://Nexora Keys/SonarCloud Token/password"
SONARCLOUD_ORG="op://Nexora Keys/SonarCloud Organization URL/password"

# Optional Features
ELEVENLABS_API_KEY="op://Nexora Keys/ElevenLabs API Key/password"
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL_ID=eleven_flash_v2_5

# Nexora Specific
NEXORA_OFFICE_MODE=neural_hq
NEXORA_AGENT_COUNT=5
NEXORA_DEPLOYMENT_ENV=production
EOF
```

### Secure Deployment Commands:
```bash
# Run development with injected secrets
op inject -i .env.production -o .env && npm run dev

# Build with secure environment  
op inject -i .env.production -o .env && npm run build

# Production start with secrets
op inject -i .env.production -o .env && npm run start
```

## 🚀 Git Workflow with Secure Credentials

### Safe Repository Operations:
```bash
# Authenticate git operations with 1Password stored token
export GITHUB_TOKEN=$(op item get "GitHub Token" --vault="Nexora Keys" --field password)

# Commit and push changes
git add .
git commit -m "feat: Initialize Nexora Neural HQ with secure credential management"
git push origin main

# Create releases with authenticated CLI
gh release create v1.0.0 --title "Nexora Neural HQ v1.0" --notes "Initial release with 5-agent system"
```

## ✅ Next Steps

1. **Add Missing Credentials** - Run the `op item create` commands for any missing keys
2. **Update Environment** - Use the secure .env.production template
3. **Test Injection** - Verify `op inject` works with your credentials
4. **Deploy Securely** - Use injected environment for production deployment
5. **Commit Safely** - Push configuration changes without exposing secrets

**Ready to proceed with secure credential management! All sensitive data will be stored in 1Password, never in your repository.** 🔐

---
*Note: Never commit .env files with real credentials - always use 1Password injection*