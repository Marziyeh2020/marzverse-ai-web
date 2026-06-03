'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useScroll } from 'framer-motion';

// =====================================
// PARTICLE GLOBE SHADERS
// =====================================
const vertexShader = `
  uniform float uTime;
  uniform vec3 uHitPoint;
  uniform float uForceMultiplier;
  
  uniform vec3 uPrimaryColor;
  uniform vec3 uHighlightColor;
  uniform vec3 uCenterColor;

  attribute float aRandom;

  varying vec3 vColor;
  varying float vOpacity;
  varying float vDepth;

  void main() {
    // Autonomous, singular intelligence breathing
    float breathScale = 1.0 + (pow(sin(uTime * 1.2), 4.0) * 0.04);
    
    vec3 basePos = position * breathScale;
    vec4 worldPos = modelMatrix * vec4(basePos, 1.0);
    
    float dist = distance(worldPos.xyz, uHitPoint);
    vec3 dirToMouseWorld = normalize(uHitPoint - worldPos.xyz); 
    
    // ==========================================
    // INVISIBLE INTELLIGENCE (SUBTLE PRESENCE)
    // ==========================================
    float force = 0.0;
    
    // Reduced attraction force by 70% for extreme visual stability
    // 1. Outer Zone
    float farPull = smoothstep(46.0, 17.25, dist) * 0.18;
    
    // 2. Middle Zone
    float midPull = smoothstep(17.25, 5.75, dist) * 0.48;
    
    // 3. Inner Zone
    float innerPull = smoothstep(5.75, 1.8, dist) * 1.08;
    
    force += farPull + midPull + innerPull;
    
    // 4. Core Zone: Reduced repulsion to match the gentle pull
    if (dist < 2.0) {
      float push = pow((2.0 - dist) / 2.0, 2.0) * 1.78; 
      force -= push;
    }
    
    // ==========================================
    // QUANTUM SWIRL (VISIBLE ENERGY STREAMS)
    // ==========================================
    vec3 swirlDir = normalize(cross(dirToMouseWorld, normalize(worldPos.xyz))); 
    // Reduced swirl force by 90%
    float swirlForce = smoothstep(17.25, 1.0, dist) * 0.3; 
    
    float ripple = 0.0;
    if (dist < 17.25) {
      // Reduced ripple force by 90%
      ripple = sin(dist * 6.0 - uTime * 4.0) * 0.0037 * smoothstep(17.25, 0.0, dist); 
    }
    
    // Combine Pull/Push, Swirl Rotation, and Ripple
    vec3 displacement = (dirToMouseWorld * force) + (swirlDir * swirlForce) + (normalize(worldPos.xyz) * ripple);
    vec3 finalWorldPos = worldPos.xyz + (displacement * uForceMultiplier);

    vec3 viewDir = normalize(cameraPosition - finalWorldPos);
    vec3 normal = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    float ndotv = max(0.0, dot(viewDir, normal));
    
    // Interpolate from center color to primary color for 3D depth
    vec3 baseCol = mix(uPrimaryColor, uCenterColor, ndotv);
    
    // Interaction Highlights (Increased visibility by 25%)
    float highlightIntensity = clamp(abs(force) * 0.25 + swirlForce * 0.5 + abs(ripple) * 8.0, 0.0, 1.0);
    baseCol = mix(baseCol, uHighlightColor, highlightIntensity);
    
    // Fresnel / Edge Lighting
    float fresnel = pow(1.0 - ndotv, 1.3);
    
    // Intense Edge Contrast
    vec3 finalCol = mix(baseCol, uHighlightColor, fresnel * 0.8); 
    finalCol += uHighlightColor * fresnel * 2.5; 
    
    // Output pure vibrant color without desaturating white mix
    vColor = finalCol; 
    
    // Massive Opacity Boost
    vOpacity = clamp(smoothstep(-3.0, 3.0, finalWorldPos.z) * 1.5 + 0.5, 0.5, 1.0);
    vDepth = finalWorldPos.z;
    
    vec4 mvPosition = viewMatrix * vec4(finalWorldPos, 1.0);
    
    // Large, highly visible particles
    gl_PointSize = (22.0 / -mvPosition.z) * (1.0 + aRandom * 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  varying float vDepth;

  void main() {
    // 1. Crisp Circular Particle Definition
    float distToCenter = distance(gl_PointCoord, vec2(0.5));
    
    // Reduced halo size by 30% (discard outer blurry edges)
    if (distToCenter > 0.35) discard;
    
    // Crisp solid core
    float core = smoothstep(0.12, 0.0, distToCenter);
    
    // Tighter, heavily reduced halo for less light bleed
    float halo = smoothstep(0.35, 0.12, distToCenter);
    
    // 2. Alpha & Depth Fading
    float alpha = mix(0.1, 1.0, clamp(vDepth + 0.3, 0.0, 1.0));
    
    // Focus opacity on the crisp core, giving the particle a defined silhouette
    float finalAlpha = alpha * (core * 0.8 + halo * 0.2);
    
    // 3. Final Output
    gl_FragColor = vec4(vColor, finalAlpha * vOpacity);
  }
`;

// =====================================
// COMPONENTS
// =====================================

function ParticleGlobe({ 
  radius, 
  particleCount, 
  groupPosition, 
  primaryColor, 
  highlightColor, 
  centerColor,
  hitPointRef, 
  isHoveringRef
}: { 
  radius: number, 
  particleCount: number, 
  groupPosition: [number, number, number],
  primaryColor: THREE.Vector3,
  highlightColor: THREE.Vector3,
  centerColor: THREE.Vector3,
  hitPointRef: React.MutableRefObject<THREE.Vector3>, 
  isHoveringRef: React.MutableRefObject<boolean>
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, randoms } = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const r = new Float32Array(particleCount);
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      p[i * 3] = Math.cos(theta) * radiusAtY * radius;
      p[i * 3 + 1] = y * radius;
      p[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;
      r[i] = Math.random();
    }
    return { positions: p, randoms: r };
  }, [radius, particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Add massive physical weight to the magnetic tracking
      // Instead of teleporting to the cursor, the field heavily drags behind it
      const currentHitPoint = shaderRef.current.uniforms.uHitPoint.value;
      const targetHit = hitPointRef.current;
      
      // Extremely low damping value (3.0) for absolute stability and mass
      currentHitPoint.x = THREE.MathUtils.damp(currentHitPoint.x, targetHit.x, 3.0, delta);
      currentHitPoint.y = THREE.MathUtils.damp(currentHitPoint.y, targetHit.y, 3.0, delta);
      currentHitPoint.z = THREE.MathUtils.damp(currentHitPoint.z, targetHit.z, 3.0, delta);

      // Slower, heavier return smoothness (reduced acceleration)
      const targetForce = isHoveringRef.current ? 1.0 : 0.0;
      shaderRef.current.uniforms.uForceMultiplier.value = THREE.MathUtils.damp(
        shaderRef.current.uniforms.uForceMultiplier.value, 
        targetForce, 
        3.0, 
        delta
      ); 
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHitPoint: { value: new THREE.Vector3(0, 0, 50) },
    uForceMultiplier: { value: 0.0 },
    uPrimaryColor: { value: primaryColor },
    uHighlightColor: { value: highlightColor },
    uCenterColor: { value: centerColor }
  }), [primaryColor, highlightColor, centerColor]);

  return (
    <group position={groupPosition}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SceneController() {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    // CAMERA IS NOW 100% FIXED IN Z SPACE - SCROLL BEHAVIOR REMOVED
    camera.position.z = 5.0;
    
    // Very subtle mouse parallax to keep it feeling alive, but strictly anchored
    const targetX = pointer.x * 0.05;
    const targetY = pointer.y * 0.05;
    
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 10.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 10.0, delta);
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GlobalRaycaster({ onPointerUpdate }: { onPointerUpdate: (point: THREE.Vector3) => void }) {
  const { camera, pointer, raycaster } = useThree();
  const lastRegisteredPoint = useRef(new THREE.Vector3(0, 0, 50));
  
  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    
    raycaster.ray.intersectPlane(plane, target);
    if (target) {
      // DEAD-ZONE FILTERING
      // Ignore micro-vibrations and floating point noise.
      // Only register deliberate mouse movements larger than 0.2 units.
      if (target.distanceTo(lastRegisteredPoint.current) > 0.2) {
        lastRegisteredPoint.current.copy(target);
        onPointerUpdate(target);
      }
    }
  });

  return null;
}

function InteractiveScene() {
  // Use Refs instead of React State to completely eliminate re-render jitter
  const hitPointRef = useRef(new THREE.Vector3(0, 0, 50));
  const isHoveringRef = useRef(false);

  // Configuration for Single Iconic Sphere
  const GLOBE_POS_1 = new THREE.Vector3(2.8, 0, 0); 
  const GLOBE_POS_2 = new THREE.Vector3(-2.8, 0, 0); // Second identical sphere placed on the left
  const GLOBE_RADIUS = 1.65; 
  const PARTICLE_COUNT = 6000;

  return (
    <>
      <SceneController />
      <GlobalRaycaster onPointerUpdate={(point) => {
        hitPointRef.current.copy(point);
        isHoveringRef.current = true;
      }} />
      
      {/* First Sphere (Original) */}
      <ParticleGlobe 
        radius={GLOBE_RADIUS}
        particleCount={PARTICLE_COUNT}
        groupPosition={[GLOBE_POS_1.x, GLOBE_POS_1.y, GLOBE_POS_1.z]}
        primaryColor={new THREE.Vector3(0.85, 0.85, 0.85)} // Silver #D9D9D9
        highlightColor={new THREE.Vector3(1.0, 1.0, 1.0)} // Pure White #FFFFFF
        centerColor={new THREE.Vector3(0.1, 0.1, 0.1)} // Deep Graphite for core
        hitPointRef={hitPointRef} 
        isHoveringRef={isHoveringRef} 
      />

      {/* Second Sphere (Identical Copy) */}
      <ParticleGlobe 
        radius={GLOBE_RADIUS}
        particleCount={PARTICLE_COUNT}
        groupPosition={[GLOBE_POS_2.x, GLOBE_POS_2.y, GLOBE_POS_2.z]}
        primaryColor={new THREE.Vector3(0.85, 0.85, 0.85)} // Silver #D9D9D9
        highlightColor={new THREE.Vector3(1.0, 1.0, 1.0)} // Pure White #FFFFFF
        centerColor={new THREE.Vector3(0.1, 0.1, 0.1)} // Deep Graphite for core
        hitPointRef={hitPointRef} 
        isHoveringRef={isHoveringRef} 
      />

      <EffectComposer>
        <Bloom 
          intensity={1.0} 
          luminanceThreshold={0.5} 
          luminanceSmoothing={0.5} 
          blendFunction={BlendFunction.SCREEN} 
        />
      </EffectComposer>
    </>
  );
}

export default function CinematicEarth() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <InteractiveScene />
      </Canvas>
    </div>
  );
}
