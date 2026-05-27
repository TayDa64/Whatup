import GameScene from './components/Scene/GameScene';
import HUD from './components/HUD/HUD';
import FXDebugPanel from './components/Debug/FXDebugPanel';
import './styles/HUD.css';

export default function App() {
  return (
    <>
      <GameScene />
      <HUD />
      <FXDebugPanel />
    </>
  );
}
