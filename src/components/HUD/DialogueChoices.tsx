import '../../styles/HUD.css';

interface DialogueChoicesProps {
  choices: string[];
  onSelect: (index: number) => void;
}

export default function DialogueChoices({ choices, onSelect }: DialogueChoicesProps) {
  if (choices.length === 0) {
    return null;
  }

  return (
    <div className="dialogue-choices">
      {choices.map((choice, index) => (
        <button
          key={index}
          className="choice-button"
          onClick={() => onSelect(index)}
          type="button"
        >
          <span className="choice-number">{index + 1}</span>
          {choice}
        </button>
      ))}
    </div>
  );
}
