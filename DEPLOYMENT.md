# Nexora Neural HQ - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

The fastest way to get Nexora Neural HQ live:

### 1. Deploy to Vercel

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy from the nexora-neural-hq branch
cd Claw3D
vercel --prod
```

Or use the Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import `Bitshank-2338/Claw3D`
3. Select branch: `nexora-neural-hq`
4. Deploy

**Live URL will be:** `https://claw3d-<random>.vercel.app/neural-hq`

### 2. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_GATEWAY_WS_URL=ws://157.245.102.181:18789
```

(Update the IP to your VPS gateway address)

### 3. Access

Once deployed, visit: `https://your-vercel-url.vercel.app/neural-hq`

---

## 🐳 Local Docker Deployment (Alternative)

**Note:** Currently experiencing Next.js bus errors in the OpenClaw Docker container.  
This is a known issue with Next.js 16 + React Three Fiber in some Docker environments.

### Workaround Options:

#### Option A: Build on Host, Run in Container
```bash
# On VPS host (outside Docker):
cd ~/Claw3D
git checkout nexora-neural-hq
npm install
npm run build

# Copy build to container or serve with nginx
```

#### Option B: Use Node 18 LTS
```bash
# Downgrade Node.js to LTS version
nvm install 18
nvm use 18
cd Claw3D
rm -rf node_modules package-lock.json
npm install
npm run build
npm start
```

#### Option C: Static Export
```bash
# Export as static HTML/JS
npm run build
npx next export
# Serve the 'out' directory with any web server
```

---

## 📡 Connecting to OpenClaw Gateway

The Neural HQ connects to your OpenClaw gateway via WebSocket to display real-time agent status.

### Gateway Configuration

Ensure your OpenClaw gateway is configured to allow connections:

```json
{
  "gateway": {
    "port": 18789,
    "bind": "lan",
    "controlUi": {
      "allowedOrigins": ["*"],
      "allowInsecureAuth": true
    }
  }
}
```

### Environment Variables

- **Local:** `NEXT_PUBLIC_GATEWAY_WS_URL=ws://localhost:18789`
- **Remote:** `NEXT_PUBLIC_GATEWAY_WS_URL=ws://your-vps-ip:18789`
- **Production:** Use a reverse proxy with SSL: `wss://gateway.yourdomain.com`

---

## 🎨 Features Deployed

✅ **Phase 1 Complete:**
- 3D futuristic Neural HQ environment
- 6 specialized agent avatars (PM, Developer, Security, Sales, HR/Ops, Life Admin)
- 5 themed rooms (Nexus, Citadel, Synapse, Outreach Matrix, Zen Garden)
- Real-time gateway connection (simulation mode when offline)
- Interactive UI (stats panel, room navigation, agent details)
- Holographic effects, data streams, ambient particles

**Next:** Phase 2 - Wire up actual OpenClaw agents, GitHub webhooks, SonarCloud integration

---

## 🔧 Troubleshooting

### Bus Error on `npm run build`
- Known issue with Next.js 16 in some environments
- **Solution:** Deploy to Vercel (cloud build) or use Option A/B/C above

### Gateway Connection Failed
- Check OpenClaw gateway is running: `curl http://localhost:18789`
- Verify `NEXT_PUBLIC_GATEWAY_WS_URL` environment variable
- Check firewall allows port 18789

### Blank Screen / Nothing Loads
- Check browser console for errors
- Verify `/neural-hq` route (not root `/`)
- Try clearing browser cache

---

## 📞 Support

Issues? Check:
- GitHub: https://github.com/Bitshank-2338/Claw3D/issues
- Branch: `nexora-neural-hq`

**Current Status:** Phase 1 visual shell complete, deployed on Vercel recommended due to Docker environment constraints.
