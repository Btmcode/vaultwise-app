'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, SpotLight, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // Slowly rotate the crystal
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x += delta * 0.05;

    // Use GSAP for a smooth hover effect (optional, can be expanded)
    const { pointer } = state;
    gsap.to(meshRef.current.scale, {
      x: 1 + pointer.x * 0.1,
      y: 1 - pointer.y * 0.1,
      duration: 0.5,
    });
  });

  return (
    <Icosahedron ref={meshRef} args={[2, 1]} castShadow>
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.9}
        roughness={0.1}
        transmission={0.9}
        thickness={1.5}
        ior={2.33}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </Icosahedron>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.5} />
      
      {/* Main spotlight shining on the crystal */}
      <SpotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#90CAF9" // Soft Lavender
      />

      {/* A secondary fill light */}
      <SpotLight
        position={[-10, -5, -10]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#304FFE" // Sapphire Blue
      />

      <Crystal />
    </Canvas>
  );
}
