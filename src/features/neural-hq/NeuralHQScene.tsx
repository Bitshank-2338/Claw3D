/**
 * NEXORA NEURAL HQ - Main Scene
 * The futuristic AI headquarters visualization
 */

'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

import { NEXORA_COLORS_THREE, AGENT_THEMES, AgentRole } from '@/lib/nexora/themes';
import { NEXORA_ROOMS, RoomId } from '@/lib/nexora/rooms';
import { BaseAvatar } from './avatars';
import { DataStreams, HoloPanel, HoloGlobe, HoloTable, AmbientParticles, BioluminescentParticles } from './effects';
import { NexoraAgent, DEFAULT_AGENTS, AgentState } from './types';

// ============================================================
// ROOM COMPONENTS
// ============================================================

function TheNexus() {
  return (
    <group position={[8, 0, 5]}>
      {/* Floor platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial
          color={NEXORA_COLORS_THREE.deepSpace}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[14, 28, NEXORA_COLORS_THREE.neonCyan, NEXORA_COLORS_THREE.deepSpace]}
        position={[0, 0.01, 0]}
      />

      {/* Floating holographic workstations */}
      {[[-3, 0], [-1, 0], [1, 0], [3, 0], [-2, 2], [2, 2]].map(([x, z], i) => (
        <group key={i} position={[x, 0.5, z]}>
          <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
            <mesh>
              <boxGeometry args={[1.2, 0.05, 0.8]} />
              <meshStandardMaterial
                color={NEXORA_COLORS_THREE.neonCyan}
                transparent
                opacity={0.3}
                emissive={NEXORA_COLORS_THREE.neonCyan}
                emissiveIntensity={0.2}
              />
            </mesh>
          </Float>
        </group>
      ))}

      {/* Central nexus pillar */}
      <group position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.5, 3, 16]} />
          <meshStandardMaterial
            color={NEXORA_COLORS_THREE.neonCyan}
            transparent
            opacity={0.4}
            emissive={NEXORA_COLORS_THREE.neonCyan}
            emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight
          color={NEXORA_COLORS_THREE.neonCyan}
          intensity={2}
          distance={8}
          position={[0, 2, 0]}
        />
      </group>

      {/* NEXORA NEURAL HQ title */}
      <Float speed={1} floatIntensity={0.1}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.6}
          color={NEXORA_COLORS_THREE.neonCyan}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={NEXORA_COLORS_THREE.deepSpace}
        >
          NEXORA NEURAL HQ
        </Text>
      </Float>
    </group>
  );
}

function TheCitadel() {
  const threatPoints = useMemo(() => [
    { lat: 40.7, lng: -74, severity: 'high' as const },
    { lat: 51.5, lng: -0.1, severity: 'medium' as const },
    { lat: 35.7, lng: 139.7, severity: 'low' as const },
    { lat: -33.9, lng: 151.2, severity: 'medium' as const },
  ], []);

  return (
    <group position={[20, 0, 4]}>
      {/* Dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
          color={0x0a0505}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Security globe */}
      <HoloGlobe
        position={[0, 2, 0]}
        radius={1.2}
        color={NEXORA_COLORS_THREE.securityRed}
        threatPoints={threatPoints}
      />

      {/* Alert panels */}
      <HoloPanel
        position={[-2, 1.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
        width={1.2}
        height={1.5}
        color={NEXORA_COLORS_THREE.securityRed}
        title="THREATS"
        content="Active: 3\nCritical: 1"
      />

      {/* Red ambient light */}
      <pointLight
        color={NEXORA_COLORS_THREE.securityRed}
        intensity={0.5}
        distance={10}
        position={[0, 3, 0]}
      />

      {/* Room label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color={NEXORA_COLORS_THREE.securityRed}
        anchorX="center"
      >
        THE CITADEL
      </Text>
    </group>
  );
}

function TheSynapse() {
  return (
    <group position={[2, 0, 2]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color={NEXORA_COLORS_THREE.deepSpace}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Holographic meeting table */}
      <HoloTable
        position={[0, 0.1, 0]}
        radius={2}
        color={NEXORA_COLORS_THREE.hrOpsPurple}
      />

      {/* Meeting seats (represented as glow pads) */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 2.2;
        const z = Math.sin(rad) * 2.2;
        return (
          <mesh key={i} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshStandardMaterial
              color={NEXORA_COLORS_THREE.hrOpsPurple}
              transparent
              opacity={0.4}
              emissive={NEXORA_COLORS_THREE.hrOpsPurple}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Room label */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color={NEXORA_COLORS_THREE.hrOpsPurple}
        anchorX="center"
      >
        THE SYNAPSE
      </Text>
    </group>
  );
}

function OutreachMatrix() {
  return (
    <group position={[2, 0, 10]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial
          color={0x1a1408}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Pipeline visualization panels */}
      <HoloPanel
        position={[0, 1.5, -1.5]}
        width={4}
        height={1.2}
        color={NEXORA_COLORS_THREE.salesGold}
        title="PIPELINE"
        content="Leads: 47 | Qualified: 12 | Closed: 3"
      />

      {/* Lead cards */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <Float key={i} speed={2} floatIntensity={0.2}>
          <mesh position={[x, 0.8, 0]}>
            <boxGeometry args={[0.8, 1, 0.05]} />
            <meshStandardMaterial
              color={NEXORA_COLORS_THREE.salesGold}
              transparent
              opacity={0.3}
              emissive={NEXORA_COLORS_THREE.salesGold}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Golden ambient light */}
      <pointLight
        color={NEXORA_COLORS_THREE.salesGold}
        intensity={0.8}
        distance={8}
        position={[0, 2, 0]}
      />

      {/* Room label */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color={NEXORA_COLORS_THREE.salesGold}
        anchorX="center"
      >
        OUTREACH MATRIX
      </Text>
    </group>
  );
}

function ZenGarden() {
  return (
    <group position={[24, 0, 4]}>
      {/* Natural floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          color={0x0a1a14}
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Digital waterfall backdrop */}
      <mesh position={[0, 1.5, -2]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial
          color={NEXORA_COLORS_THREE.lifeAdminTeal}
          transparent
          opacity={0.2}
          emissive={NEXORA_COLORS_THREE.lifeAdminTeal}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bioluminescent particles */}
      <BioluminescentParticles
        count={60}
        position={[0, 1, 0]}
        spread={4}
      />

      {/* Mountain terrain representation */}
      <mesh position={[1.5, 0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.8, 1.5, 4]} />
        <meshStandardMaterial
          color={0x1a3a2e}
          emissive={NEXORA_COLORS_THREE.lifeAdminTeal}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[-1, 0.2, 0.5]} rotation={[0, -Math.PI / 6, 0]}>
        <coneGeometry args={[0.6, 1, 4]} />
        <meshStandardMaterial
          color={0x1a3a2e}
          emissive={NEXORA_COLORS_THREE.lifeAdminTeal}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Teal ambient light */}
      <pointLight
        color={NEXORA_COLORS_THREE.lifeAdminTeal}
        intensity={0.6}
        distance={8}
        position={[0, 2, 0]}
      />

      {/* Room label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.25}
        color={NEXORA_COLORS_THREE.lifeAdminTeal}
        anchorX="center"
      >
        THE ZEN GARDEN
      </Text>
    </group>
  );
}

// ============================================================
// AGENTS COMPONENT
// ============================================================

interface AgentsProps {
  agents: NexoraAgent[];
  onAgentClick?: (agent: NexoraAgent) => void;
  selectedAgentId?: string;
}

function Agents({ agents, onAgentClick, selectedAgentId }: AgentsProps) {
  return (
    <group>
      {agents.map((agent) => (
        <BaseAvatar
          key={agent.id}
          role={agent.role}
          state={agent.state}
          position={[
            agent.position.x * 0.02, // Scale from canvas coords to world
            0.5,
            agent.position.z * 0.02,
          ]}
          rotation={agent.position.rotation}
          glowIntensity={agent.glowIntensity}
          isSelected={agent.id === selectedAgentId}
          onClick={() => onAgentClick?.(agent)}
        />
      ))}
    </group>
  );
}

// ============================================================
// ENVIRONMENT
// ============================================================

function NeuralEnvironment() {
  return (
    <>
      {/* Dark ambient */}
      <ambientLight intensity={0.1} color={NEXORA_COLORS_THREE.deepSpace} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.3}
        color={0xffffff}
      />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Ambient particles */}
      <AmbientParticles
        count={150}
        bounds={{
          min: [0, 0.5, 0],
          max: [28, 4, 15],
        }}
        color={NEXORA_COLORS_THREE.neonCyan}
        size={0.015}
      />

      {/* Data streams between rooms */}
      <DataStreams />

      {/* Fog for depth */}
      <fog attach="fog" args={[NEXORA_COLORS_THREE.voidBlack, 10, 50]} />
    </>
  );
}

// ============================================================
// MAIN SCENE
// ============================================================

interface NeuralHQSceneProps {
  agents?: NexoraAgent[];
  onAgentClick?: (agent: NexoraAgent) => void;
  selectedAgentId?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}

function NeuralHQSceneContent({
  agents,
  onAgentClick,
  selectedAgentId,
}: NeuralHQSceneProps) {
  const defaultAgents = useMemo(() => {
    return DEFAULT_AGENTS.map((a, i) => ({
      ...a,
      id: `agent-${i}`,
    }));
  }, []);

  const activeAgents = agents || defaultAgents;

  return (
    <>
      <NeuralEnvironment />
      
      {/* Rooms */}
      <TheNexus />
      <TheCitadel />
      <TheSynapse />
      <OutreachMatrix />
      <ZenGarden />
      
      {/* Agents */}
      <Agents
        agents={activeAgents}
        onAgentClick={onAgentClick}
        selectedAgentId={selectedAgentId}
      />
    </>
  );
}

export function NeuralHQScene(props: NeuralHQSceneProps) {
  const { cameraPosition = [16, 12, 20], cameraTarget = [10, 0, 6] } = props;

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0A0F' }}>
      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={50}
        />
        <OrbitControls
          target={cameraTarget}
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
        <Suspense fallback={null}>
          <NeuralHQSceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default NeuralHQScene;
