# NEXORA NEURAL HQ — Master Build Plan

> A futuristic, autonomous AI headquarters visualization built on Claw3D

## Vision
Dark-mode glassmorphism + cyberpunk aesthetic. Holographic interfaces, neon accents (cyan, purple, gold), data streams flowing through air. Agents appear as advanced AI constructs, not humans.

---

## Phase 1: The Holographic Shell (Day 1)
**Goal:** Deploy visual environment to domain — idle agents, all rooms, branding

### 1.1 Branding
- [ ] Replace "LUKE HEADQUARTERS" → "NEXORA NEURAL HQ"
- [ ] Update color scheme: dark base, neon cyan/purple/gold accents
- [ ] Add Nexora logo/branding assets

### 1.2 Room Implementation

#### The Nexus (Main Floor)
- [ ] Floating holographic workstations (replace desks)
- [ ] Ambient data streams particles in air
- [ ] 6 agent positions with glow pads
- [ ] Central nexus pillar (optional)

#### The Citadel (Security Ops)
- [ ] Dark room, red ambient lighting
- [ ] Rotating 3D globe hologram (center)
- [ ] Threat indicators on globe surface
- [ ] Security Analyst station with multiple floating screens

#### Outreach Matrix (Sales War Room)
- [ ] Golden ambient lighting
- [ ] Pipeline visualizer on wall (horizontal bar segments)
- [ ] Lead cards floating in space
- [ ] Sales Agent throne/station

#### The Synapse (Meeting Room)
- [ ] Central holographic circular table
- [ ] 6 agent positions around table
- [ ] Central node position (for user when joining)
- [ ] Floating agenda display

#### The Zen Garden (Life Admin)
- [ ] Bioluminescent plants/particles
- [ ] Digital waterfall backdrop
- [ ] Mountain topography terrain
- [ ] Habit/task floating cards with nature styling

### 1.3 Agent Avatars

| Agent | Model Style | Color | Effects |
|-------|-------------|-------|---------|
| PM | Hovering synthetic, data-halo ring | #3B82F6 (Blue) | Halo rotates, pulses on activity |
| Developer | Geometric cyber-construct | #06B6D4 (Cyan) | Code matrix particles orbit |
| Security | Armored sentinel grid | #EF4444 (Red) | Eyes glow brighter on threat |
| Sales | Liquid-metal humanoid | #F59E0B (Gold) | Surface ripples on activity |
| HR/Ops | Central pillar form | #8B5CF6 (Purple) | Energy tendrils to other agents |
| Life Admin | Bioluminescent nature form | #14B8A6 (Teal) | Leaf/petal particles |

### 1.4 Environment
- [ ] Day-night cycle synced to IST (or toggle)
- [ ] Ambient particle systems per room
- [ ] Smooth camera transitions between rooms
- [ ] Room navigation UI (sidebar or minimap)

### 1.5 Deployment
- [ ] Configure .env for production
- [ ] Build Next.js production bundle
- [ ] Deploy to VPS (PM2 or Docker)
- [ ] Set up domain + SSL
- [ ] Configure STUDIO_ACCESS_TOKEN

---

## Phase 2: Neural Wiring (Days 2-3)
**Goal:** Connect Developer, Security, PM to live data

### 2.1 Developer Agent
- [ ] GitHub webhook → OpenClaw → Claw3D events
- [ ] Visual: code streams flow when fetching PR
- [ ] Visual: avatar moves to review station on PR activity
- [ ] Visual: success/fail particles on CI completion

### 2.2 Security Agent
- [ ] SonarCloud webhook integration
- [ ] Sentry webhook integration
- [ ] Visual: globe plots vulnerabilities as red dots
- [ ] Visual: avatar eyes glow on new threat
- [ ] Visual: threat cards appear in Citadel

### 2.3 Project Manager
- [ ] Task state from GitHub issues
- [ ] Visual: data-halo shows task count
- [ ] Visual: PM moves between rooms checking on agents
- [ ] Meeting scheduler integration

### 2.4 Telegram Integration
- [ ] Daily digest cron job (9 AM IST)
- [ ] Real-time critical alerts
- [ ] Meeting notifications (10 min before)

---

## Phase 3: Outreach & Operations (Days 4-5)
**Goal:** Sales and HR agents online

### 3.1 Sales Agent
- [ ] LinkedIn scraping setup (or manual input)
- [ ] Upwork job monitoring
- [ ] CRM (Google Sheets) integration
- [ ] Visual: pipeline updates in Outreach Matrix
- [ ] Visual: lead cards spawn when new lead found
- [ ] Auto-draft outreach messages

### 3.2 HR/Operations Agent
- [ ] Inter-agent message routing
- [ ] Workload monitoring
- [ ] Visual: energy tendrils connect to active agents
- [ ] Conflict detection and alerts

---

## Phase 4: The Personal Link (Days 6-7)
**Goal:** Life Admin + full automation

### 4.1 Life Admin Agent
- [ ] Google Calendar integration
- [ ] Habit tracking system
- [ ] College deadline monitoring
- [ ] Visual: Zen Garden updates with habit completion
- [ ] Visual: mountain terrain reflects progress

### 4.2 Full Async Mode
- [ ] Daily digest generation
- [ ] Weekly summary generation
- [ ] Quiet hours enforcement (11 PM - 8 AM IST)
- [ ] Meeting summaries auto-generated
- [ ] All agents run 24/7 with minimal intervention

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NEXORA NEURAL HQ                      │
│                    (Claw3D Frontend)                     │
├─────────────────────────────────────────────────────────┤
│  Three.js / R3F    │  Next.js App Router  │  Studio UI  │
│  - 3D Rooms        │  - API Routes        │  - Settings │
│  - Agent Avatars   │  - WS Proxy          │  - Chat     │
│  - Particles       │  - Auth              │  - Approvals│
└────────────┬───────┴──────────┬───────────┴─────────────┘
             │                  │
             │ WebSocket        │ HTTP
             ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   OPENCLAW GATEWAY                       │
├─────────────────────────────────────────────────────────┤
│  Agent Runtime  │  Session Mgmt  │  Tool Execution      │
│  - PM Agent     │  - Transcripts │  - GitHub (gh)       │
│  - Dev Agent    │  - Memory      │  - 1Password (op)    │
│  - Security     │  - Cron Jobs   │  - SonarCloud        │
│  - Sales        │                │  - Sentry            │
│  - HR/Ops       │                │  - Telegram          │
│  - Life Admin   │                │  - Calendar          │
└────────────┬────┴────────────────┴──────────────────────┘
             │
             │ Webhooks / APIs
             ▼
┌─────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                      │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│  GitHub  │  Sonar   │  Sentry  │ LinkedIn │  Calendar   │
│  Repos   │  Cloud   │  Errors  │  Leads   │  Events     │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

---

## File Structure (Claw3D Modifications)

```
src/
├── features/
│   └── retro-office/           # → rename to neural-hq/
│       ├── rooms/
│       │   ├── TheNexus.tsx
│       │   ├── TheCitadel.tsx
│       │   ├── OutreachMatrix.tsx
│       │   ├── TheSynapse.tsx
│       │   └── ZenGarden.tsx
│       ├── avatars/
│       │   ├── PMAvatar.tsx
│       │   ├── DeveloperAvatar.tsx
│       │   ├── SecurityAvatar.tsx
│       │   ├── SalesAvatar.tsx
│       │   ├── HROpsAvatar.tsx
│       │   └── LifeAdminAvatar.tsx
│       ├── effects/
│       │   ├── DataStreams.tsx
│       │   ├── HolographicUI.tsx
│       │   ├── NeonGlow.tsx
│       │   └── Particles.tsx
│       └── NexoraHQ.tsx        # Main scene
├── lib/
│   └── nexora/
│       ├── agents.ts           # Agent state management
│       ├── events.ts           # Event → visual mapping
│       └── themes.ts           # Color/style constants
└── app/
    └── office/
        └── page.tsx            # Entry point
```

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Void Black | #0A0A0F | Background |
| Deep Space | #12121A | Secondary BG |
| Neon Cyan | #06B6D4 | Developer, highlights |
| Neon Purple | #8B5CF6 | HR/Ops, accents |
| Neon Gold | #F59E0B | Sales, success |
| Alert Red | #EF4444 | Security, threats |
| Calm Blue | #3B82F6 | PM, info |
| Bio Teal | #14B8A6 | Life Admin, nature |
| Glass White | #FFFFFF20 | Glassmorphism panels |

---

## Commands

```bash
# Development
cd /home/node/.openclaw/workspace/Claw3D
npm install
cp .env.example .env
# Edit .env with gateway URL + token
npm run dev

# Production Build
npm run build
npm run start

# Or with PM2
pm2 start npm --name "nexora-hq" -- start
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Nexora Neural HQ accessible at domain
- [ ] All 5 rooms rendered with correct aesthetics
- [ ] All 6 agent avatars visible (idle state)
- [ ] Branding shows "NEXORA NEURAL HQ"
- [ ] Basic navigation between rooms works

### Full Project Complete When:
- [ ] All agents responding to real events
- [ ] Daily digest arriving on Telegram at 9 AM IST
- [ ] You can watch agents work in real-time
- [ ] System runs 24/7 with minimal intervention
- [ ] You only get pinged for financial/deadline approvals

---

*Created: March 24, 2026*
*Owner: Shanky (ShankyIOS) + Nex ⚡*
