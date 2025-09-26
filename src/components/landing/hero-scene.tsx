
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x304FFE, // Primary color
      metalness: 0.6,
      roughness: 0.2,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x90CAF9, 1, 100); // Accent color
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.7, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
        gsap.to(mouse, {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
            duration: 1.5,
            ease: 'power3.out'
        });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Slower base rotation
      crystal.rotation.x += 0.001;
      crystal.rotation.y += 0.001;
      
      // Light follows mouse
      gsap.to(pointLight.position, {
        x: mouse.x * 5,
        y: mouse.y * 5,
        z: 5,
        duration: 2,
        ease: 'power3.out'
      });

      renderer.render(scene, camera);
    };
    animate();

    // GSAP intro animation
    gsap.fromTo(crystal.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'elastic.out(1, 0.5)' });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
