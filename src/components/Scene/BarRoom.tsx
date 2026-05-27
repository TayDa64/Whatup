// Procedural bar interior using simple primitives. No external assets.

export default function BarRoom() {
  return (
    <group>
      {/* Floor - warm wood tone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 1, 1]} />
        <meshStandardMaterial color="#3b2a23" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 10, -20]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1e1a2b" roughness={1} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-20, 10, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#201d2e" roughness={1} />
      </mesh>
      <mesh position={[20, 10, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#201d2e" roughness={1} />
      </mesh>

      {/* Bar counter base */}
      <mesh position={[-2, 0.9, -2]} castShadow receiveShadow>
        <boxGeometry args={[6, 1.8, 1.2]} />
        <meshStandardMaterial color="#2c1f19" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Counter top */}
      <mesh position={[-2, 1.85, -2]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 0.2, 1.4]} />
        <meshStandardMaterial color="#5a4034" roughness={0.6} metalness={0.03} />
      </mesh>

      {/* Back shelves */}
      {[-0.2, 0.6, 1.4].map((y, i) => (
        <mesh key={i} position={[0, 2.5 + y, -6]} castShadow receiveShadow>
          <boxGeometry args={[10, 0.15, 0.6]} />
          <meshStandardMaterial color="#2a2238" roughness={0.9} />
        </mesh>
      ))}

      {/* Bottles (simple emissive boxes) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`b${i}`} position={[-4.5 + i, 3.1 + (i % 2) * 0.25, -6]} castShadow>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
          <meshStandardMaterial color={i % 2 ? '#50e4ff' : '#ff3bd4'} emissive={i % 2 ? '#0d3b46' : '#410a35'} emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* Stools */}
      {[-0.5, 1.2, 2.9].map((x, i) => (
        <group key={`stool${i}`} position={[-4.2 + x, 0, -0.8]}> 
          {/* Seat */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.12, 24]} />
            <meshStandardMaterial color="#4e3a30" roughness={0.7} />
          </mesh>
          {/* Leg */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 12]} />
            <meshStandardMaterial color="#777" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
            <meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Neon panel placeholder */}
      <mesh position={[6, 6, -9.9]} castShadow>
        <boxGeometry args={[6, 1, 0.05]} />
        <meshStandardMaterial color="#1a1020" emissive="#ff3bd4" emissiveIntensity={0.8} />
      </mesh>

      {/* Warm overhead light over the bar */}
      <pointLight position={[-2, 3.5, -2]} intensity={1.6} distance={12} color="#ffcc88" castShadow />
    </group>
  );
}
