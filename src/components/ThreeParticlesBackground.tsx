import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  speedMultiplier?: number;
  colorTheme?: "cyan-purple" | "neon-pink" | "cosmic-blue";
  repulsionForce?: number;
}

function FloatingParticles({
  count = 250,
  speedMultiplier = 1.0,
  colorTheme = "cyan-purple",
  repulsionForce = 1.0,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  // Create initial positions, velocities, colors and original positions (for reference)
  const [positions, velocities, colors, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const c1 = new THREE.Color("#00ffff"); // Cyan
    const c2 = new THREE.Color("#9d4edd"); // Purple
    const c3 = new THREE.Color("#ff007f"); // Pink
    const c4 = new THREE.Color("#3a86c8"); // Cosmic Blue

    for (let i = 0; i < count; i++) {
      // Spawn particles distributed in a 3D sphere/ellipsoid grid
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // Small randomized velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.015;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Color interpolation based on position & theme
      let pointColor = new THREE.Color();
      if (colorTheme === "cyan-purple") {
        pointColor.copy(c1).lerp(c2, Math.random());
      } else if (colorTheme === "neon-pink") {
        pointColor.copy(c3).lerp(c2, Math.random());
      } else {
        pointColor.copy(c4).lerp(c1, Math.random());
      }

      cols[i * 3] = pointColor.r;
      cols[i * 3 + 1] = pointColor.g;
      cols[i * 3 + 2] = pointColor.b;
    }

    return [pos, vel, cols, origPos];
  }, [count, colorTheme]);

  // Update particle vertices in each animation frame
  useFrame((state) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    // Convert mouse coordinates from normalized viewport space to roughly 3D space
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // 1. Natural undulating drift using sine/cosine waves
      const driftX = Math.sin(time * 0.5 * speedMultiplier + originalPositions[idx]) * 0.002 * speedMultiplier;
      const driftY = Math.cos(time * 0.4 * speedMultiplier + originalPositions[idx + 1]) * 0.002 * speedMultiplier;

      // Standard translation velocity update
      positions[idx] += velocities[idx] * speedMultiplier + driftX;
      positions[idx + 1] += velocities[idx + 1] * speedMultiplier + driftY;
      positions[idx + 2] += velocities[idx + 2] * speedMultiplier;

      // Wrap around bounds to keep particle cloud enclosed
      const radiusBoundX = 6.5;
      const radiusBoundY = 4.5;
      const radiusBoundZ = 3.5;

      if (Math.abs(positions[idx]) > radiusBoundX) {
        positions[idx] = -Math.sign(positions[idx]) * (radiusBoundX - 0.1);
      }
      if (Math.abs(positions[idx + 1]) > radiusBoundY) {
        positions[idx + 1] = -Math.sign(positions[idx + 1]) * (radiusBoundY - 0.1);
      }
      if (Math.abs(positions[idx + 2]) > radiusBoundZ) {
        positions[idx + 2] = -Math.sign(positions[idx + 2]) * (radiusBoundZ - 0.1);
      }

      // 2. Mouse Interaction: Attraction or soft Pushback
      const dx = positions[idx] - targetX;
      const dy = positions[idx + 1] - targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Force radius influence
      const influenceRadius = 2.8;
      if (distance < influenceRadius && distance > 0.1) {
        const strength = (1.0 - distance / influenceRadius) * 0.006 * repulsionForce;
        // Push apart gently (repulsion direction)
        positions[idx] += (dx / distance) * strength;
        positions[idx + 1] += (dy / distance) * strength;
      }
    }

    // Flag three.js that the array was updated
    posAttr.needsUpdate = true;

    // Slow atmospheric rotation of entire coordinate group
    pointsRef.current.rotation.y = time * 0.03 * speedMultiplier;
    pointsRef.current.rotation.x = time * 0.015 * speedMultiplier;
  });

  // Create a beautiful circular glowing particle texture programmatically
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      gradient.addColorStop(0.2, "rgba(0, 255, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(157, 78, 221, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        depthWrite={false}
        map={particleTexture}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Subordinate slow rotating wireframe grid or geometry to act as cybernetic reference
function CyberWireframe() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreWireRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringInnerRef = useRef<THREE.Mesh>(null);
  
  const { pointer } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly interpolate the entire group's rotation based on mouse movement for 3D parallax
    if (groupRef.current) {
      const targetRotationY = pointer.x * 0.45;
      const targetRotationX = -pointer.y * 0.45;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.08;
    }

    // Spin independent nodes with offsets
    if (knotRef.current) {
      knotRef.current.rotation.y = -time * 0.035;
      knotRef.current.rotation.z = time * 0.015;
    }
    
    // Core crystalline geometry physics
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.18;
      coreRef.current.rotation.y = -time * 0.22;
      
      // Heartbeat breathing scale effect
      const scale = 1.0 + Math.sin(time * 2.0) * 0.06;
      coreRef.current.scale.set(scale, scale, scale);
    }
    
    if (coreWireRef.current) {
      coreWireRef.current.rotation.x = -time * 0.12;
      coreWireRef.current.rotation.y = time * 0.15;
      const wireScale = 1.25 + Math.sin(time * 2.0) * 0.06;
      coreWireRef.current.scale.set(wireScale, wireScale, wireScale);
    }

    // Outer Gyro-rings spinning on opposing axes
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.04;
      ringRef.current.rotation.y = time * 0.08;
    }
    
    if (ringInnerRef.current) {
      ringInnerRef.current.rotation.x = -time * 0.07;
      ringInnerRef.current.rotation.z = time * 0.11;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.5]}>
      {/* Central Solid Pulsing Crystal Core (Double Pyramidal Octahedron) */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe wrapper around the crystal core */}
      <mesh ref={coreWireRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial
          color="#ff007f"
          wireframe
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Complex Quantum Torus Knot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.5, 0.25, 80, 10, 3, 4]} />
        <meshBasicMaterial
          color="#9d4edd"
          wireframe
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer Cyan Gyroscopic Orbit Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.8, 0.02, 12, 64]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Pink Gyroscopic Orbit Ring */}
      <mesh ref={ringInnerRef}>
        <torusGeometry args={[2.2, 0.015, 8, 48]} />
        <meshBasicMaterial
          color="#ff007f"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Interactive 3D Neural Lattice Component with spring physics, floating nodes and connecting line threads
function NeuralLattice() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  const nodeCount = 55;
  const maxDistance = 2.4;

  // We maintain structural positions, velocities, and elastic anchor points
  const [nodes, velocities, anchors] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const vel = new Float32Array(nodeCount * 3);
    const anc = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      // Symmetrically distribute nodes inside a 3D coordinate viewport ellipsoid
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      anc[i * 3] = x;
      anc[i * 3 + 1] = y;
      anc[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel, anc];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;

    const pointsGeo = pointsRef.current?.geometry;
    const linesGeo = lineRef.current?.geometry;
    if (!pointsGeo) return;

    const positions = pointsGeo.attributes.position.array as Float32Array;
    
    // 1. Particle floating, self-attraction, and spring cursor mechanics simulation
    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;

      // Base spring physics: pull nodes gently back toward their anchor coordinates
      const springConstant = 0.015;
      const dampingFactor = 0.94;

      const ax = anchors[idx];
      const ay = anchors[idx + 1];
      const az = anchors[idx + 2];

      // Add a small trigonometric wave displacement to the anchors over time (floating)
      const dynamicAnchorX = ax + Math.sin(time * 0.3 + i) * 0.25;
      const dynamicAnchorY = ay + Math.cos(time * 0.25 + i * 1.5) * 0.25;
      const dynamicAnchorZ = az + Math.sin(time * 0.4 + i * 2.0) * 0.15;

      // Force vector calculation
      let fx = (dynamicAnchorX - positions[idx]) * springConstant;
      let fy = (dynamicAnchorY - positions[idx + 1]) * springConstant;
      let fz = (dynamicAnchorZ - positions[idx + 2]) * springConstant;

      // Elastic mouse pushback force
      const dx = positions[idx] - targetX;
      const dy = positions[idx + 1] - targetY;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);

      const cursorRepelRadius = 3.2;
      if (mouseDist < cursorRepelRadius && mouseDist > 0.1) {
        // High elastic spring force pushing nodes backward
        const forcePct = (1.0 - mouseDist / cursorRepelRadius);
        const repelStrength = forcePct * forcePct * 0.08;
        fx += (dx / mouseDist) * repelStrength;
        fy += (dy / mouseDist) * repelStrength;
      }

      // Apply velocity vector updates
      velocities[idx] = (velocities[idx] + fx) * dampingFactor;
      velocities[idx + 1] = (velocities[idx + 1] + fy) * dampingFactor;
      velocities[idx + 2] = (velocities[idx + 2] + fz) * dampingFactor;

      positions[idx] += velocities[idx];
      positions[idx + 1] += velocities[idx + 1];
      positions[idx + 2] += velocities[idx + 2];
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // 2. Compute live connected threads dynamic line array
    if (linesGeo) {
      const linePositions: number[] = [];
      const lineColors: number[] = [];
      
      const cyan = new THREE.Color("#00ffff");
      const violet = new THREE.Color("#9d4edd");

      for (let i = 0; i < nodeCount; i++) {
        const idxA = i * 3;
        const xA = positions[idxA];
        const yA = positions[idxA + 1];
        const zA = positions[idxA + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const idxB = j * 3;
          const xB = positions[idxB];
          const yB = positions[idxB + 1];
          const zB = positions[idxB + 2];

          const dist = Math.sqrt(
            (xA - xB) ** 2 + (yA - yB) ** 2 + (zA - zB) ** 2
          );

          if (dist < maxDistance) {
            // Include connection line
            linePositions.push(xA, yA, zA, xB, yB, zB);

            // Glimmering color interpolation on connection integrity
            const proximity = 1.0 - dist / maxDistance;
            const lineColor = new THREE.Color().copy(cyan).lerp(violet, i / nodeCount);
            
            // Add gradient color segments
            lineColors.push(
              lineColor.r, lineColor.g, lineColor.b,
              lineColor.r * 0.5, lineColor.g * 0.5, lineColor.b * 1.5
            );
          }
        }
      }

      linesGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      linesGeo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(lineColors, 3)
      );
      linesGeo.attributes.position.needsUpdate = true;
      if (linesGeo.attributes.color) {
        linesGeo.attributes.color.needsUpdate = true;
      }
    }

    // Gradual overall continuous drift
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
    }
    if (lineRef.current) {
      lineRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Glow lines thread lattice */}
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          linewidth={1}
        />
      </lineSegments>

      {/* Floating physical node indicators */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#00ffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ThreeParticlesBackground({
  count = 250,
  speedMultiplier = 1.0,
  colorTheme = "cyan-purple",
  repulsionForce = 1.0,
}: ParticlesProps) {
  return (
    <div
      id="three-canvas-root"
      className="absolute inset-0 -z-20 h-full w-full bg-cyber-dark overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }} // Ensure click events go through to the DOM below
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[1, 2, 3]} intensity={0.5} />
        <FloatingParticles
          count={count}
          speedMultiplier={speedMultiplier}
          colorTheme={colorTheme}
          repulsionForce={repulsionForce}
        />
        <CyberWireframe />
        <NeuralLattice />
      </Canvas>
      {/* Background radial overlay to ground dark luxury vibe */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 20%, rgba(7, 7, 12, 0.85) 85%)"
        }}
      />
    </div>
  );
}
