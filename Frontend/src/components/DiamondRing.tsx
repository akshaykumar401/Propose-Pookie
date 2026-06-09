import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Gold band ring + diamond gem
export function DiamondRing(props: JSX.IntrinsicElements['group']) {
  const groupRef  = useRef<THREE.Group>(null!);
  const gemRef    = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // Slow rotation + bob
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.18;
    // Gem shimmer: vary emissive
    if (gemRef.current) {
      const mat = gemRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.22, 32, 128]} />
        <meshPhysicalMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
        />
      </mesh>

      {/* Setting prongs (small gold pillars) */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.cos(rad) * 0.95, 0.18, Math.sin(rad) * 0.95]}>
            <cylinderGeometry args={[0.06, 0.06, 0.28, 8]} />
            <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.05} />
          </mesh>
        );
      })}

      {/* Diamond gem — top cone (crown) */}
      <mesh ref={gemRef} position={[0, 0.72, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.55, 0.65, 8, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          thickness={1.5}
          roughness={0}
          metalness={0}
          ior={2.42}            // diamond IOR
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
          iridescence={1}
          iridescenceIOR={1.8}
          emissive="#c77dff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Diamond gem — bottom cone (pavilion) */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.55, 0.48, 8, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          thickness={1}
          roughness={0}
          metalness={0}
          ior={2.42}
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
          iridescence={1}
          iridescenceIOR={1.8}
          emissive="#f9a8d4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Gem table (flat top face) */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, Math.PI / 8, 0]}>
        <cylinderGeometry args={[0.3, 0.55, 0.04, 8]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.98}
          roughness={0}
          metalness={0}
          ior={2.42}
          clearcoat={1}
          iridescence={1}
          iridescenceIOR={2}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
