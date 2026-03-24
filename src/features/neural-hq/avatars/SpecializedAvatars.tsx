/**
 * NEXORA NEURAL HQ - Specialized Agent Avatars
 * Each agent type has a unique visual style
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Ring, Torus, Octahedron, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { AGENT_THEMES, GLOW_PRESETS, AgentRole } from '@/lib/nexora/themes';
import { AgentState } from '../types';

interface AvatarProps {
  state: AgentState;
  position: [number, number, number];
  rotation?: number;
  glowIntensity?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

// Project Manager - Hovering synthetic with data-halo
export function PMAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const dataNodesRef = useRef<THREE.Group>(null);

  const theme = AGENT_THEMES.pm;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.08;
    
    if (haloRef.current) {
      haloRef.current.rotation.y += delta * 0.5;
      haloRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    if (dataNodesRef.current) {
      dataNodesRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {/* Selection ring */}
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      {/* Ground glow */}
      <Sphere args={[0.5, 16, 16]} position={[0, -0.2, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} transparent opacity={0.3} />
      </Sphere>

      {/* Core - smooth icosahedron */}
      <Icosahedron args={[0.35, 1]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} metalness={0.8} roughness={0.2} />
      </Icosahedron>

      {/* Inner glow */}
      <Sphere args={[0.25, 16, 16]}>
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2} transparent opacity={0.5} />
      </Sphere>

      {/* Data halo ring system */}
      <group ref={haloRef}>
        <Ring args={[0.55, 0.58, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[0.65, 0.67, 48]} rotation={[Math.PI / 2.5, 0.3, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.6} transparent opacity={0.5} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* Orbiting data nodes */}
      <group ref={dataNodesRef}>
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Sphere key={i} args={[0.04, 8, 8]} position={[Math.cos(rad) * 0.6, 0.1, Math.sin(rad) * 0.6]}>
              <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2} />
            </Sphere>
          );
        })}
      </group>

      <pointLight color={theme.glowColor} intensity={intensity * 2} distance={3} decay={2} />
    </group>
  );
}

// Developer - Cyber-construct with code matrices
export function DeveloperAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const codeRingsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const theme = AGENT_THEMES.developer;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0025) * 0.06;
    
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
      coreRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    if (codeRingsRef.current) {
      codeRingsRef.current.children.forEach((ring, i) => {
        ring.rotation.y += delta * (0.3 + i * 0.2);
        ring.rotation.x += delta * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      <Sphere args={[0.5, 16, 16]} position={[0, -0.2, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} transparent opacity={0.3} />
      </Sphere>

      {/* Core - geometric octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Inner energy */}
      <Sphere args={[0.2, 12, 12]}>
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2.5} transparent opacity={0.6} />
      </Sphere>

      {/* Code rings - multiple orbiting rings */}
      <group ref={codeRingsRef}>
        <Torus args={[0.5, 0.015, 8, 32]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
        </Torus>
        <Torus args={[0.55, 0.01, 8, 32]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.7} />
        </Torus>
        <Torus args={[0.45, 0.012, 8, 32]} rotation={[Math.PI / 4, Math.PI / 6, Math.PI / 3]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
        </Torus>
      </group>

      {/* Floating code particles */}
      {state === 'working' && [...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.6 + Math.sin(i * 2) * 0.1;
        return (
          <Box key={i} args={[0.03, 0.03, 0.03]} position={[Math.cos(angle) * radius, Math.sin(Date.now() * 0.003 + i) * 0.2, Math.sin(angle) * radius]}>
            <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2} />
          </Box>
        );
      })}

      <pointLight color={theme.glowColor} intensity={intensity * 2} distance={3} decay={2} />
    </group>
  );
}

// Security - Armored sentinel with glowing eyes
export function SecurityAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Group>(null);

  const theme = AGENT_THEMES.security;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0015) * 0.05;
    
    if (shieldRef.current) {
      shieldRef.current.rotation.y += delta * 0.2;
    }
  });

  const eyeIntensity = state === 'alert' ? intensity * 4 : intensity * 1.5;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      <Sphere args={[0.5, 16, 16]} position={[0, -0.2, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} transparent opacity={0.3} />
      </Sphere>

      {/* Armored core - angular */}
      <Box args={[0.45, 0.55, 0.45]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color={0x2a0a0a} emissive={color} emissiveIntensity={intensity * 0.3} metalness={0.95} roughness={0.1} />
      </Box>

      {/* Eyes */}
      <Sphere args={[0.05, 8, 8]} position={[-0.12, 0.1, 0.2]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={eyeIntensity} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[0.12, 0.1, 0.2]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={eyeIntensity} />
      </Sphere>

      {/* Shield grid */}
      <group ref={shieldRef}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Box key={i} args={[0.02, 0.4, 0.02]} position={[Math.cos(rad) * 0.5, 0, Math.sin(rad) * 0.5]}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} />
            </Box>
          );
        })}
      </group>

      {/* Alert pulse */}
      {state === 'alert' && (
        <Ring args={[0.6, 0.65, 32]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 2} transparent opacity={0.6 + Math.sin(Date.now() * 0.01) * 0.3} />
        </Ring>
      )}

      <pointLight color={theme.glowColor} intensity={intensity * 2.5} distance={4} decay={2} />
    </group>
  );
}

// Sales - Liquid metal fluid form
export function SalesAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const blobRef = useRef<THREE.Mesh>(null);

  const theme = AGENT_THEMES.sales;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1;
    
    if (blobRef.current) {
      // Subtle morphing effect
      const time = Date.now() * 0.001;
      blobRef.current.scale.x = 1 + Math.sin(time * 2) * 0.05;
      blobRef.current.scale.z = 1 + Math.cos(time * 2.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      <Sphere args={[0.5, 16, 16]} position={[0, -0.2, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} transparent opacity={0.3} />
      </Sphere>

      {/* Liquid metal blob */}
      <Sphere ref={blobRef} args={[0.4, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} metalness={1} roughness={0} envMapIntensity={1.5} />
      </Sphere>

      {/* Surface ripples */}
      <Torus args={[0.35, 0.02, 8, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} transparent opacity={0.5} />
      </Torus>

      {/* Floating gold particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.001;
        return (
          <Sphere key={i} args={[0.025, 8, 8]} position={[Math.cos(angle) * 0.55, Math.sin(i + Date.now() * 0.002) * 0.15, Math.sin(angle) * 0.55]}>
            <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2} />
          </Sphere>
        );
      })}

      <pointLight color={theme.glowColor} intensity={intensity * 2} distance={3} decay={2} />
    </group>
  );
}

// HR/Ops - Central pillar energy router
export function HROpsAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const energyRef = useRef<THREE.Group>(null);

  const theme = AGENT_THEMES.hr_ops;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0018) * 0.04;
    
    if (energyRef.current) {
      energyRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      <Sphere args={[0.5, 16, 16]} position={[0, -0.2, 0]} scale={[1.5, 0.1, 1.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} transparent opacity={0.3} />
      </Sphere>

      {/* Central pillar */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.2, 0.7, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Energy core */}
      <Sphere args={[0.12, 16, 16]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={intensity * 2.5} transparent opacity={0.8} />
      </Sphere>

      {/* Energy routing rings */}
      <group ref={energyRef}>
        <Ring args={[0.3, 0.33, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[0.25, 0.27, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[0.35, 0.37, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.6} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* Energy tendrils (when working) */}
      {state === 'working' && [...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 0.1, 0]} rotation={[0, angle, Math.PI / 4]}>
            <cylinderGeometry args={[0.01, 0.005, 0.8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.5} transparent opacity={0.6} />
          </mesh>
        );
      })}

      <pointLight color={theme.glowColor} intensity={intensity * 2} distance={3} decay={2} />
    </group>
  );
}

// Life Admin - Bioluminescent nature form
export function LifeAdminAvatar({ state, position, rotation = 0, glowIntensity = 0.3, isSelected, onClick }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  const theme = AGENT_THEMES.life_admin;
  const glowPreset = GLOW_PRESETS[state === 'alert' ? 'alert' : state === 'working' ? 'working' : 'idle'];
  const color = useMemo(() => new THREE.Color(theme.color), [theme.color]);
  const intensity = glowIntensity * glowPreset.emissiveIntensity;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0012) * 0.08;
    
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, i) => {
        leaf.rotation.z = Math.sin(Date.now() * 0.001 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {isSelected && (
        <Ring args={[0.9, 0.95, 32]} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </Ring>
      )}

      {/* Ground glow - softer, more organic */}
      <Sphere args={[0.6, 16, 16]} position={[0, -0.25, 0]} scale={[1.3, 0.08, 1.3]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.4} transparent opacity={0.4} />
      </Sphere>

      {/* Organic core */}
      <Icosahedron args={[0.3, 2]}>
        <meshStandardMaterial color={0x0a2520} emissive={color} emissiveIntensity={intensity * 0.8} metalness={0.3} roughness={0.7} />
      </Icosahedron>

      {/* Bioluminescent heart */}
      <Sphere args={[0.15, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 2} transparent opacity={0.7} />
      </Sphere>

      {/* Floating leaves/petals */}
      <group ref={leavesRef}>
        {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const height = Math.sin(i * 1.5) * 0.1;
          return (
            <group key={i} position={[Math.cos(angle) * 0.4, height + 0.15, Math.sin(angle) * 0.4]} rotation={[0, angle, 0]}>
              <Sphere args={[0.08, 8, 8]} scale={[1, 0.3, 1]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} transparent opacity={0.7} />
              </Sphere>
            </group>
          );
        })}
      </group>

      {/* Gentle particle glow */}
      {[...Array(4)].map((_, i) => (
        <Sphere key={i} args={[0.02, 8, 8]} position={[Math.sin(Date.now() * 0.001 + i * 2) * 0.5, Math.cos(Date.now() * 0.0015 + i) * 0.3 + 0.2, Math.cos(Date.now() * 0.001 + i * 2) * 0.5]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 2} />
        </Sphere>
      ))}

      <pointLight color={theme.glowColor} intensity={intensity * 1.5} distance={3} decay={2} />
    </group>
  );
}

// Avatar factory
export function NexoraAvatar({ role, ...props }: AvatarProps & { role: AgentRole }) {
  switch (role) {
    case 'pm': return <PMAvatar {...props} />;
    case 'developer': return <DeveloperAvatar {...props} />;
    case 'security': return <SecurityAvatar {...props} />;
    case 'sales': return <SalesAvatar {...props} />;
    case 'hr_ops': return <HROpsAvatar {...props} />;
    case 'life_admin': return <LifeAdminAvatar {...props} />;
    default: return <PMAvatar {...props} />;
  }
}

export default NexoraAvatar;
