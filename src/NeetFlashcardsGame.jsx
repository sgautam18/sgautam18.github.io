import React, { useEffect, useState, useRef } from 'react';

const SAMPLE = []; // loaded from public/questions.json by default

export default function NeetFlashcardsGame(){
  const [questions, setQuestions] = useState([]);
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [streak, setStreak] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(()=>Number(localStorage.getItem('neetscore')||0));
  const [lastAnswerTime, setLastAnswerTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef(null);

  useEffect(()=>{
    fetch('/questions.json').then(r=>r.json()).then(data=>{
      setQuestions(data);
      setDeck(shuffleArray([...data]));
      resetGameState();
    }).catch(err=>{
      // fallback to sample
      setQuestions(SAMPLE);
      setDeck(shuffleArray([...SAMPLE]));
      resetGameState();
    });
  },[]);

  function resetGameState(){
    setIndex(0); setSelected(null); setStreak(0); setWrongCount(0); setScore(0); setLastAnswerTime(Date.now()); setGameOver(false); setShowAnswer(false);
  }
  function shuffleArray(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr; }
  function normalize(s){ if(s==null) return ''; return String(s).trim().toLowerCase(); }
  function handleOptionChoose(option){
    if(gameOver||showAnswer) return;
    setSelected(option);
    const card = deck[index];
    const now = Date.now();
    const timeTaken = (now - lastAnswerTime)/1000;
    setLastAnswerTime(now);
    const correct = normalize(card.answer) === normalize(option);
    if(correct){
      const base = 100;
      const speedBonus = Math.max(0, Math.round((60 - Math.min(60, timeTaken)) * 2));
      const newStreak = streak + 1;
      const streakBonus = Math.floor(newStreak/3)*50;
      const gained = base + speedBonus + streakBonus;
      setScore(prev=>prev+gained);
      setStreak(newStreak);
      setShowAnswer(true);
      timerRef.current = setTimeout(()=>moveNext(),600);
    } else {
      setWrongCount(w=>w+1);
      setStreak(0);
      setShowAnswer(true);
      timerRef.current = setTimeout(()=>{
        if(wrongCount+1 >= 3){ setGameOver(true); } else { moveNext(); }
      },800);
    }
  }
  function moveNext(){ clearTimeout(timerRef.current); setSelected(null); setShowAnswer(false); if(index+1>=deck.length){ const newDeck = shuffleArray([...questions]); setDeck(newDeck); setIndex(0); } else { setIndex(i=>i+1); } }

  const current = deck[index] || null;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">NEET-PG Flashcards — Speed Game</h1>
        <div className="text-right text-sm">
          <div>Score: <strong>{score}</strong></div>
          <div>Streak: <strong>{streak}</strong></div>
          <div>Wrongs: <strong>{wrongCount} / 3</strong></div>
          <div>Best: <strong>{best}</strong></div>
        </div>
      </header>
      <section className="bg-white rounded p-6 shadow">
        {gameOver ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">Game Over</h2>
            <p className="mb-4">Final Score: <strong>{score}</strong></p>
            <button onClick={resetGameState} className="px-4 py-2 bg-green-600 text-white rounded">Play Again</button>
          </div>
        ) : current ? (
          <div>
            {current.image_url && (<div className="mb-4"><img src={current.image_url} alt={current.image_note||'image'} className="max-h-64 object-contain mx-auto" /></div>)}
            <div className="mb-6">
              <div className="text-sm text-gray-500">Card {index+1} / {Math.max(deck.length, questions.length)}</div>
              <div className="mt-2 text-lg font-medium">{current.question}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current.options.map((opt,i)=>{
                const isSelected = selected === opt;
                const isCorrect = normalize(current.answer) === normalize(opt);
                const reveal = showAnswer && (isSelected || isCorrect);
                return (
                  <button key={i} onClick={()=>handleOptionChoose(opt)} className={`p-4 text-left rounded-lg border ${reveal ? (isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-300') : 'bg-white'}`}>
                    <div className="font-medium">{opt}</div>
                    {reveal && (<div className="text-xs mt-1 text-gray-600">{isCorrect ? 'Correct' : (isSelected ? 'Your answer (Incorrect)' : '')}</div>)}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div>Loading questions...</div>
        )}
      </section>
    </div>
  );
}
