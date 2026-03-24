/**
 * NEXORA NEURAL HQ - Agent State Types
 * Defines the state and behavior of AI agent avatars
 */

import { AgentRole } from '@/lib/nexora/themes';

export type AgentState = 'idle' | 'working' | 'alert' | 'meeting' | 'transitioning';

export interface AgentPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export interface AgentActivity {
  type: 'coding' | 'scanning' | 'communicating' | 'analyzing' | 'resting' | 'meeting';
  target?: string; // e.g., "PR #42", "Lead: John Doe", "Vulnerability CVE-2024-1234"
  progress?: number; // 0-100
  startedAt: number;
}

export interface NexoraAgent {
  id: string;
  role: AgentRole;
  name: string;
  state: AgentState;
  position: AgentPosition;
  currentRoom: string;
  activity?: AgentActivity;
  stats: {
    tasksCompleted: number;
    activeTime: number; // milliseconds
    lastActivity: number; // timestamp
  };
  // Visual state
  glowIntensity: number;
  particleCount: number;
  isSelected: boolean;
}

// Default agent configurations
export const DEFAULT_AGENTS: Omit<NexoraAgent, 'id'>[] = [
  {
    role: 'pm',
    name: 'Nexus Prime',
    state: 'idle',
    position: { x: 500, y: 0, z: 300, rotation: Math.PI / 2 },
    currentRoom: 'nexus',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
  {
    role: 'developer',
    name: 'Code Weaver',
    state: 'idle',
    position: { x: 600, y: 0, z: 350, rotation: Math.PI / 2 },
    currentRoom: 'nexus',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
  {
    role: 'security',
    name: 'Sentinel',
    state: 'idle',
    position: { x: 1150, y: 0, z: 150, rotation: -Math.PI / 2 },
    currentRoom: 'citadel',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
  {
    role: 'sales',
    name: 'Gold Rush',
    state: 'idle',
    position: { x: 150, y: 0, z: 550, rotation: Math.PI / 2 },
    currentRoom: 'outreachMatrix',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
  {
    role: 'hr_ops',
    name: 'Harmony',
    state: 'idle',
    position: { x: 700, y: 0, z: 350, rotation: Math.PI / 2 },
    currentRoom: 'nexus',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
  {
    role: 'life_admin',
    name: 'Zen Master',
    state: 'idle',
    position: { x: 1350, y: 0, z: 150, rotation: -Math.PI / 2 },
    currentRoom: 'zenGarden',
    stats: { tasksCompleted: 0, activeTime: 0, lastActivity: Date.now() },
    glowIntensity: 0.3,
    particleCount: 5,
    isSelected: false,
  },
];

// Agent state transitions
export const STATE_TRANSITIONS: Record<AgentState, AgentState[]> = {
  idle: ['working', 'meeting', 'transitioning'],
  working: ['idle', 'alert', 'meeting', 'transitioning'],
  alert: ['working', 'idle'],
  meeting: ['idle', 'working'],
  transitioning: ['idle', 'working', 'meeting'],
};

// Activity to state mapping
export const ACTIVITY_STATE_MAP: Record<AgentActivity['type'], AgentState> = {
  coding: 'working',
  scanning: 'working',
  communicating: 'working',
  analyzing: 'working',
  resting: 'idle',
  meeting: 'meeting',
};
