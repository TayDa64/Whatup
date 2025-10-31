# Phase 1 Implementation Spec: Three.js Scene + HUD Overlay

## Agent: Phase1_Foundation_Agent

## Objective
Set up a functional Three.js scene with React Three Fiber and create a HUD overlay for displaying dialogue using Ink.js. Establish core rendering pipeline and UI interaction foundation.

## Prerequisites
- Base Vite React project initialized
- Git repository created

## Dependencies to Install
```bash
npm install three @react-three/fiber @react-three/drei
npm install inkjs
npm install zustand
npm install -D @types/three
```

## File Structure to Create
```
src/
├── components/
│   ├── Scene/
│   │   ├── GameScene.tsx          # Main 3D scene wrapper
│   │   ├── TestCube.tsx           # Placeholder 3D object
│   │   └── Lighting.tsx           # Scene lighting setup
│   ├── HUD/
│   │   ├── DialogueBox.tsx        # Dialogue display component
│   │   ├── DialogueChoices.tsx    # Choice buttons interface
│   │   └── HUD.tsx                # Main HUD container
│   └── App.tsx                     # Root application component
├── systems/
│   └── dialogue/
│       ├── InkManager.ts          # Ink.js story initialization
│       └── types.ts               # Dialogue system types
├── stores/
│   └── gameStore.ts               # Zustand global game state
├── assets/
│   └── dialogue/
│       └── test_story.ink         # Sample Ink dialogue file
└── styles/
    └── HUD.css                     # HUD styling
```

## Implementation Steps

### Step 1: Configure TypeScript and Dependencies

**Update `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "three"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 2: Create Zustand Game Store

**`src/stores/gameStore.ts`:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DialogueState {
  currentText: string;
  currentSpeaker: string;
  choices: string[];
  isDialogueActive: boolean;
}

interface GameState {
  dialogue: DialogueState;
  setDialogue: (text: string, speaker?: string) => void;
  setChoices: (choices: string[]) => void;
  clearDialogue: () => void;
  selectChoice: (index: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      dialogue: {
        currentText: 'Whatup Welcome! Press any key to start.',
        currentSpeaker: 'System',
        choices: [],
        isDialogueActive: true,
      },
      setDialogue: (text: string, speaker = 'Unknown') =>
        set((state) => ({
          dialogue: {
            ...state.dialogue,
            currentText: text,
            currentSpeaker: speaker,
            isDialogueActive: true,
          },
        })),
      setChoices: (choices: string[]) =>
        set((state) => ({
          dialogue: { ...state.dialogue, choices },
        })),
      clearDialogue: () =>
        set((state) => ({
          dialogue: { ...state.dialogue, isDialogueActive: false, choices: [] },
        })),
      selectChoice: (index: number) => {
        console.log('Choice selected:', index);
        // Will be connected to Ink.js in later steps
      },
    }),
    {
      name: 'whatup-game-storage',
    }
  )
);
```

### Step 3: Create Ink.js System

**`src/systems/dialogue/types.ts`:**
```typescript
export interface InkChoice {
  text: string;
  index: number;
}

export interface InkStoryState {
  text: string;
  choices: InkChoice[];
  canContinue: boolean;
}
```

**`src/systems/dialogue/InkManager.ts`:**
```typescript
import { Story } from 'inkjs';
import type { InkStoryState, InkChoice } from './types';

export class InkManager {
  private story: Story | null = null;

  async loadStory(jsonContent: any): Promise<void> {
    this.story = new Story(jsonContent);
  }

  continue(): InkStoryState | null {
    if (!this.story) return null;

    let text = '';
    while (this.story.canContinue) {
      text += this.story.Continue();
    }

    const choices: InkChoice[] = this.story.currentChoices.map((choice, index) => ({
      text: choice.text,
      index,
    }));

    return {
      text: text.trim(),
      choices,
      canContinue: this.story.canContinue,
    };
  }

  chooseChoice(index: number): void {
    if (this.story) {
      this.story.ChooseChoiceIndex(index);
    }
  }

  reset(): void {
    if (this.story) {
      this.story.ResetState();
    }
  }
}

export const inkManager = new InkManager();
```

### Step 4: Create Sample Ink Dialogue

**`src/assets/dialogue/test_story.ink`:**
```ink
=== start ===
You find yourself in a neon-lit bar. The music is loud, and the crowd is restless.

A figure approaches you from the shadows.

Stranger: "New around here?"

* [Yeah, just arrived.]
  -> friendly_response
* [That's none of your business.]
  -> hostile_response
* [Who's asking?]
  -> neutral_response

=== friendly_response ===
Stranger: "Welcome! Name's Alex. Let me show you around."

You've made a new friend. Alex gestures toward the bar.

Alex: "First drink's on me. What'll it be?"

* [Beer]
  -> beer_choice
* [Cocktail]
  -> cocktail_choice
* [Just water, thanks.]
  -> water_choice

=== hostile_response ===
The stranger backs away, hands raised.

Stranger: "Alright, alright. No need to be hostile. Just trying to be friendly."

They disappear back into the crowd. You're alone again.

-> END

=== neutral_response ===
Stranger: "Smart. I respect that. Name's Alex."

Alex extends a hand. You shake it cautiously.

Alex: "You look like someone who needs information. Lucky for you, I've got plenty."

* [What kind of information?]
  -> information_path
* [I'm good, thanks.]
  -> decline_path

=== beer_choice ===
Alex orders you a cold beer. You take a sip and survey the room.

-> END

=== cocktail_choice ===
Alex orders an elaborate cocktail. The bartender lights it on fire before handing it over.

-> END

=== water_choice ===
Alex raises an eyebrow but orders you water anyway.

Alex: "Staying sharp, huh? Smart move."

-> END

=== information_path ===
Alex leans in close.

Alex: "This place isn't what it seems. Stick with me, and I'll show you the truth."

-> END

=== decline_path ===
Alex shrugs and walks away. You're back on your own.

-> END
```

**Note for Agent:** After creating this file, compile it to JSON using:
```bash
npx inklecate src/assets/dialogue/test_story.ink -o src/assets/dialogue/test_story.json
```

You'll need to install inklecate first:
```bash
npm install -g inklecate
```

### Step 5: Create Three.js Scene Components

**`src/components/Scene/Lighting.tsx`:**
```typescript
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
    </>
  );
}
```

**`src/components/Scene/TestCube.tsx`:**
```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TestCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff6b35" />
    </mesh>
  );
}
```

**`src/components/Scene/GameScene.tsx`:**
```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Lighting from './Lighting';
import TestCube from './TestCube';

export default function GameScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#1a1a2e']} />
      <Lighting />
      <TestCube />
      <OrbitControls enablePan={false} maxDistance={20} minDistance={3} />
      <Stats />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}
```

### Step 6: Create HUD Components

**`src/styles/HUD.css`:**
```css
.hud-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 100;
  font-family: 'Courier New', monospace;
}

.dialogue-box {
  background: rgba(10, 10, 20, 0.9);
  border: 2px solid #ff6b35;
  border-radius: 12px;
  padding: 24px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialogue-speaker {
  color: #ff6b35;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
  font-weight: bold;
}

.dialogue-text {
  color: #e0e0e0;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.dialogue-choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.choice-button {
  background: rgba(255, 107, 53, 0.1);
  border: 2px solid #ff6b35;
  border-radius: 8px;
  padding: 12px 20px;
  color: #ff6b35;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
  pointer-events: auto;
}

.choice-button:hover {
  background: rgba(255, 107, 53, 0.3);
  border-color: #ffaa00;
  color: #ffaa00;
  transform: translateX(5px);
}

.choice-button:active {
  transform: scale(0.98);
}

.choice-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #ff6b35;
  color: #1a1a2e;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: 10px;
  font-weight: bold;
  font-size: 14px;
}
```

**`src/components/HUD/DialogueChoices.tsx`:**
```typescript
import '../../styles/HUD.css';

interface DialogueChoicesProps {
  choices: string[];
  onSelect: (index: number) => void;
}

export default function DialogueChoices({ choices, onSelect }: DialogueChoicesProps) {
  if (choices.length === 0) return null;

  return (
    <div className="dialogue-choices">
      {choices.map((choice, index) => (
        <button
          key={index}
          className="choice-button"
          onClick={() => onSelect(index)}
        >
          <span className="choice-number">{index + 1}</span>
          {choice}
        </button>
      ))}
    </div>
  );
}
```

**`src/components/HUD/DialogueBox.tsx`:**
```typescript
import { useEffect, useState } from 'react';
import '../../styles/HUD.css';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  typewriterSpeed?: number;
}

export default function DialogueBox({ 
  speaker, 
  text, 
  typewriterSpeed = 30 
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typewriterSpeed);

    return () => clearInterval(interval);
  }, [text, typewriterSpeed]);

  return (
    <div className="dialogue-box">
      <div className="dialogue-speaker">{speaker}</div>
      <div className="dialogue-text">
        {displayedText}
        {isTyping && <span className="cursor">▊</span>}
      </div>
    </div>
  );
}
```

**`src/components/HUD/HUD.tsx`:**
```typescript
import { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { inkManager } from '../../systems/dialogue/InkManager';
import DialogueBox from './DialogueBox';
import DialogueChoices from './DialogueChoices';
import testStoryJson from '../../assets/dialogue/test_story.json';

export default function HUD() {
  const { dialogue, setDialogue, setChoices, selectChoice } = useGameStore();

  useEffect(() => {
    // Initialize Ink story
    inkManager.loadStory(testStoryJson).then(() => {
      const state = inkManager.continue();
      if (state) {
        setDialogue(state.text, 'Narrator');
        setChoices(state.choices.map(c => c.text));
      }
    });
  }, []);

  const handleChoiceSelect = (index: number) => {
    inkManager.chooseChoice(index);
    const state = inkManager.continue();
    
    if (state) {
      setDialogue(state.text, state.choices.length > 0 ? 'Narrator' : 'End');
      setChoices(state.choices.map(c => c.text));
    }
  };

  if (!dialogue.isDialogueActive) return null;

  return (
    <div className="hud-container">
      <DialogueBox 
        speaker={dialogue.currentSpeaker} 
        text={dialogue.currentText}
        typewriterSpeed={25}
      />
      <DialogueChoices 
        choices={dialogue.choices} 
        onSelect={handleChoiceSelect}
      />
    </div>
  );
}
```

### Step 7: Create Root App Component

**`src/App.tsx`:**
```typescript
import GameScene from './components/Scene/GameScene';
import HUD from './components/HUD/HUD';
import './styles/HUD.css';

export default function App() {
  return (
    <>
      <GameScene />
      <HUD />
    </>
  );
}
```

**`src/main.tsx`:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 8: Update Package Scripts

**Update `package.json` scripts section:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "compile-ink": "inklecate src/assets/dialogue/test_story.ink -o src/assets/dialogue/test_story.json"
  }
}
```

## Validation Checklist

Before marking phase complete, verify:

- [ ] `npm run dev` starts without errors
- [ ] Browser shows spinning orange cube on dark background
- [ ] HUD displays at bottom of screen with dialogue
- [ ] Dialogue text appears with typewriter effect
- [ ] Clicking dialogue choices advances the story
- [ ] OrbitControls allow camera rotation around scene
- [ ] No console errors or warnings
- [ ] Stats panel shows 60fps
- [ ] Build completes successfully: `npm run build`
- [ ] All TypeScript files have no `any` types
- [ ] Git commit with message: `feat(phase1): implement Three.js scene with HUD overlay`

## Acceptance Criteria

✅ **Functional Requirements:**
1. Three.js scene renders with proper lighting
2. Test cube rotates smoothly
3. HUD overlay displays without blocking 3D scene interaction
4. Dialogue system integrates Ink.js successfully
5. Choice selection advances story properly
6. Typewriter effect displays text character-by-character
7. Camera controls work (zoom, rotate)

✅ **Technical Requirements:**
1. TypeScript strict mode enabled with no errors
2. All imports properly typed
3. Zustand store persists to localStorage
4. React Three Fiber canvas renders at 60fps
5. No memory leaks in render loop
6. Proper component separation (Scene, HUD, Systems)

✅ **Code Quality:**
1. Components under 200 lines each
2. Meaningful variable names
3. No magic numbers (use constants)
4. CSS follows BEM-like naming
5. Proper error handling in async code

## Common Issues & Solutions

**Issue:** Ink story fails to load
- **Solution:** Ensure `test_story.json` exists and is valid JSON. Run compile-ink script.

**Issue:** Three.js canvas doesn't fill viewport
- **Solution:** Verify Canvas component has `style={{ width: '100vw', height: '100vh' }}`

**Issue:** Dialogue choices don't respond
- **Solution:** Check that `.choice-button` has `pointer-events: auto` in CSS

**Issue:** TypeScript errors with Three.js types
- **Solution:** Install `@types/three` and ensure it's in tsconfig types array

**Issue:** Stats panel doesn't appear
- **Solution:** Import from `@react-three/drei` not Three.js directly

## Handoff to Next Phase

Once validated, create handoff document:
```markdown
## Phase 1 Complete

**Delivered:**
- Functional Three.js scene with React Three Fiber
- HUD system with Ink.js dialogue integration
- Zustand state management
- Typewriter text effect
- Sample branching dialogue story

**Assets Ready for Phase 2:**
- Scene lighting configured
- Camera setup complete
- GridHelper for spatial reference

**Integration Points:**
- GameStore available for NPC/player state
- InkManager ready for expanded dialogue
- Scene accepts new mesh children

**Next Agent Notes:**
- Replace TestCube with character model
- Add environment mesh under TestCube location
- Maintain 60fps performance target
```

Commit all changes with:
```bash
git add .
git commit -m "feat(phase1): complete Three.js scene with HUD overlay and Ink.js dialogue system"
git tag phase1-complete
```

## Estimated Time
**4-6 hours** for experienced developer familiar with Three.js and React.
