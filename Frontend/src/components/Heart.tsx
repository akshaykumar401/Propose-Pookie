import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';

// Helvetiker Bold hosted by three.js CDN
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

export function Heart(props: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.position.y  = Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.set(s, s, s);
      glowRef.current.rotation.y = groupRef.current.rotation.y;
      glowRef.current.position.y = groupRef.current.position.y;
    }
  });

  const geometry = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 2.5, y + 2.5);
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
    heartShape.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
    heartShape.bezierCurveTo(x - 3.0, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    heartShape.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
    heartShape.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
    heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      depth: 1.5,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 4,
      bevelSize: 0.8,
      bevelThickness: 0.8,
    };

    const geom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geom.center();
    geom.scale(0.35, 0.35, 0.35);
    geom.rotateZ(Math.PI);
    return geom;
  }, []);

  // Heart surface sits at ±0.542 → place text just beyond it
  const Z_FRONT =  0.58;
  const Z_BACK  = -0.58;

  // Shared Text3D props
  const t3dProps = {
    font:           FONT_URL,
    size:           0.40,
    height:         0.04,   // extrusion depth
    curveSegments:  5,
    bevelEnabled:   true,
    bevelThickness: 0.015,
    bevelSize:      0.010,
    bevelSegments:  4,
  } as const;

  // Shared material — golden pink metallic look
  const TextMat = () => (
    <meshStandardMaterial
      color="#ffd6e8"
      emissive="#f472b6"
      emissiveIntensity={1.2}
      metalness={0.6}
      roughness={0.2}
      toneMapped={false}
    />
  );

  return (
    <group>
      {/* ── Everything that rotates together ── */}
      <group ref={groupRef} {...(props as any)}>

        {/* Core heart mesh */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#ff6b9d"
            emissive="#c9184a"
            emissiveIntensity={0.4}
            roughness={0.05}
            metalness={0.2}
            transmission={0.6}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0}
            iridescence={0.5}
            iridescenceIOR={1.3}
          />
        </mesh>

        {/* ── FRONT face — raised 3D text, single centered block ── */}
        <Center position={[0, 0, Z_FRONT]}>
          <group>
            <Text3D {...t3dProps} position={[0, 0.26, 0]}>
              Buggu Love
              <TextMat />
            </Text3D>
            <Text3D {...t3dProps} position={[0.7, -0.26, 0]}>
              Pookie
              <TextMat />
            </Text3D>
          </group>
        </Center>

        {/* ── BACK face — mirrored 3D text, single centered block ── */}
        <Center position={[0, 0, Z_BACK]} rotation={[0, Math.PI, 0]}>
          <group>
            <Text3D {...t3dProps} position={[0, 0.26, 0]}>
              Buggu Love
              <TextMat />
            </Text3D>
            <Text3D {...t3dProps} position={[0.7, -0.26, 0]}>
              Pookie
              <TextMat />
            </Text3D>
          </group>
        </Center>
      </group>

      {/* Glow halo — synced in useFrame */}
      <mesh ref={glowRef} geometry={geometry} scale={1.08}>
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
