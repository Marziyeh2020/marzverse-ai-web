/* eslint-disable */
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

// The main model has been removed per user request

// 2. HIGH PERFORMANCE INSTANCED PARTICLE CLOUD (8000 CUBES)
function InstancedParticleCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = isMobile ? 500 : 3500; // Lightweight but visible cloud on mobile
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      // Size distribution (same heavy weight to tiny)
      const randSize = Math.abs(Math.sin(i * 12.9898));
      let baseSize = 0.005; 
      if (randSize > 0.99) baseSize = 0.08; // Adjusted Extra Large to be slightly bigger relative to huge object
      else if (randSize > 0.97) baseSize = 0.05; 
      else if (randSize > 0.90) baseSize = 0.03; 
      else if (randSize > 0.75) baseSize = 0.018; 
      else if (randSize > 0.50) baseSize = 0.01; 
      
      let size = baseSize + Math.abs(Math.cos(i * 78.233)) * (baseSize * 0.5);
      if (isMobile) size *= 0.4; // 10x smaller than previous 4.0 multiplier for mobile

      // Bridge layout: distributed along X axis (-25 to 25)
      const startX = (Math.sin(i * 45.123)) * 25; 
      
      // Z spread: width of the bridge
      // Denser in the middle of the bridge, sparse on edges
      const zOffset = (Math.pow(Math.abs(Math.cos(i * 32.456)), 2) * 6) * (Math.sin(i * 88.3) > 0 ? 1 : -1); 
      
      // Y noise: vertical thickness of the bridge
      const yNoise = (Math.pow(Math.abs(Math.sin(i * 11.234)), 2) * 3) * (Math.cos(i * 55.678) > 0 ? 1 : -1);

      // Flow speed along the bridge
      const flowSpeed = (0.2 + Math.abs(Math.sin(i * 22.345)) * 1.5) * (Math.sin(i * 33.456) > 0 ? 1 : -1);
      
      const rotationSpeedX = (Math.cos(i * 44.567)) * 2;
      const rotationSpeedY = (Math.sin(i * 55.678)) * 2;
      const phase = Math.abs(Math.cos(i * 66.789)) * Math.PI * 2;

      temp.push({ currentX: startX, zOffset, yNoise, size, flowSpeed, rotationSpeedX, rotationSpeedY, phase });
    }
    return temp;
  }, [particleCount, isMobile]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const px = state.pointer.x;
    const py = state.pointer.y;
    const scrollY = window.scrollY || 0;
    const scrollFactor = scrollY * 0.002;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, px * 0.4, 1.2 * delta);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, py * 0.4 + scrollFactor * 2, 1.2 * delta);
    
    const cursorInfluence = px * 2; // Mouse X pushes the flow speed

    particles.forEach((p, i) => {
      // Flow along the X axis
      p.currentX += (p.flowSpeed + cursorInfluence * Math.sign(p.flowSpeed)) * delta;
      
      // Wrap around to create an endless bridge
      if (p.currentX > 25) p.currentX = -25;
      if (p.currentX < -25) p.currentX = 25;

      // Parabolic Arc Math (Bridge Shape)
      // peaks at y=2, curves down as it goes left/right
      const arcY = 2 - (p.currentX * p.currentX) / 40;
      
      const wave = Math.sin(time * 1.5 + p.phase) * 0.4;

      const x = p.currentX;
      const z = p.zOffset;
      const y = arcY + p.yNoise + wave;

      dummy.position.set(x, y, z);
      dummy.rotation.x = time * p.rotationSpeedX;
      dummy.rotation.y = time * p.rotationSpeedY;
      dummy.scale.set(p.size, p.size, p.size);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh key={particleCount} ref={meshRef} args={[undefined, undefined, particleCount]} frustumCulled={false}>
      {/* Changed to sphere geometry for round particles, low segment count for performance */}
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.1} // Lower metalness for pure glass look
        roughness={0.75} // Much more blurry/frosted interior
        transmission={1.0} // 100% transmission for maximum transparency
        ior={1.8} // Stronger index of refraction for intense glassy distortion
        thickness={3.0} // Thicker volume creates more blur and light bending
        clearcoat={1.0} // Highly reflective outer surface (very glassy)
        clearcoatRoughness={0.05} // Smooth outer reflection
        transparent={true}
        opacity={1.0} // Max opacity for mobile visibility
      />
    </instancedMesh>
  );
}

// 3. CINEMATIC CAMERA & LIGHT CHOREOGRAPHY
function CinematicRig() {
  const { camera } = useThree();
  const lightGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Adjusted target for monumental scale. 
    // Kept camera slightly further back (z: 11 instead of 10) in Canvas prop below,
    // and subtle parallax so we don't swing wildly past the giant object.
    const targetCamX = px * 1.2 + Math.sin(time * 0.08) * 0.4;
    const targetCamY = py * 1.2 + Math.cos(time * 0.12) * 0.4;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 1.2 * delta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 1.2 * delta);
    camera.lookAt(0, 0, 0);

    if (lightGroupRef.current) {
      // Light spreads wider to cover the massive object
      lightGroupRef.current.position.x = THREE.MathUtils.lerp(lightGroupRef.current.position.x, px * 15, 1.5 * delta);
      lightGroupRef.current.position.y = THREE.MathUtils.lerp(lightGroupRef.current.position.y, py * 15, 1.5 * delta);
    }
  });

  return (
    <group ref={lightGroupRef}>
      <directionalLight position={[15, 15, 8]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-15, -15, -8]} intensity={0.6} color="#e0e2e5" />
      <pointLight position={[5, -5, 3]} intensity={0.2} color="#e2d6ff" />
      <pointLight position={[-5, 5, 3]} intensity={0.15} color="#d6ebff" />
    </group>
  );
}

export default function Scene() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    // Limit DPR on mobile to max 1.25 to prevent GPU bottleneck
    setDpr(window.innerWidth < 768 ? [1, 1.25] : [1, 2]);
  }, []);

  return (
    <div className="w-full h-full">
      {/* Pulled camera slightly back (z:11.5) to give the monumental object majestic breathing room */}
      <Canvas camera={{ position: [0, 0, 11.5], fov: 32 }} dpr={dpr} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.4} />
        <CinematicRig />
        <InstancedParticleCloud />
        <Environment preset="studio" resolution={256} />
      </Canvas>
    </div>
  );
}

// Removed preloading of the glb since it's no longer used
