import type { CSSProperties } from 'react';
import { useAssetStore } from '../../stores/assetStore';

const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: '#1a1a2e',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ff6b35',
  fontFamily: "'Courier New', monospace",
  zIndex: 1000,
};

const barContainerStyle: CSSProperties = {
  width: '400px',
  height: '20px',
  background: 'rgba(255, 107, 53, 0.2)',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '20px 0',
};

const buttonStyle: CSSProperties = {
  marginTop: '20px',
  padding: '10px 20px',
  background: '#ff6b35',
  color: '#1a1a2e',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default function LoadingScreen() {
  const { isLoading, loadProgress, currentAsset, error } = useAssetStore();

  if (!isLoading && !error) {
    return null;
  }

  if (error) {
    return (
      <div style={overlayStyle}>
        <h2 style={{ color: '#ff4444' }}>Error Loading Assets</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          type="button"
          style={buttonStyle}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <h2>Loading Whatup...</h2>
      <div style={barContainerStyle}>
        <div
          style={{
            width: `${loadProgress}%`,
            height: '100%',
            background: '#ff6b35',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ opacity: 0.7 }}>{currentAsset || 'Preparing assets...'}</p>
      <p style={{ fontSize: '12px', opacity: 0.5 }}>{Math.round(loadProgress)}%</p>
    </div>
  );
}
