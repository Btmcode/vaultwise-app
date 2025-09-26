'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Sahne
    const scene = new THREE.Scene();

    // Kamera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Render'cı
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Işıklar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0xffffff, 2);
    spotLight1.position.set(10, 10, 10);
    spotLight1.angle = 0.3;
    spotLight1.penumbra = 1;
    scene.add(spotLight1);
    
    const spotLight2 = new THREE.SpotLight(0x90CAF9, 1.5); // accent color
    spotLight2.position.set(-10, -10, -5);
    spotLight2.angle = 0.5;
    spotLight2.penumbra = 1;
    scene.add(spotLight2);

    // Kristal Objesi
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('hsl(217, 33%, 17%)'), // primary color
        roughness: 0.1,
        metalness: 0.9,
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Fare takibi
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
        const bounds = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - bounds.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - bounds.top) / currentMount.clientHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Yeniden boyutlandırma
    const handleResize = () => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animasyon Döngüsü
    const animate = () => {
        requestAnimationFrame(animate);

        // Otomatik Dönüş
        crystal.rotation.y += 0.001;

        // Fare ile etkileşim
        const targetRotationY = crystal.rotation.y + (mouse.x * 0.5);
        gsap.to(crystal.rotation, {
            y: targetRotationY,
            x: -mouse.y * 0.2,
            duration: 2,
            ease: 'power2.out',
        });
        
        renderer.render(scene, camera);
    };
    animate();

    // Temizlik
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
            currentMount.removeChild(renderer.domElement);
        }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
