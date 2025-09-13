import React, { useState, useEffect } from "react";

const flashcards = [
  {
    question: "Normal pH of blood?",
    options: ["6.8 - 7.0", "7.35 - 7.45", "7.8 - 8.0", "6.5 - 6.9"],
    answer: "7.35 - 7.45",
  },
  {
    question: "Functional unit of kidney?",
    options: ["Neuron", "Nephron", "Alveoli", "Hepatocyte"],
    answer: "Nephron",
  },
  {
    question: "Which vitamin is fat soluble?",
    options: ["Vitamin B", "Vitamin C", "Vitamin D", "Vitamin H"],
    answer: "Vitamin D",
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    setTimer(0);
    setSelected(null);
    setShowNext(false);

    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [current]);

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);

    if (option === flashcards[current].answer) {
      setScore(score + (timer <= 30 ? 4 : 2));
    } else {
      setMistakes(mistakes + 1);
      if (mistakes + 1 >= 3) {
        alert(`❌ Game Over! Final Score: ${score}`);
        resetGame();
        return;
      }
    }

    setShowNext(true);
  };

  const nextQuestion = () => {
    if (current + 1 < flashcards.length) {
      setCurrent(current + 1);
    } else {
      alert(`🎉 Game Finished! Final Score: ${score}`);
      resetGame();
    }
  };

  const resetGame = () => {
    setCurrent(0);
    setScore(0);
    setMistakes(0);
    setTimer(0);
    setSelected(null);
    setShowNext(false);
  };

  const getButtonClass = (option) => {
    if (!selected) {
      return "bg-blue-500 hover:bg-blue-600 text-white";
    }

    if (option === flashcards[current].answer) {
      return "bg-green-500 text-white";
    }

    if (option === selected) {
      return "bg-red-500 text-white";
    }

    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
          🧠 NEET Flashcards
        </h1>

        {/* Question */}
        <p className="text-lg font-semibold mb-6">
          {flashcards[current].question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {flashcards[current].options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition shadow-md ${getButtonClass(
                option
              )}`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next button */}
        {showNext && (
          <button
            onClick={nextQuestion}
            className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition shadow-md"
          >
            Next ➡️
          </button>
        )}

        {/* Scoreboard */}
        <div className="flex justify-between mt-6 text-sm font-medium text-gray-700 bg-gray-100 p-3 rounded-lg shadow-inner">
          <span>⭐ Score: {score}</span>
          <span>❌ Mistakes: {mistakes}/3</span>
          <span>⏱ Time: {timer}s</span>
        </div>

        {/* Rules */}
        <div className="mt-6 text-left text-sm text-gray-600 border-t pt-4">
          <p className="font-semibold mb-2 flex items-center gap-1">📜 Rules:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>+4 points if answered within 30s</li>
            <li>+2 points if answered after 30s</li>
            <li>Game ends after 3 mistakes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
