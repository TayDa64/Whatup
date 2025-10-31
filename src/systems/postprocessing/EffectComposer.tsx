import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer as ThreeEffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { useEffectsStore } from '../../stores/effectsStore';
import * as THREE from 'three';

// Custom post-processing composer using three-stdlib to avoid peer dependency conflicts.
export default function PostFX() {
  const { enabled, bloom, vignette } = useEffectsStore();
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<ThreeEffectComposer | null>(null);
  const renderPassRef = useRef<RenderPass | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const vignettePassRef = useRef<ShaderPass | null>(null);

  // Initialize composer and passes
  useEffect(() => {
    if (!enabled) return;

    const composer = new ThreeEffectComposer(gl);
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    renderPassRef.current = renderPass;
    composer.addPass(renderPass);

    if (bloom.enabled) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        Math.max(0, Math.min(2, bloom.intensity)), // strength
        Math.max(0, Math.min(1, bloom.smoothing)), // radius
        Math.max(0, Math.min(1, bloom.threshold)) // threshold
      );
      bloomPassRef.current = bloomPass;
      composer.addPass(bloomPass);
    }

    if (vignette.enabled) {
      const shader = VignetteShader as any;
      const vignettePass = new ShaderPass(shader);
      vignettePassRef.current = vignettePass;
      vignettePass.uniforms["offset"].value = 0.1;
      vignettePass.uniforms["darkness"].value = Math.max(0, Math.min(1, vignette.opacity));
      composer.addPass(vignettePass);
    }

    return () => {
      composer.dispose();
      composerRef.current = null;
      renderPassRef.current = null;
      bloomPassRef.current = null;
      vignettePassRef.current = null;
    };
  }, [enabled, gl, scene, camera, size.width, size.height, bloom.enabled, bloom.intensity, bloom.smoothing, bloom.threshold, vignette.enabled, vignette.opacity]);

  // Resize composer with viewport
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size.width, size.height]);

  // Render via composer each frame
  useFrame((_state, delta) => {
    if (!enabled || !composerRef.current) return;
    composerRef.current.render(delta);
  }, 1);

  return null;
}

