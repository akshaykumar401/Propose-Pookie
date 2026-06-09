import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Rose component ─────────────────────────────────────── */
function Rose({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current)
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
        <meshStandardMaterial color="#2d6a2d" roughness={0.5} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.12, -0.15, 0]} rotation={[0, 0, -0.7]}>
        <sphereGeometry args={[0.1, 8, 4]} />
        <meshStandardMaterial color="#3a8a3a" roughness={0.6} />
      </mesh>
      {/* Petals */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial color="#e8002d" roughness={0.3} clearcoat={0.5} />
      </mesh>
      <mesh position={[0.08, 0.1, 0.08]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshPhysicalMaterial color="#ff1744" roughness={0.3} clearcoat={0.5} />
      </mesh>
      <mesh position={[-0.07, 0.12, 0.06]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshPhysicalMaterial color="#ff4569" roughness={0.3} clearcoat={0.5} />
      </mesh>
      {/* Center */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshPhysicalMaterial color="#cc0000" roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ── Floating heart (full heart shape) ─────────────────── */
function FloatingHeart({
  position, phase = 0, scale = 0.25, color = '#ff6b9d',
}: {
  position: [number, number, number];
  phase?: number;
  scale?: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Float upward slowly and oscillate
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + phase) * 0.18;
    // Gentle wobble & spin
    groupRef.current.rotation.y += 0.012;
    groupRef.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.12;
    // Pulse scale
    const pulse = 1 + Math.sin(t * 2.5 + phase) * 0.06;
    groupRef.current.scale.setScalar(scale * pulse);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Centre sphere */}
      <mesh>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} transparent opacity={0.92} />
      </mesh>
      {/* Left lobe */}
      <mesh position={[-0.68, 0.22, 0]}>
        <sphereGeometry args={[0.78, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} transparent opacity={0.92} />
      </mesh>
      {/* Right lobe */}
      <mesh position={[0.68, 0.22, 0]}>
        <sphereGeometry args={[0.78, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} transparent opacity={0.92} />
      </mesh>
      {/* Bottom tip cone */}
      <mesh position={[0, -0.62, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.8, 1.3, 32, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} transparent opacity={0.92} />
      </mesh>
    </group>
  );
}

/* ── Male figure — happy, kneeling & proposing ──────────── */
function MaleFigure() {
  const group   = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current)   group.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    // Happy bouncy head nod
    if (headRef.current) headRef.current.rotation.z = Math.sin(t * 2.2) * 0.07;
  });

  return (
    <group ref={group} position={[-1.1, 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.7, 12]} />
        <meshStandardMaterial color="#3d2b8a" roughness={0.5} />
      </mesh>

      {/* Head Group (nods and rotates together) */}
      <group ref={headRef} position={[0, 1.08, -0.04]}>
        {/* Head Base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.23, 20, 20]} />
          <meshStandardMaterial color="#f5c09a" roughness={0.5} />
        </mesh>

        {/* ── Styled Hair — short neat dark hair ── */}
        {/* Main top cap - helmet style cover */}
        <mesh position={[0, 0.02, -0.02]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.245, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Back hair neck flap */}
        <mesh position={[0, -0.10, -0.14]} rotation={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.14, 10, 8]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Sideburn Left */}
        <mesh position={[-0.20, -0.08, 0.05]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.05, 0.12, 0.06]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Sideburn Right */}
        <mesh position={[0.20, -0.08, 0.05]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.05, 0.12, 0.06]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Front Hair bangs center-right swoop */}
        <mesh position={[0.06, 0.14, 0.16]} rotation={[0.3, 0.1, -0.1]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Front Hair bangs left swoop */}
        <mesh position={[-0.08, 0.12, 0.16]} rotation={[0.3, -0.2, 0.2]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>
        {/* Fringe tip lock */}
        <mesh position={[0.0, 0.06, 0.20]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.85} />
        </mesh>

        {/* Eyes — bright & wide with happy sparkle */}
        <mesh position={[-0.09, -0.01, 0.23]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Eye shine left */}
        <mesh position={[-0.08, 0.01, 0.255]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.09, -0.01, 0.23]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Eye shine right */}
        <mesh position={[0.10, 0.01, 0.255]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>

        {/* Big happy smile */}
        <mesh position={[0, -0.09, 0.24]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.08, 0.022, 14, 28, Math.PI * 1.08]} />
          <meshStandardMaterial color="#d4504a" emissive="#ff6b50" emissiveIntensity={0.5} />
        </mesh>
        {/* Smile cheek dimples */}
        <mesh position={[-0.13, -0.12, 0.21]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ff9999" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.13, -0.12, 0.21]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ff9999" transparent opacity={0.6} />
        </mesh>

        {/* Rosy cheeks */}
        <mesh position={[-0.16, -0.05, 0.20]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#ffb3c1" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.16, -0.05, 0.20]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#ffb3c1" transparent opacity={0.55} />
        </mesh>
      </group>

      {/* RIGHT arm — extended forward holding rose */}
      <mesh position={[0.32, 0.68, 0.25]} rotation={[0.5, 0, 1.3]}>
        <cylinderGeometry args={[0.07, 0.07, 0.55, 8]} />
        <meshStandardMaterial color="#f5c09a" roughness={0.5} />
      </mesh>
      {/* Forearm */}
      <mesh position={[0.55, 0.78, 0.5]} rotation={[0.8, 0, 1.1]}>
        <cylinderGeometry args={[0.06, 0.06, 0.45, 8]} />
        <meshStandardMaterial color="#f5c09a" roughness={0.5} />
      </mesh>
      <Rose position={[0.78, 1.12, 0.78]} />

      {/* ── RIGHT leg — kneeling: thigh forward, knee on ground ── */}
      {/* rotation.x = -1.1 → local -Y maps to (0, -0.45, +0.89) = forward-down */}
      <group position={[0.16, 0.16, 0.0]} rotation={[-1.1, 0, 0.05]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.10, 12, 12]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.10, 0.09, 0.42, 10]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.44, 0]}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        {/* Shin bends back down from knee: local rotation reverses direction */}
        <group position={[0, -0.44, 0]} rotation={[2.0, 0, 0]}>
          <mesh position={[0, -0.20, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.38, 10]} />
            <meshStandardMaterial color="#1e1460" roughness={0.4} />
          </mesh>
          {/* Foot / shoe on ground */}
          <mesh position={[0, -0.40, 0.06]}>
            <boxGeometry args={[0.18, 0.09, 0.30]} />
            <meshStandardMaterial color="#0a0a1a" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── LEFT leg — upright, foot flat on ground ── */}
      <group position={[-0.16, 0.16, 0.0]} rotation={[0.05, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.10, 12, 12]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <cylinderGeometry args={[0.10, 0.09, 0.36, 10]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.10, 12, 12]} />
          <meshStandardMaterial color="#1e1460" roughness={0.4} />
        </mesh>
        {/* Shin */}
        <group position={[0, -0.38, 0]} rotation={[0.0, 0, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.34, 10]} />
            <meshStandardMaterial color="#1e1460" roughness={0.4} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.37, 0.06]}>
            <boxGeometry args={[0.18, 0.09, 0.30]} />
            <meshStandardMaterial color="#0a0a1a" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function FemaleFigure() {
  const group   = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const armRef  = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current)
      group.current.rotation.y = -Math.PI / 8 + Math.sin(t * 0.4 + 1) * 0.08;
    // Happy head shake / nod
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 2.0) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 1.5) * 0.04;
    }
    // Right arm pumping with joy
    if (armRef.current)
      armRef.current.rotation.x = -0.8 + Math.sin(t * 3.0) * 0.25;
  });

  return (
    <group ref={group} position={[1.0, 0, 0]}>
      {/* Dress / skirt */}
      <mesh position={[0, -0.1, 0]}>
        <coneGeometry args={[0.5, 0.9, 16, 1, false, 0]} />
        <meshPhysicalMaterial color="#ff6baa" roughness={0.3} clearcoat={0.5} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.6, 12]} />
        <meshPhysicalMaterial color="#ff6baa" roughness={0.3} clearcoat={0.4} />
      </mesh>

      {/* Head Group (shakes and nods together) */}
      <group ref={headRef} position={[0, 1.08, 0]}>
        {/* Head Base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#f5c09a" roughness={0.5} />
        </mesh>

        {/* ── Hair — long flowing dark hair ── */}
        {/* Top cap */}
        <mesh position={[0, 0.12, -0.06]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.245, 16, 14]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Left side — upper */}
        <mesh position={[-0.22, -0.02, -0.06]}>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Left side — mid */}
        <mesh position={[-0.24, -0.26, -0.10]}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Left side — lower */}
        <mesh position={[-0.20, -0.50, -0.10]}>
          <sphereGeometry args={[0.10, 8, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Right side — upper */}
        <mesh position={[0.22, -0.02, -0.06]}>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Right side — mid */}
        <mesh position={[0.24, -0.26, -0.10]}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Right side — lower */}
        <mesh position={[0.20, -0.50, -0.10]}>
          <sphereGeometry args={[0.10, 8, 8]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Back ponytail — upper */}
        <mesh position={[0, -0.12, -0.24]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.46, 12]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>
        {/* Back ponytail — lower */}
        <mesh position={[0, -0.46, -0.26]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.07, 0.42, 12]} />
          <meshStandardMaterial color="#2a0e00" roughness={0.85} />
        </mesh>

        {/* Eyes — heart-shaped (two tiny spheres in a V) */}
        {/* Left heart-eye: two pink spheres */}
        <mesh position={[-0.09, 0.01, 0.185]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.075, -0.005, 0.185]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.105, -0.005, 0.185]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>
        {/* Right heart-eye */}
        <mesh position={[0.09, 0.01, 0.185]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.075, -0.005, 0.185]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.105, -0.005, 0.185]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#ff2060" emissive="#ff2060" emissiveIntensity={0.8} />
        </mesh>

        {/* Big beaming smile — arc flipped so it curves down (corners up = smile) */}
        <mesh position={[0, -0.065, 0.195]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.072, 0.026, 14, 28, Math.PI * 1.1]} />
          <meshStandardMaterial color="#d4504a" emissive="#ff6b50" emissiveIntensity={0.6} />
        </mesh>

        {/* Rosy cheeks — bigger & brighter */}
        <mesh position={[-0.16, -0.05, 0.16]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ff9ab0" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.16, -0.05, 0.16]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ff9ab0" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Left arm — extended down */}
      <mesh position={[-0.28, 0.62, 0]} rotation={[0.1, 0, -0.5]}>
        <cylinderGeometry args={[0.065, 0.065, 0.5, 8]} />
        <meshStandardMaterial color="#f5c09a" roughness={0.5} />
      </mesh>
      <mesh position={[-0.38, 0.35, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#f5c09a" roughness={0.5} />
      </mesh>

      {/* Right arm — raised high with joy (animated) */}
      <group ref={armRef} position={[0.27, 0.76, 0.1]} rotation={[-0.8, 0, 0.4]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.52, 8]} />
          <meshStandardMaterial color="#f5c09a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#f5c09a" roughness={0.5} />
        </mesh>
      </group>

      {/* Shoes */}
      <mesh position={[-0.14, -0.55, 0.05]}>
        <boxGeometry args={[0.16, 0.1, 0.28]} />
        <meshStandardMaterial color="#8b0057" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, -0.55, 0.05]}>
        <boxGeometry args={[0.16, 0.1, 0.28]} />
        <meshStandardMaterial color="#8b0057" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Glowing moon ───────────────────────────────────────── */
function Moon() {
  return (
    <group position={[0, 4.5, -8]}>
      {/* Moon body */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#fff8e7" emissive="#ffe8a0" emissiveIntensity={0.6} roughness={0.8} />
      </mesh>
      {/* Inner halo glow */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color="#ffe8a0" transparent opacity={0.08} />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial color="#ffcba0" transparent opacity={0.04} />
      </mesh>
      {/* Moon light casting on the couple */}
      <pointLight position={[0, 0, 0]} intensity={12} color="#ffe8c0" distance={30} decay={1.5} />
    </group>
  );
}

/* ── Falling rose petal ─────────────────────────────────── */
function FallingPetal({ startX, startZ, phase, speed }: {
  startX: number; startZ: number; phase: number; speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const RESET_Y = -2;
  const START_Y = 6;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    // Fall downward, reset at bottom
    const y = START_Y - ((t % (START_Y - RESET_Y)) + (START_Y - RESET_Y)) % (START_Y - RESET_Y);
    ref.current.position.y = y;
    // Drift side to side
    ref.current.position.x = startX + Math.sin(t * 0.7) * 0.4;
    ref.current.position.z = startZ + Math.cos(t * 0.5) * 0.3;
    // Tumble
    ref.current.rotation.x += 0.02;
    ref.current.rotation.y += 0.015;
    ref.current.rotation.z = Math.sin(t * 1.2) * 0.5;
  });

  return (
    <mesh ref={ref} position={[startX, START_Y - (phase % (START_Y - RESET_Y)), startZ]}>
      <planeGeometry args={[0.12, 0.09]} />
      <meshStandardMaterial
        color="#ff4477"
        emissive="#ff2055"
        emissiveIntensity={0.3}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Candle ─────────────────────────────────────────────── */
function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.PointLight>(null!);
  useFrame((state) => {
    if (!flameRef.current) return;
    // Flicker intensity
    flameRef.current.intensity = 3.5 + Math.sin(state.clock.elapsedTime * 8 + position[0] * 10) * 1.2
      + Math.sin(state.clock.elapsedTime * 13 + position[2] * 7) * 0.6;
  });
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 8]} />
        <meshStandardMaterial color="#f5f0e8" emissive="#f5e8d0" emissiveIntensity={0.1} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 6]} />
        <meshStandardMaterial color="#2a1a00" />
      </mesh>
      {/* Flame glow sphere */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff8800" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>
      {/* Inner white flame tip */}
      <mesh position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.95} />
      </mesh>
      {/* Flickering point light */}
      <pointLight ref={flameRef} position={[0, 0.3, 0]} color="#ffaa44" intensity={3.5} distance={3} decay={2} />
    </group>
  );
}

/* ── Full propose scene ─────────────────────────────────── */
export function ProposeScene() {
  const HEARTS: Array<{
    pos: [number, number, number];
    phase: number;
    scale: number;
    color: string;
    speed: number;
    floatIntensity: number;
  }> = [
    { pos: [-0.3,  1.8,  0.3],  phase: 0.0,  scale: 0.20, color: '#ff6b9d', speed: 2.0, floatIntensity: 0.5 },
    { pos: [ 0.6,  2.1, -0.2],  phase: 1.2,  scale: 0.15, color: '#ff2060', speed: 1.5, floatIntensity: 0.4 },
    { pos: [-1.4,  1.5,  0.5],  phase: 2.4,  scale: 0.13, color: '#ff9de2', speed: 2.5, floatIntensity: 0.6 },
    { pos: [ 1.5,  1.4,  0.4],  phase: 3.6,  scale: 0.12, color: '#c77dff', speed: 1.8, floatIntensity: 0.3 },
    { pos: [ 0.2,  2.5,  0.1],  phase: 0.8,  scale: 0.11, color: '#ff6b9d', speed: 2.2, floatIntensity: 0.5 },
    { pos: [-0.8,  2.3,  0.4],  phase: 1.7,  scale: 0.16, color: '#ff2060', speed: 1.9, floatIntensity: 0.4 },
    { pos: [ 1.0,  2.6, -0.3],  phase: 3.0,  scale: 0.10, color: '#ff9de2', speed: 2.8, floatIntensity: 0.7 },
    { pos: [-1.8,  2.0,  0.2],  phase: 4.2,  scale: 0.14, color: '#d4af37', speed: 1.6, floatIntensity: 0.4 },
    { pos: [ 0.4,  3.0, -0.1],  phase: 2.1,  scale: 0.09, color: '#ff6b9d', speed: 3.0, floatIntensity: 0.6 },
    { pos: [-0.5,  1.6,  0.6],  phase: 5.1,  scale: 0.18, color: '#ff2060', speed: 1.4, floatIntensity: 0.35 },
    { pos: [ 1.8,  1.8,  0.5],  phase: 0.5,  scale: 0.12, color: '#c77dff', speed: 2.4, floatIntensity: 0.5 },
    { pos: [-1.1,  2.8, -0.2],  phase: 3.8,  scale: 0.10, color: '#ff9de2', speed: 2.1, floatIntensity: 0.45 },
  ];

  const PETALS = [
    { x: -2.0, z:  0.3, phase:  0.0, speed: 0.5 },
    { x:  1.8, z: -0.4, phase:  1.5, speed: 0.4 },
    { x: -0.5, z:  1.2, phase:  3.0, speed: 0.6 },
    { x:  0.8, z:  0.6, phase:  0.7, speed: 0.45 },
    { x: -1.5, z: -0.8, phase:  2.1, speed: 0.55 },
    { x:  2.2, z:  0.9, phase:  4.0, speed: 0.35 },
    { x: -0.2, z: -1.0, phase:  1.2, speed: 0.65 },
    { x:  1.2, z:  1.5, phase:  5.5, speed: 0.5  },
    { x: -1.8, z:  1.0, phase:  2.8, speed: 0.42 },
    { x:  0.3, z: -0.5, phase:  0.4, speed: 0.58 },
    { x: -2.5, z:  0.0, phase:  3.3, speed: 0.48 },
    { x:  2.5, z: -0.2, phase:  1.8, speed: 0.52 },
    { x: -0.9, z:  1.8, phase:  4.5, speed: 0.38 },
    { x:  1.5, z: -1.2, phase:  2.4, speed: 0.62 },
    { x:  0.0, z:  2.0, phase:  0.9, speed: 0.44 },
    { x: -2.2, z: -1.5, phase: 3.7,  speed: 0.56 },
    { x:  1.9, z:  1.8, phase:  6.0, speed: 0.40 },
    { x: -0.6, z: -1.8, phase: 1.1,  speed: 0.68 },
    { x:  0.6, z:  2.5, phase:  4.8, speed: 0.46 },
    { x: -1.2, z: -0.3, phase: 2.6,  speed: 0.54 },
  ];

  const CANDLES: [number, number, number][] = [
    [-2.2, -0.54, -0.5],
    [ 2.2, -0.54, -0.5],
    [-2.0, -0.54,  1.2],
    [ 2.0, -0.54,  1.2],
    [-0.8, -0.54,  2.0],
    [ 0.8, -0.54,  2.0],
  ];

  return (
    <>
      {/* Stars — denser & slightly more saturated for romantic night sky */}
      <Stars radius={80} depth={60} count={4000} factor={4} saturation={0.8} fade speed={0.3} />

      {/* ── Romantic lighting ── */}
      {/* Soft ambient — low so candles & moon dominate */}
      <ambientLight intensity={0.3} />
      {/* Main warm rose fill */}
      <pointLight position={[0, 4, 4]}   intensity={12} color="#ff6b9d" />
      {/* Lavender fill from side */}
      <pointLight position={[-4, 2, 3]}  intensity={6}  color="#c77dff" />
      {/* Warm golden accent */}
      <pointLight position={[4, 1, 2]}   intensity={5}  color="#d4af37" />
      {/* Deep rose rim from below/front */}
      <pointLight position={[0, -1, 5]}  intensity={4}  color="#ff1a5e" />
      {/* Moonlight backlight */}
      <pointLight position={[0, 6, -10]} intensity={8}  color="#ffe8c0" />

      {/* Moon */}
      <Moon />

      {/* ── Ground ── */}
      {/* Deep velvet ground */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#120020" transparent opacity={0.85} />
      </mesh>
      {/* Inner spotlight pool on ground */}
      <mesh position={[0, -0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#3d0040" transparent opacity={0.4} />
      </mesh>
      {/* Glowing petal ring */}
      <mesh position={[0, -0.535, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.3, 64]} />
        <meshBasicMaterial color="#ff3366" transparent opacity={0.18} />
      </mesh>
      {/* Outer soft glow ring */}
      <mesh position={[0, -0.53, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.5, 64]} />
        <meshBasicMaterial color="#c77dff" transparent opacity={0.07} />
      </mesh>

      {/* Ground mist — layered translucent planes close to the ground */}
      <mesh position={[0, -0.40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshBasicMaterial color="#8855aa" transparent opacity={0.07} />
      </mesh>
      <mesh position={[0, -0.30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial color="#aa66cc" transparent opacity={0.05} />
      </mesh>

      {/* Scattered petal dots on ground */}
      {[
        [-0.8, 0.4], [0.6, -0.3], [-0.3, 1.0], [1.1, 0.7],
        [-1.2, -0.6], [0.2, -0.9], [-0.5, -1.1], [0.9, 1.2],
        [-1.5, 0.8], [1.4, -0.8], [0.0, 1.4], [-1.0, 1.5],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, -0.52, pz]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
          <planeGeometry args={[0.1, 0.08]} />
          <meshStandardMaterial color="#ff3366" emissive="#ff1155" emissiveIntensity={0.4} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Candles around the couple */}
      {CANDLES.map((pos, i) => <Candle key={i} position={pos} />)}

      {/* Figures */}
      <MaleFigure />
      <FemaleFigure />

      {/* Falling rose petals */}
      {PETALS.map((p, i) => (
        <FallingPetal key={i} startX={p.x} startZ={p.z} phase={p.phase} speed={p.speed} />
      ))}

      {/* Floating hearts */}
      {HEARTS.map((h, i) => (
        <Float key={i} speed={h.speed} floatIntensity={h.floatIntensity}>
          <FloatingHeart position={h.pos} phase={h.phase} scale={h.scale} color={h.color} />
        </Float>
      ))}

      {/* Sparkles — warm romantic palette */}
      <Sparkles count={150} scale={10} size={2.5} speed={0.5} opacity={0.70} color="#f9a8d4" />
      <Sparkles count={60}  scale={6}  size={3.5} speed={0.8} opacity={0.50} color="#d4af37" />
      <Sparkles count={50}  scale={7}  size={2.0} speed={0.6} opacity={0.35} color="#c77dff" />
      <Sparkles count={40}  scale={5}  size={1.5} speed={1.2} opacity={0.30} color="#ffe8a0" />
    </>
  );
}

