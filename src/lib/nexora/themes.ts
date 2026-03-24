/**
 * NEXORA NEURAL HQ - Theme System
 * Dark glassmorphism + cyberpunk aesthetic
 */

// ============================================================
// COLOR PALETTE
// ============================================================

export const NEXORA_COLORS = {
  // Backgrounds
  voidBlack: '#0A0A0F',
  deepSpace: '#12121A',
  
  // Agent Colors
  pmBlue: '#3B82F6',
  developerCyan: '#06B6D4',
  securityRed: '#EF4444',
  salesGold: '#F59E0B',
  hrOpsPurple: '#8B5CF6',
  lifeAdminTeal: '#14B8A6',
  
  // UI Colors
  glassWhite: 'rgba(255, 255, 255, 0.125)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  neonCyan: '#06B6D4',
  neonPurple: '#8B5CF6',
  neonGold: '#F59E0B',
  alertRed: '#EF4444',
  successGreen: '#10B981',
  
  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
} as const;

// Three.js compatible hex numbers
export const NEXORA_COLORS_THREE = {
  voidBlack: 0x0A0A0F,
  deepSpace: 0x12121A,
  pmBlue: 0x3B82F6,
  developerCyan: 0x06B6D4,
  securityRed: 0xEF4444,
  salesGold: 0xF59E0B,
  hrOpsPurple: 0x8B5CF6,
  lifeAdminTeal: 0x14B8A6,
  glassWhite: 0xFFFFFF,
  neonCyan: 0x06B6D4,
  neonPurple: 0x8B5CF6,
  neonGold: 0xF59E0B,
  alertRed: 0xEF4444,
} as const;

// ============================================================
// AGENT THEME MAPPING
// ============================================================

export type AgentRole = 'pm' | 'developer' | 'security' | 'sales' | 'hr_ops' | 'life_admin';

export interface AgentTheme {
  name: string;
  role: AgentRole;
  color: string;
  colorThree: number;
  glowColor: string;
  description: string;
  avatarStyle: string;
}

export const AGENT_THEMES: Record<AgentRole, AgentTheme> = {
  pm: {
    name: 'Project Manager',
    role: 'pm',
    color: NEXORA_COLORS.pmBlue,
    colorThree: NEXORA_COLORS_THREE.pmBlue,
    glowColor: '#3B82F6',
    description: 'Hovering synthetic with data-halo ring',
    avatarStyle: 'synthetic-halo',
  },
  developer: {
    name: 'Developer',
    role: 'developer',
    color: NEXORA_COLORS.developerCyan,
    colorThree: NEXORA_COLORS_THREE.developerCyan,
    glowColor: '#06B6D4',
    description: 'Geometric cyber-construct with floating code matrices',
    avatarStyle: 'cyber-construct',
  },
  security: {
    name: 'Security Analyst',
    role: 'security',
    color: NEXORA_COLORS.securityRed,
    colorThree: NEXORA_COLORS_THREE.securityRed,
    glowColor: '#EF4444',
    description: 'Armored sentinel grid with glowing eyes',
    avatarStyle: 'armored-sentinel',
  },
  sales: {
    name: 'Sales/Outreach',
    role: 'sales',
    color: NEXORA_COLORS.salesGold,
    colorThree: NEXORA_COLORS_THREE.salesGold,
    glowColor: '#F59E0B',
    description: 'Polished liquid-metal humanoid',
    avatarStyle: 'liquid-metal',
  },
  hr_ops: {
    name: 'HR/Operations',
    role: 'hr_ops',
    color: NEXORA_COLORS.hrOpsPurple,
    colorThree: NEXORA_COLORS_THREE.hrOpsPurple,
    glowColor: '#8B5CF6',
    description: 'Central pillar form routing energy',
    avatarStyle: 'energy-pillar',
  },
  life_admin: {
    name: 'Life Admin',
    role: 'life_admin',
    color: NEXORA_COLORS.lifeAdminTeal,
    colorThree: NEXORA_COLORS_THREE.lifeAdminTeal,
    glowColor: '#14B8A6',
    description: 'Bioluminescent avatar with nature motifs',
    avatarStyle: 'bioluminescent',
  },
} as const;

// ============================================================
// GLOW / EMISSIVE PRESETS
// ============================================================

export interface GlowPreset {
  intensity: number;
  emissiveIntensity: number;
  pulseSpeed: number;
  particleCount: number;
}

export const GLOW_PRESETS = {
  idle: {
    intensity: 0.3,
    emissiveIntensity: 0.2,
    pulseSpeed: 0.5,
    particleCount: 5,
  },
  working: {
    intensity: 0.8,
    emissiveIntensity: 0.6,
    pulseSpeed: 1.5,
    particleCount: 20,
  },
  alert: {
    intensity: 1.2,
    emissiveIntensity: 1.0,
    pulseSpeed: 3.0,
    particleCount: 40,
  },
  error: {
    intensity: 1.5,
    emissiveIntensity: 1.2,
    pulseSpeed: 5.0,
    particleCount: 50,
  },
} as const;

// ============================================================
// ROOM AMBIENT LIGHTING
// ============================================================

export const ROOM_LIGHTING = {
  nexus: {
    ambientColor: 0x12121A,
    ambientIntensity: 0.4,
    accentColor: 0x06B6D4,
    accentIntensity: 0.3,
  },
  citadel: {
    ambientColor: 0x1A0A0A,
    ambientIntensity: 0.2,
    accentColor: 0xEF4444,
    accentIntensity: 0.5,
  },
  outreachMatrix: {
    ambientColor: 0x1A1408,
    ambientIntensity: 0.3,
    accentColor: 0xF59E0B,
    accentIntensity: 0.4,
  },
  synapse: {
    ambientColor: 0x0F0A1A,
    ambientIntensity: 0.3,
    accentColor: 0x8B5CF6,
    accentIntensity: 0.4,
  },
  zenGarden: {
    ambientColor: 0x0A1A14,
    ambientIntensity: 0.5,
    accentColor: 0x14B8A6,
    accentIntensity: 0.3,
  },
} as const;

// ============================================================
// MATERIAL PRESETS
// ============================================================

export const MATERIAL_PRESETS = {
  glass: {
    transparent: true,
    opacity: 0.15,
    metalness: 0.9,
    roughness: 0.1,
  },
  holographic: {
    transparent: true,
    opacity: 0.6,
    metalness: 0.3,
    roughness: 0.2,
    emissiveIntensity: 0.5,
  },
  neonTube: {
    emissiveIntensity: 2.0,
    metalness: 0.0,
    roughness: 0.3,
  },
  dataStream: {
    transparent: true,
    opacity: 0.8,
    emissiveIntensity: 1.5,
  },
} as const;

// ============================================================
// CSS CUSTOM PROPERTIES (for injection)
// ============================================================

export const CSS_VARIABLES = `
:root {
  /* Backgrounds */
  --nexora-void-black: ${NEXORA_COLORS.voidBlack};
  --nexora-deep-space: ${NEXORA_COLORS.deepSpace};
  
  /* Agent Colors */
  --nexora-pm-blue: ${NEXORA_COLORS.pmBlue};
  --nexora-developer-cyan: ${NEXORA_COLORS.developerCyan};
  --nexora-security-red: ${NEXORA_COLORS.securityRed};
  --nexora-sales-gold: ${NEXORA_COLORS.salesGold};
  --nexora-hr-ops-purple: ${NEXORA_COLORS.hrOpsPurple};
  --nexora-life-admin-teal: ${NEXORA_COLORS.lifeAdminTeal};
  
  /* UI Colors */
  --nexora-glass-white: ${NEXORA_COLORS.glassWhite};
  --nexora-glass-border: ${NEXORA_COLORS.glassBorder};
  --nexora-neon-cyan: ${NEXORA_COLORS.neonCyan};
  --nexora-neon-purple: ${NEXORA_COLORS.neonPurple};
  --nexora-neon-gold: ${NEXORA_COLORS.neonGold};
  --nexora-alert-red: ${NEXORA_COLORS.alertRed};
  --nexora-success-green: ${NEXORA_COLORS.successGreen};
  
  /* Text */
  --nexora-text-primary: ${NEXORA_COLORS.textPrimary};
  --nexora-text-secondary: ${NEXORA_COLORS.textSecondary};
  --nexora-text-muted: ${NEXORA_COLORS.textMuted};
  
  /* Shadows & Effects */
  --nexora-glow-cyan: 0 0 20px ${NEXORA_COLORS.neonCyan}40;
  --nexora-glow-purple: 0 0 20px ${NEXORA_COLORS.neonPurple}40;
  --nexora-glow-gold: 0 0 20px ${NEXORA_COLORS.neonGold}40;
  --nexora-glow-red: 0 0 20px ${NEXORA_COLORS.alertRed}40;
}
`;

export default NEXORA_COLORS;
