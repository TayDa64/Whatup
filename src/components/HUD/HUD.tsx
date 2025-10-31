import { useEffect } from 'react';
import DialogueBox from './DialogueBox';
import DialogueChoices from './DialogueChoices';
import { useGameStore } from '../../stores/gameStore';
import { inkManager } from '../../systems/dialogue/InkManager';
import type { InkStoryState } from '../../systems/dialogue/types';
import '../../styles/HUD.css';
import testStoryJson from '../../assets/dialogue/test_story.json';

export default function HUD() {
  const { dialogue, setDialogue, setChoices } = useGameStore();

  useEffect(() => {
    let mounted = true;

    const initialiseStory = async () => {
      try {
        await inkManager.loadStory(testStoryJson);
        const state = inkManager.continue();
        if (state && mounted) {
          hydrateDialogue(state);
        }
      } catch (error) {
        console.error('Failed to initialise Ink story', error);
      }
    };

    initialiseStory();

    return () => {
      mounted = false;
    };
  }, []);

  const hydrateDialogue = (state: InkStoryState) => {
    setDialogue(state.text, 'Narrator');
    setChoices(state.choices.map((choice) => choice.text));
  };

  const handleChoiceSelect = (index: number) => {
    inkManager.chooseChoice(index);
    const state = inkManager.continue();
    if (state) {
      hydrateDialogue(state);
    }
  };

  if (!dialogue.isDialogueActive) {
    return null;
  }

  return (
    <div className="hud-container">
      <DialogueBox
        speaker={dialogue.currentSpeaker}
        text={dialogue.currentText}
        typewriterSpeed={25}
      />
      <DialogueChoices choices={dialogue.choices} onSelect={handleChoiceSelect} />
    </div>
  );
}
