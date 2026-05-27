import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEffectsStore } from '../../stores/effectsStore';

export default function PerformanceGuard() {
  const { perf, enabled, setEnabled } = useEffectsStore();
  const bufferRef = useRef<number[]>([]);
  const cooldownUntilRef = useRef<number>(0);
  const lastDecisionRef = useRef<number>(0);

  // Reset buffer when config changes
  useEffect(() => {
    bufferRef.current = [];
    cooldownUntilRef.current = 0;
  }, [perf.window, perf.targetFps, perf.cooldownSec]);

  useFrame((_, delta) => {
    if (!perf.auto) return;

    const now = performance.now();
    const ms = delta * 1000;
    const buffer = bufferRef.current;

    buffer.push(ms);
    if (buffer.length > perf.window) buffer.shift();

    if (buffer.length < perf.window) return; // not enough data yet

    const avg = buffer.reduce((a, b) => a + b, 0) / buffer.length;
    const targetMs = 1000 / perf.targetFps;

    if (now < cooldownUntilRef.current) return; // still cooling down
    if (now - lastDecisionRef.current < 500) return; // debounce decisions a bit

    // Hysteresis: disable if > targetMs, re-enable only if comfortably below
    if (avg > targetMs && enabled) {
      setEnabled(false);
      cooldownUntilRef.current = now + perf.cooldownSec * 1000;
      lastDecisionRef.current = now;
    } else if (avg < targetMs * 0.9 && !enabled) {
      setEnabled(true);
      lastDecisionRef.current = now;
    }
  }, 2);

  return null;
}
