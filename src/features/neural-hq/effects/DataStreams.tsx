/**
 * NEXORA NEURAL HQ - Data Streams Effect
 * Flowing data particles that move through the office
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEXORA_COLORS_THREE } from '@/lib/nexora/themes';

interface DataStreamProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: number;
  particleCount?: number;
  speed?: number;
  active?: boolean;
}

export function DataStream({
  start,
  end,
  color = NEXORA_COLORS_THREE.neonCyan,
  particleCount = 20,
  speed = 1,
  active = true,
}: DataStreamProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      phases[i] = Math.random();
    }
    
    return { positions, phases };
  }, [particleCount]);

  const direction = useMemo(() => {
    return new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    );
  }, [start, end]);

  useFrame((_, delta) => {
    if (!particlesRef.current || !active) return;
    
    timeRef.current += delta * speed;
    const geometry = particlesRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < particleCount; i++) {
      const phase = (phases[i] + timeRef.current * 0.3) % 1;
      
      positionAttr.setXYZ(
        i,
        start[0] + direction.x * phase + (Math.random() - 0.5) * 0.1,
        start[1] + direction.y * phase + Math.sin(phase * Math.PI * 4) * 0.2,
        start[2] + direction.z * phase + (Math.random() - 0.5) * 0.1
      );
    }
    
    positionAttr.needsUpdate = true;
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={threeColor}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface DataStreamsProps {
  streams?: Array<{
    start: [number, number, number];
    end: [number, number, number];
    color?: number;
  }>;
}

export function DataStreams({ streams }: DataStreamsProps) {
  const defaultStreams = useMemo(() => [
    // Nexus to Citadel
    {
      start: [8, 1, 5] as [number, number, number],
      end: [20, 1, 4] as [number, number, number],
      color: NEXORA_COLORS_THREE.developerCyan,
    },
    // Nexus to Synapse
    {
      start: [6, 1, 4] as [number, number, number],
      end: [2, 1, 2] as [number, number, number],
      color: NEXORA_COLORS_THREE.hrOpsPurple,
    },
    // Citadel to Nexus (threat data)
    {
      start: [20, 1.5, 5] as [number, number, number],
      end: [8, 1.5, 6] as [number, number, number],
      color: NEXORA_COLORS_THREE.securityRed,
    },
    // Outreach Matrix to Nexus
    {
      start: [3, 1, 10] as [number, number, number],
      end: [7, 1, 6] as [number, number, number],
      color: NEXORA_COLORS_THREE.salesGold,
    },
  ], []);

  const activeStreams = streams || defaultStreams;

  return (
    <group>
      {activeStreams.map((stream, index) => (
        <DataStream
          key={index}
          start={stream.start}
          end={stream.end}
          color={stream.color}
          particleCount={15}
          speed={0.8 + Math.random() * 0.4}
        />
      ))}
    </group>
  );
}

export default DataStreams;
