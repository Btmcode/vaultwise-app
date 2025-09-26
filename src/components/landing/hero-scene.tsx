'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const vertices = useMemo(() => {
    const icoGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    return icoGeometry.attributes.position.clone();
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
        meshRef.current.rotation.y = time / 5;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(time / 2) / 4, 0.1);
    }

    const { mouse } = state;
    const targetRotation = Math.sin(mouse.x * Math.PI) * 0.2;
    gsap.to(meshRef.current.rotation, {
      y: meshRef.current.rotation.y + targetRotation * 0.05,
      duration: 1,
      ease: 'power2.out',
    });
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color={'hsl(var(--primary))'} roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <SpotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
      />
       <SpotLight
        position={[-10, -10, -5]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="hsl(var(--accent))"
      />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <Crystal />
    </Canvas>
  );
}
