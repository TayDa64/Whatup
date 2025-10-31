export interface InkChoice {
  text: string;
  index: number;
}

export interface InkStoryState {
  text: string;
  choices: InkChoice[];
  canContinue: boolean;
}
