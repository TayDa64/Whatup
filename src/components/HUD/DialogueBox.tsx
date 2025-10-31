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
  typewriterSpeed = 30,
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
        currentIndex += 1;
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
