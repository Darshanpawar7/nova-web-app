import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const Story = () => {
  const { progress, updateProgress } = useGame();
  const [currentChapter, setCurrentChapter] = useState(1);

  const chapters = {
    1: {
      title: "The Call to Adventure",
      content: "You are a young hero in Aetheria. The Gloom has started spreading, and your friend Arjun seems different lately. He's been hanging out with Nikotyna's followers...",
      image: "🦸",
      choices: [
        { text: "Talk to Arjun and express concern", nextChapter: 2, xp: 50 },
        { text: "Ignore it and focus on your studies", nextChapter: 3, xp: 20 },
        { text: "Join them to see what it's about", nextChapter: 4, xp: -30 }
      ]
    },
    2: {
      title: "A Friend in Need",
      content: "Arjun confesses he's been feeling pressured to try vaping to fit in with the 'cool' group. He looks up to you for guidance...",
      image: "💬",
      choices: [
        { text: "Share facts about nicotine addiction", nextChapter: 5, xp: 80 },
        { text: "Suggest alternative activities", nextChapter: 6, xp: 70 },
        { text: "Tell a teacher about the situation", nextChapter: 7, xp: 60 }
      ]
    }
  };

  const handleChoice = async (choice) => {
    await updateProgress({
      chapter: currentChapter,
      achievement: `Completed Chapter ${currentChapter}`
    });
    setCurrentChapter(choice.nextChapter);
  };

  const currentStory = chapters[currentChapter];

  if (!currentStory) {
    return (
      <div className="story-container">
        <div className="story-card">
          <h2>Chapter Complete! 🎉</h2>
          <p>More chapters coming soon! Your journey continues...</p>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentChapter(1)}
          >
            Restart Story
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="story-container">
      <div className="story-card">
        <h2>{currentStory.title}</h2>
        
        <div className="story-image">
          {currentStory.image}
        </div>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          {currentStory.content}
        </p>

        <div className="choices">
          {currentStory.choices.map((choice, index) => (
            <button
              key={index}
              className="choice-btn"
              onClick={() => handleChoice(choice)}
            >
              {choice.text}
              {choice.xp > 0 && (
                <span style={{ float: 'right', color: 'var(--secondary)' }}>
                  +{choice.xp} XP
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;