import { Suspense, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type PropItem = {
  file: string; // relative to /models/props, e.g., "chair.glb"
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

export default function Props() {
  const [layout, setLayout] = useState<PropItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/models/props/layout.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && Array.isArray(json)) setLayout(json as PropItem[]);
      })
      .catch(() => {
        // Missing file is OK; render nothing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <group>
      {layout.map((item, idx) => (
        <Suspense key={`${item.file}-${idx}`} fallback={null}>
          <SingleProp {...item} />
        </Suspense>
      ))}
    </group>
  );
}

function SingleProp({ file, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PropItem) {
  const gltf = useLoader(GLTFLoader, `/models/props/${file}`);
  return (
    <group position={position} rotation={rotation} scale={scale as any}>
      {/* clone to avoid sharing scene graph state */}
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
