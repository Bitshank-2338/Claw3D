/**
 * NEXORA NEURAL HQ - Base Avatar Component
 * Futuristic AI construct avatar with glow effects and particles
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { AgentRole, AGENT_THEMES, GLOW_PRESETS } from '@/lib/nexora/themes';
import { AgentState } from '../types';

interface BaseAvatarProps {
  role: AgentRole;
  state: AgentState;
  position: [number, number, number];
  rotation?: number;
  glowIntensity?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function BaseAvatar({
  role,
  state,
  position,
  rotation = 0,
  glowIntensity = 0.3,
  isSelected = false,
  onClick,
}: BaseAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  const theme = AGENT_THEMES[role];
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const emissiveColor = useMemo(() => new THREE.Color(theme.glowColor), [theme.glowColor]);

  // Animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Hovering animation
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1;

    // Core pulse
    if (coreRef.current) {
      const scale = 1 + Math.sin(Date.now() * glowPreset.pulseSpeed * 0.003) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }

    // Halo rotation
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.5;
      haloRef.current.rotation.y += delta * 0.2;
    }

    // Outer ring rotation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.3;
    }
  });

  const finalIntensity = glowIntensity * glowPreset.emissiveIntensity;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      onClick={onClick}
    >
      {/* Selection indicator */}
      {isSelected && (
        <Ring
          args={[0.8, 0.85, 32]}
          position={[0, -0.4, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      {/* Ground glow */}
      <Sphere args={[0.6, 16, 16]} position={[0, -0.3, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={finalIntensity * 0.5}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Core body - geometric construct */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={finalIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow sphere */}
      <Sphere args={[0.25, 16, 16]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive={emissiveColor}
          emissiveIntensity={finalIntensity * 2}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Data halo ring */}
      <group ref={haloRef}>
        <Ring args={[0.5, 0.55, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={finalIntensity}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </Ring>
        
        {/* Orbital particles */}
        {[...Array(4)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.03, 8, 8]}
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 0.52,
              0,
              Math.sin((i / 4) * Math.PI * 2) * 0.52,
            ]}
          >
            <meshStandardMaterial
              color="#ffffff"
              emissive={emissiveColor}
              emissiveIntensity={finalIntensity * 3}
            />
          </Sphere>
        ))}
      </group>

      {/* Outer decorative ring */}
      <group ref={outerRingRef} position={[0, 0.3, 0]}>
        <Ring args={[0.4, 0.42, 6]} rotation={[0, 0, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={finalIntensity * 0.5}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </Ring>
      </group>

      {/* Alert indicator */}
      {state === 'alert' && (
        <Sphere args={[0.1, 8, 8]} position={[0, 0.7, 0]}>
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={2}
          />
        </Sphere>
      )}

      {/* Point light for glow effect */}
      <pointLight
        color={theme.glowColor}
        intensity={finalIntensity * 2}
        distance={3}
        decay={2}
      />
    </group>
  );
}

export default BaseAvatar;
