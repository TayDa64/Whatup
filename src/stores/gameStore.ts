import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

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

const gameStoreCreator: StateCreator<GameState> = (
  set: (
    partial:
      | GameState
      | Partial<GameState>
      | ((state: GameState) => GameState | Partial<GameState>),
    replace?: boolean
  ) => void
) => ({
      dialogue: {
        currentText: 'Whatup Welcome! Press any key to start.',
        currentSpeaker: 'System',
        choices: [],
        isDialogueActive: true,
      },
      setDialogue: (text: string, speaker = 'Unknown') =>
  set((state: GameState) => ({
          dialogue: {
            ...state.dialogue,
            currentText: text,
            currentSpeaker: speaker,
            isDialogueActive: true,
          },
        })),
      setChoices: (choices: string[]) =>
  set((state: GameState) => ({
          dialogue: { ...state.dialogue, choices },
        })),
      clearDialogue: () =>
  set((state: GameState) => ({
          dialogue: { ...state.dialogue, isDialogueActive: false, choices: [] },
        })),
      selectChoice: (index: number) => {
        console.log('Choice selected:', index);
      },
});

export const useGameStore = create<GameState>()(
  persist(gameStoreCreator, {
    name: 'whatup-game-storage',
  })
);
