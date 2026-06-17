/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useEffect } from 'react';

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
  uniform float uMobileMultiplier;

  attribute float aRandom;

  varying vec3 vColor;
  varying float vOpacity;
  varying float vDepth;

  void main() {
    // Autonomous, singular intelligence breathing
    // BUGFIX: Mobile GPUs return NaN if pow() is given a negative base. Use abs() to ensure positive base.
    float breathScale = 1.0 + (pow(abs(sin(uTime * 1.2)), 4.0) * 0.04);
    
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
    
    // Massive mobile scale boost
    float calculatedSize = ((22.0 * uMobileMultiplier) / -mvPosition.z) * (1.0 + aRandom * 0.5);
    // Ensure minimum pixel size so it never disappears, and cap at 64.0 to prevent mobile GPU driver crashes
    gl_PointSize = clamp(calculatedSize, 4.0, 64.0);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  varying float vDepth;
  uniform float uMobileMultiplier;
  uniform float uIsMobile;

  void main() {
    // 1. Circular Particle Definition
    float distToCenter = distance(gl_PointCoord, vec2(0.5));
    
    // On mobile, allow a wider halo (maxDist 0.5) to create a soft glow texture without post-processing.
    float maxDist = mix(0.35, 0.5, uIsMobile);
    if (distToCenter > maxDist) discard;
    
    // Crisp solid core
    float core = smoothstep(0.12, 0.0, distToCenter);
    
    // Soft glow halo on mobile, tight halo on desktop
    float halo = smoothstep(maxDist, 0.12, distToCenter);
    
    // 2. Alpha & Depth Fading (boosted minAlpha on mobile for better contrast and perceived depth)
    float minAlpha = mix(0.1 * uMobileMultiplier, 0.35, uIsMobile);
    float alpha = mix(minAlpha, 1.0, clamp(vDepth + 0.3, 0.0, 1.0));
    
    // Boost glow opacity in the halo on mobile
    float coreWeight = mix(0.8, 0.7, uIsMobile);
    float haloWeight = mix(0.2, 0.55, uIsMobile);
    float finalAlpha = alpha * (core * coreWeight + halo * haloWeight);
    
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
  isHoveringRef,
  isMobile
}: { 
  radius: number, 
  particleCount: number, 
  groupPosition: [number, number, number],
  primaryColor: THREE.Vector3,
  highlightColor: THREE.Vector3,
  centerColor: THREE.Vector3,
  hitPointRef: React.MutableRefObject<THREE.Vector3>, 
  isHoveringRef: React.MutableRefObject<boolean>,
  isMobile: boolean
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
      r[i] = Math.abs(Math.sin(i * 12.9898));
    }
    console.log("[MARZVERSE] Particles initialized");
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
      // BUGFIX: Soften the force dramatically on mobile to prevent them from flying off the screen.
      // Reduced maxForce even further to 0.15 for very gentle movement
      const maxForce = isMobile ? 0.15 : 1.0;
      const targetForce = isHoveringRef.current ? maxForce : 0.0;
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
    uCenterColor: { value: centerColor },
    uMobileMultiplier: { value: isMobile ? 0.75 : 1.0 }, // Increased from 0.4 to 0.75 for 1.875x scale boost
    uIsMobile: { value: isMobile ? 1.0 : 0.0 }
  }), [primaryColor, highlightColor, centerColor]); // Removed isMobile from dependency array to avoid recreating uniforms object

  // Explicitly update mobile multiplier when it changes
  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uMobileMultiplier.value = isMobile ? 0.75 : 1.0;
      shaderRef.current.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0;
    }
  }, [isMobile]);

  return (
    <group position={groupPosition}>
      <points key={particleCount} ref={pointsRef} frustumCulled={false}>
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

function SceneController({ isDesktop }: { isDesktop: boolean }) {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    // CAMERA IS NOW 100% FIXED IN Z SPACE - SCROLL BEHAVIOR REMOVED
    camera.position.z = 5.0;
    
    // Very subtle mouse parallax to keep it feeling alive, but strictly anchored
    // Only active on desktop and when inside the Hero section (scrollY < 1.2 * window.innerHeight)
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const isHeroSection = scrollY < window.innerHeight * 1.2;

    const targetX = (isDesktop && isHeroSection) ? pointer.x * 0.05 : 0;
    const targetY = (isDesktop && isHeroSection) ? pointer.y * 0.05 : 0;
    
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 10.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 10.0, delta);
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GlobalRaycaster({ 
  onPointerUpdate, 
  isDesktop,
  isHoveringRef
}: { 
  onPointerUpdate: (point: THREE.Vector3) => void;
  isDesktop: boolean;
  isHoveringRef: React.MutableRefObject<boolean>;
}) {
  const { camera, pointer, raycaster } = useThree();
  const lastRegisteredPoint = useRef(new THREE.Vector3(0, 0, 50));
  
  useFrame(() => {
    if (!isDesktop) {
      isHoveringRef.current = false;
      return;
    }

    // Only track cursor movement when in the Hero section (scrollY < 1.2 * height)
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const isHeroSection = scrollY < window.innerHeight * 1.2;

    if (!isHeroSection) {
      isHoveringRef.current = false;
      return;
    }

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

  // Responsive particle count for performance
  const [particleCount, setParticleCount] = useState(6000);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    console.log("[MARZVERSE] Scene mounted");
    
    // 1. Mobile/Desktop Detection & Particle Reduction
    const updateSize = () => {
      const mobile = window.innerWidth < 1024;
      const desktop = window.innerWidth >= 1024;
      setIsMobile(mobile);
      setIsDesktop(desktop);
      setParticleCount(mobile ? 800 : 6000); // 800 particles for better mobile loop definition
      
      if (!desktop) {
        isHoveringRef.current = false;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // 2. Global Mouseleave listeners for Desktop to reset hover
    const handleMouseLeave = () => {
      isHoveringRef.current = false;
    };

    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerout', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerout', handleMouseLeave);
    };
  }, []);

    // Configuration for Single Iconic Sphere
    // On mobile, bring them closer together to fit the narrow portrait screen
    const GLOBE_POS_1 = new THREE.Vector3(isMobile ? 1.4 : 2.8, 0, 0); 
    const GLOBE_POS_2 = new THREE.Vector3(isMobile ? -1.4 : -2.8, 0, 0); // Second identical sphere placed on the left
    const GLOBE_RADIUS = isMobile ? 1.2 : 1.65; 

  return (
    <>
      <SceneController isDesktop={isDesktop} />
      <GlobalRaycaster 
        isDesktop={isDesktop} 
        isHoveringRef={isHoveringRef}
        onPointerUpdate={(point) => {
          hitPointRef.current.copy(point);
          isHoveringRef.current = true;
        }} 
      />
      
      {/* First Sphere (Original) */}
      <ParticleGlobe 
        radius={GLOBE_RADIUS}
        particleCount={particleCount}
        groupPosition={[GLOBE_POS_1.x, GLOBE_POS_1.y, GLOBE_POS_1.z]}
        primaryColor={new THREE.Vector3(0.85, 0.85, 0.85)} // Silver #D9D9D9
        highlightColor={new THREE.Vector3(1.0, 1.0, 1.0)} // Pure White #FFFFFF
        centerColor={new THREE.Vector3(0.1, 0.1, 0.1)} // Deep Graphite for core
        hitPointRef={hitPointRef} 
        isHoveringRef={isHoveringRef} 
        isMobile={isMobile}
      />

      {/* Second Sphere (Identical Copy) */}
      <ParticleGlobe 
        radius={GLOBE_RADIUS}
        particleCount={particleCount}
        groupPosition={[GLOBE_POS_2.x, GLOBE_POS_2.y, GLOBE_POS_2.z]}
        primaryColor={new THREE.Vector3(0.85, 0.85, 0.85)} // Silver #D9D9D9
        highlightColor={new THREE.Vector3(1.0, 1.0, 1.0)} // Pure White #FFFFFF
        centerColor={new THREE.Vector3(0.1, 0.1, 0.1)} // Deep Graphite for core
        hitPointRef={hitPointRef} 
        isHoveringRef={isHoveringRef} 
        isMobile={isMobile}
      />

      {!isMobile && (
        <EffectComposer>
          <Bloom 
            intensity={1.0} 
            luminanceThreshold={0.5} 
            luminanceSmoothing={0.5} 
            blendFunction={BlendFunction.SCREEN} 
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function CinematicEarth() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    console.log("[MARZVERSE] Canvas mounted");
    
    // Check for mobile on mount to set a lower DPR limit (1.25) to avoid crashing older mobile GPUs
    setDpr(window.innerWidth < 768 ? [1, 1.25] : [1, 2]);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={dpr}
      >
        <InteractiveScene />
      </Canvas>
    </div>
  );
}
