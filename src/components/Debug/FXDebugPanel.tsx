import { useEffect, useState } from 'react';
import { useEffectsStore } from '../../stores/effectsStore';

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  top: 12,
  right: 12,
  width: 300,
  background: 'rgba(20,20,30,0.9)',
  color: '#eee',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: 12,
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  fontSize: 12,
  zIndex: 1100,
};

const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 };
const labelStyle: React.CSSProperties = { width: 90, opacity: 0.9 };
const sectionTitleStyle: React.CSSProperties = { margin: '10px 0 6px', fontWeight: 700, opacity: 0.9 };

export default function FXDebugPanel() {
  const [visible, setVisible] = useState<boolean>(true);
  const { enabled, setEnabled, bloom, setBloom, vignette, setVignette, toneMapping, setToneMapping, exposure, setExposure, applyPreset, perf, setPerf } = useEffectsStore();

  // Keyboard toggle (F9)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F9') setVisible((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        style={{ position: 'fixed', top: 12, right: 12, zIndex: 1100, padding: '6px 10px', borderRadius: 6 }}
        title="Open FX Debug (F9)"
      >
        FX ⚙️
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <strong>FX Debug</strong>
        <button
          type="button"
          onClick={() => setVisible(false)}
          style={{ background: 'transparent', color: '#eee', border: 'none', cursor: 'pointer' }}
          title="Hide (F9)"
        >
          ✖
        </button>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Enabled</label>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      </div>

      <div style={sectionTitleStyle}>Tone Mapping</div>
      <div style={rowStyle}>
        <label style={labelStyle}>Operator</label>
        <select value={toneMapping} onChange={(e) => setToneMapping(e.target.value as any)} style={{ flex: 1 }}>
          <option value="None">None</option>
          <option value="Linear">Linear</option>
          <option value="Reinhard">Reinhard</option>
          <option value="Cineon">Cineon</option>
          <option value="ACES">ACES</option>
        </select>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Exposure</label>
        <input type="range" min={0.1} max={2} step={0.01} value={exposure} onChange={(e) => setExposure(Number(e.target.value))} style={{ flex: 1 }} />
        <span>{exposure.toFixed(2)}</span>
      </div>

      <div style={sectionTitleStyle}>Bloom</div>
      <div style={rowStyle}>
        <label style={labelStyle}>Enabled</label>
        <input
          type="checkbox"
          checked={bloom.enabled}
          onChange={(e) => setBloom({ enabled: e.target.checked })}
        />
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Intensity</label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={bloom.intensity}
          onChange={(e) => setBloom({ intensity: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span>{bloom.intensity.toFixed(2)}</span>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Threshold</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bloom.threshold}
          onChange={(e) => setBloom({ threshold: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span>{bloom.threshold.toFixed(2)}</span>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Smoothing</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bloom.smoothing}
          onChange={(e) => setBloom({ smoothing: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span>{bloom.smoothing.toFixed(2)}</span>
      </div>

      <div style={sectionTitleStyle}>Vignette</div>
      <div style={rowStyle}>
        <label style={labelStyle}>Enabled</label>
        <input
          type="checkbox"
          checked={vignette.enabled}
          onChange={(e) => setVignette({ enabled: e.target.checked })}
        />
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Eskil</label>
        <input
          type="checkbox"
          checked={vignette.eskil}
          onChange={(e) => setVignette({ eskil: e.target.checked })}
        />
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Opacity</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={vignette.opacity}
          onChange={(e) => setVignette({ opacity: Number(e.target.value) })}
          style={{ flex: 1 }}
        />
        <span>{vignette.opacity.toFixed(2)}</span>
      </div>

      <div style={sectionTitleStyle}>Presets</div>
      <div style={rowStyle}>
        <label style={labelStyle}>Apply</label>
        <select defaultValue="" onChange={(e) => { const v = e.target.value as any; if (v) applyPreset(v); }} style={{ flex: 1 }}>
          <option value="" disabled>Select preset...</option>
          <option value="Cinematic">Cinematic</option>
          <option value="Neon">Neon</option>
          <option value="LowKey">LowKey</option>
          <option value="Reset">Reset</option>
        </select>
      </div>

      <div style={sectionTitleStyle}>Performance</div>
      <div style={rowStyle}>
        <label style={labelStyle}>Auto FX</label>
        <input type="checkbox" checked={perf.auto} onChange={(e) => setPerf({ auto: e.target.checked })} />
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Target FPS</label>
        <input type="range" min={30} max={60} step={1} value={perf.targetFps} onChange={(e) => setPerf({ targetFps: Number(e.target.value) })} style={{ flex: 1 }} />
        <span>{perf.targetFps}</span>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Window</label>
        <input type="range" min={30} max={120} step={1} value={perf.window} onChange={(e) => setPerf({ window: Number(e.target.value) })} style={{ flex: 1 }} />
        <span>{perf.window}</span>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>Cooldown</label>
        <input type="range" min={1} max={10} step={1} value={perf.cooldownSec} onChange={(e) => setPerf({ cooldownSec: Number(e.target.value) })} style={{ flex: 1 }} />
        <span>{perf.cooldownSec}s</span>
      </div>
    </div>
  );
}
