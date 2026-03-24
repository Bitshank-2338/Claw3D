/**
 * NEXORA NEURAL HQ - Holographic UI Elements
 * Floating holographic displays and interfaces
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NEXORA_COLORS_THREE, NEXORA_COLORS } from '@/lib/nexora/themes';

interface HoloPanelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  color?: number;
  title?: string;
  content?: string;
  glowIntensity?: number;
}

export function HoloPanel({
  position,
  rotation = [0, 0, 0],
  width = 1.5,
  height = 1,
  color = NEXORA_COLORS_THREE.neonCyan,
  title,
  content,
  glowIntensity = 0.5,
}: HoloPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scanlineRef = useRef(0);

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Subtle floating animation
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.02;
    
    // Scanline effect
    scanlineRef.current = (scanlineRef.current + delta * 0.5) % 1;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main panel */}
      <RoundedBox args={[width, height, 0.02]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          metalness={0.9}
          roughness={0.1}
          emissive={threeColor}
          emissiveIntensity={glowIntensity * 0.3}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Border frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, 0.02)]} />
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>

      {/* Title */}
      {title && (
        <Text
          position={[0, height / 2 - 0.15, 0.02]}
          fontSize={0.1}
          color={NEXORA_COLORS.textPrimary}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {title}
        </Text>
      )}

      {/* Content */}
      {content && (
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.06}
          color={NEXORA_COLORS.textSecondary}
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.2}
        >
          {content}
        </Text>
      )}

      {/* Corner decorations */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y], i) => (
        <mesh
          key={i}
          position={[(x * width) / 2 - x * 0.05, (y * height) / 2 - y * 0.05, 0.015]}
        >
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial
            color={color}
            emissive={threeColor}
            emissiveIntensity={glowIntensity}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Glow light */}
      <pointLight
        color={color}
        intensity={glowIntensity}
        distance={2}
        decay={2}
        position={[0, 0, 0.2]}
      />
    </group>
  );
}

interface HoloGlobeProps {
  position: [number, number, number];
  radius?: number;
  color?: number;
  threatPoints?: Array<{ lat: number; lng: number; severity: 'low' | 'medium' | 'high' }>;
}

export function HoloGlobe({
  position,
  radius = 1.5,
  color = NEXORA_COLORS_THREE.securityRed,
  threatPoints = [],
}: HoloGlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y += delta * 0.1;
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group ref={globeRef} position={position}>
      {/* Wireframe globe */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3}
          emissive={threeColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[radius * 0.95, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.05}
          emissive={threeColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Latitude lines */}
      {[-0.5, 0, 0.5].map((lat, i) => (
        <mesh key={i} position={[0, lat * radius, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.cos(Math.asin(lat)) * radius - 0.02, Math.cos(Math.asin(lat)) * radius, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Threat points */}
      {threatPoints.map((point, i) => {
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lng + 180) * (Math.PI / 180);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        const severityColor = point.severity === 'high' ? 0xff0000 : point.severity === 'medium' ? 0xffaa00 : 0xffff00;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={severityColor}
              emissive={severityColor}
              emissiveIntensity={2}
            />
          </mesh>
        );
      })}

      {/* Central light */}
      <pointLight color={color} intensity={0.5} distance={radius * 3} decay={2} />
    </group>
  );
}

interface HoloTableProps {
  position: [number, number, number];
  radius?: number;
  color?: number;
}

export function HoloTable({
  position,
  radius = 2,
  color = NEXORA_COLORS_THREE.hrOpsPurple,
}: HoloTableProps) {
  const tableRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!tableRef.current) return;
    // Subtle pulse
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group ref={tableRef} position={position}>
      {/* Table surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.3, radius, 6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={threeColor}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={threeColor}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.3, radius * 0.35, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={threeColor}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central hologram projector */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={threeColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Table light */}
      <pointLight
        color={color}
        intensity={1}
        distance={radius * 2}
        decay={2}
        position={[0, 0.5, 0]}
      />
    </group>
  );
}

export default { HoloPanel, HoloGlobe, HoloTable };
