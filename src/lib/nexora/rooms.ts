/**
 * NEXORA NEURAL HQ - Room Configuration
 * Coordinate system and room definitions
 */

import { CANVAS_W, CANVAS_H, SCALE } from '@/features/retro-office/core/constants';

// ============================================================
// ROOM TYPES
// ============================================================

export type RoomId = 'nexus' | 'citadel' | 'outreachMatrix' | 'synapse' | 'zenGarden';

export interface RoomBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
  zoom?: number;
}

export interface RoomConfig {
  id: RoomId;
  name: string;
  codename: string;
  description: string;
  aesthetic: string;
  bounds: RoomBounds;
  camera: CameraPosition;
  ambientColor: number;
  accentColor: number;
  spawnPoints: Array<{ x: number; y: number; facing?: number }>;
}

// ============================================================
// ROOM DEFINITIONS
// Based on existing Claw3D layout analysis
// ============================================================

export const NEXORA_ROOMS: Record<RoomId, RoomConfig> = {
  // The Nexus - Main floor (center-left area, replaces main office)
  nexus: {
    id: 'nexus',
    name: 'The Nexus',
    codename: 'NEXUS',
    description: 'Main operations floor with floating holographic workstations',
    aesthetic: 'Floating desks, ambient data streams, central nexus pillar',
    bounds: {
      x: 300,
      y: 250,
      width: 700,
      height: 400,
    },
    camera: {
      position: [12, 14, 12],
      target: [8, 0, 6],
      zoom: 1,
    },
    ambientColor: 0x12121A,
    accentColor: 0x06B6D4,
    spawnPoints: [
      { x: 400, y: 300, facing: Math.PI / 2 },
      { x: 500, y: 350, facing: Math.PI / 2 },
      { x: 600, y: 300, facing: Math.PI / 2 },
      { x: 700, y: 350, facing: Math.PI / 2 },
      { x: 800, y: 300, facing: Math.PI / 2 },
      { x: 550, y: 450, facing: Math.PI / 2 },
    ],
  },

  // The Synapse - Meeting room (top-left corner, existing meeting area)
  synapse: {
    id: 'synapse',
    name: 'The Synapse',
    codename: 'SYNAPSE',
    description: 'Central holographic conference table for agent coordination',
    aesthetic: 'Circular holographic table, floating agenda displays, command node',
    bounds: {
      x: 0,
      y: 0,
      width: 290,
      height: 235,
    },
    camera: {
      position: [3, 8, 3],
      target: [2, 0, 2],
      zoom: 1.2,
    },
    ambientColor: 0x0F0A1A,
    accentColor: 0x8B5CF6,
    spawnPoints: [
      { x: 100, y: 100, facing: Math.PI },
      { x: 150, y: 80, facing: Math.PI },
      { x: 200, y: 100, facing: Math.PI },
      { x: 100, y: 150, facing: 0 },
      { x: 150, y: 170, facing: 0 },
      { x: 200, y: 150, facing: 0 },
    ],
  },

  // The Citadel - Security ops (server room area, east wing)
  citadel: {
    id: 'citadel',
    name: 'The Citadel',
    codename: 'CITADEL',
    description: 'Security operations center with threat visualization',
    aesthetic: 'Dark with red ambient, rotating 3D globe, threat indicators',
    bounds: {
      x: 1092,
      y: 40,
      width: 200,
      height: 300,
    },
    camera: {
      position: [22, 10, 4],
      target: [20, 0, 5],
      zoom: 1.1,
    },
    ambientColor: 0x1A0A0A,
    accentColor: 0xEF4444,
    spawnPoints: [
      { x: 1150, y: 150, facing: -Math.PI / 2 },
      { x: 1200, y: 200, facing: -Math.PI / 2 },
    ],
  },

  // Outreach Matrix - Sales war room (can be bottom-left or new area)
  outreachMatrix: {
    id: 'outreachMatrix',
    name: 'Outreach Matrix',
    codename: 'MATRIX',
    description: 'Sales operations with pipeline visualization',
    aesthetic: 'Golden ambient lighting, live pipeline bars, lead cards',
    bounds: {
      x: 0,
      y: 480,
      width: 300,
      height: 240,
    },
    camera: {
      position: [2, 10, 12],
      target: [3, 0, 10],
      zoom: 1.1,
    },
    ambientColor: 0x1A1408,
    accentColor: 0xF59E0B,
    spawnPoints: [
      { x: 100, y: 550, facing: Math.PI / 2 },
      { x: 200, y: 600, facing: Math.PI / 2 },
    ],
  },

  // The Zen Garden - Life Admin (gym/wellness area, east wing)
  zenGarden: {
    id: 'zenGarden',
    name: 'The Zen Garden',
    codename: 'ZEN',
    description: 'Personal wellness and habit tracking sanctuary',
    aesthetic: 'Bioluminescent plants, digital waterfalls, mountain terrain',
    bounds: {
      x: 1300,
      y: 40,
      width: 200,
      height: 300,
    },
    camera: {
      position: [26, 8, 4],
      target: [24, 0, 5],
      zoom: 1.0,
    },
    ambientColor: 0x0A1A14,
    accentColor: 0x14B8A6,
    spawnPoints: [
      { x: 1350, y: 150, facing: -Math.PI / 2 },
      { x: 1400, y: 200, facing: -Math.PI / 2 },
    ],
  },
} as const;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get room by world coordinates
 */
export function getRoomAtPosition(x: number, y: number): RoomConfig | null {
  for (const room of Object.values(NEXORA_ROOMS)) {
    const { bounds } = room;
    if (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    ) {
      return room;
    }
  }
  return null;
}

/**
 * Get spawn points for a specific room
 */
export function getRoomSpawnPoints(roomId: RoomId): Array<{ x: number; y: number; facing?: number }> {
  return NEXORA_ROOMS[roomId]?.spawnPoints ?? [];
}

/**
 * Get camera preset for a room
 */
export function getRoomCamera(roomId: RoomId): CameraPosition {
  return NEXORA_ROOMS[roomId]?.camera ?? NEXORA_ROOMS.nexus.camera;
}

/**
 * Convert canvas coordinates to world coordinates
 */
export function toWorldCoords(canvasX: number, canvasY: number): [number, number, number] {
  return [canvasX * SCALE, 0, canvasY * SCALE];
}

/**
 * Get all room IDs
 */
export function getAllRoomIds(): RoomId[] {
  return Object.keys(NEXORA_ROOMS) as RoomId[];
}

/**
 * Camera presets for quick navigation
 */
export const NEXORA_CAMERA_PRESETS = {
  overview: {
    position: [16, 20, 16] as [number, number, number],
    target: [8, 0, 6] as [number, number, number],
    zoom: 0.8,
  },
  nexus: NEXORA_ROOMS.nexus.camera,
  synapse: NEXORA_ROOMS.synapse.camera,
  citadel: NEXORA_ROOMS.citadel.camera,
  outreachMatrix: NEXORA_ROOMS.outreachMatrix.camera,
  zenGarden: NEXORA_ROOMS.zenGarden.camera,
} as const;

export default NEXORA_ROOMS;
