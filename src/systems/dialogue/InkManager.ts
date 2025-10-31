import { Story } from 'inkjs';
import type { InkStoryState, InkChoice } from './types';

export class InkManager {
  private story: Story | null = null;

  async loadStory(jsonContent: unknown): Promise<void> {
    this.story = new Story(jsonContent as Record<string, unknown>);
  }

  continue(): InkStoryState | null {
    if (!this.story) {
      return null;
    }

    let text = '';
    while (this.story.canContinue) {
      text += this.story.Continue();
    }

    const choices: InkChoice[] = this.story.currentChoices.map((choice: any, index: number) => ({
      text: choice.text,
      index,
    }));    return {
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
