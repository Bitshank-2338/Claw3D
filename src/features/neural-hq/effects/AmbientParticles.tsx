/**
 * NEXORA NEURAL HQ - Ambient Particles
 * Floating particles for room atmosphere
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEXORA_COLORS_THREE } from '@/lib/nexora/themes';

interface AmbientParticlesProps {
  count?: number;
  bounds?: { min: [number, number, number]; max: [number, number, number] };
  color?: number;
  size?: number;
  speed?: number;
}

export function AmbientParticles({
  count = 100,
  bounds = { min: [0, 0, 0], max: [20, 5, 15] },
  color = NEXORA_COLORS_THREE.neonCyan,
  size = 0.02,
  speed = 0.3,
}: AmbientParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random position within bounds
      positions[i3] = bounds.min[0] + Math.random() * (bounds.max[0] - bounds.min[0]);
      positions[i3 + 1] = bounds.min[1] + Math.random() * (bounds.max[1] - bounds.min[1]);
      positions[i3 + 2] = bounds.min[2] + Math.random() * (bounds.max[2] - bounds.min[2]);
      
      // Random velocity
      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * speed * 0.5;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;
      
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, phases };
  }, [count, bounds, speed]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    const positionAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const time = Date.now() * 0.001;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update position with velocity and wave motion
      let x = positionAttr.getX(i) + velocities[i3] * delta;
      let y = positionAttr.getY(i) + Math.sin(time + phases[i]) * 0.001;
      let z = positionAttr.getZ(i) + velocities[i3 + 2] * delta;

      // Wrap around bounds
      if (x < bounds.min[0]) x = bounds.max[0];
      if (x > bounds.max[0]) x = bounds.min[0];
      if (z < bounds.min[2]) z = bounds.max[2];
      if (z > bounds.max[2]) z = bounds.min[2];

      positionAttr.setXYZ(i, x, y, z);
    }

    positionAttr.needsUpdate = true;
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={threeColor}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface BioluminescentParticlesProps {
  count?: number;
  position?: [number, number, number];
  spread?: number;
}

export function BioluminescentParticles({
  count = 50,
  position = [0, 0, 0],
  spread = 3,
}: BioluminescentParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const tealColor = new THREE.Color(NEXORA_COLORS_THREE.lifeAdminTeal);
    const greenColor = new THREE.Color(0x10b981);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] = position[0] + (Math.random() - 0.5) * spread;
      positions[i3 + 1] = position[1] + Math.random() * spread * 0.5;
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * spread;
      
      phases[i] = Math.random() * Math.PI * 2;
      
      // Blend between teal and green
      const blend = Math.random();
      const blendedColor = tealColor.clone().lerp(greenColor, blend);
      colors[i3] = blendedColor.r;
      colors[i3 + 1] = blendedColor.g;
      colors[i3 + 2] = blendedColor.b;
    }

    return { positions, phases, colors };
  }, [count, position, spread]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positionAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const time = Date.now() * 0.001;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gentle floating motion
      const y = positions[i3 + 1] + Math.sin(time * 0.5 + phases[i]) * 0.1;
      const x = positions[i3] + Math.sin(time * 0.3 + phases[i] * 2) * 0.02;
      
      positionAttr.setXYZ(i, x, y, positionAttr.getZ(i));
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default AmbientParticles;
