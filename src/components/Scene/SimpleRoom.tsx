// SimpleRoom uses the automatic JSX runtime; no React import needed

// A lightweight interior: floor + 4 walls. Good shadow receiver and neutral backdrop.
export default function SimpleRoom() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 1, 1]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 10, -20]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#232334" roughness={1} />
      </mesh>

      {/* Front wall (slightly darker, far away) */}
      <mesh position={[0, 10, 20]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1b1b2a" roughness={1} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-20, 10, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#25253a" roughness={1} />
      </mesh>

      {/* Right wall */}
      <mesh position={[20, 10, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#25253a" roughness={1} />
      </mesh>
    </group>
  );
}
