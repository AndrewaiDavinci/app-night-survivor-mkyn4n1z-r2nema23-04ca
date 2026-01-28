import React, { useState } from 'react';
import SurvivorGame from './components/SurvivorGame';

export default function App() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [finalScore, setFinalScore] = useState(0);

  const startGame = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = (score) => {
    setFinalScore(score);
    setGameState('GAMEOVER');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center font-sans">
      {gameState === 'START' && (
        <div className="text-center space-y-8 animate-in zoom-in duration-500">
          <div className="space-y-2">
            <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-red-500">
              NIGHT SURVIVOR
            </h1>
            <p className="text-slate-400 font-medium text-lg">어둠 속에서 끝까지 살아남으세요</p>
          </div>
          
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xl rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          >
            서바이벌 시작
          </button>

          <div className="grid grid-cols-3 gap-8 text-slate-500 text-sm mt-12">
            <div>
              <p className="font-bold text-slate-300 mb-1">이동</p>
              <p>WASD / 방향키</p>
            </div>
            <div>
              <p className="font-bold text-slate-300 mb-1">공격</p>
              <p>자동 조준</p>
            </div>
            <div>
              <p className="font-bold text-slate-300 mb-1">목표</p>
              <p>경험치 획득 및 생존</p>
            </div>
          </div>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <SurvivorGame onGameOver={handleGameOver} />
      )}

      {gameState === 'GAMEOVER' && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-6xl font-black text-red-500 italic">전사하였습니다</h2>
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <p className="text-slate-400 mb-1">최종 처치 수</p>
            <p className="text-5xl font-black text-white">{finalScore}</p>
          </div>
          <button 
            onClick={startGame}
            className="px-10 py-4 bg-white text-slate-950 font-bold text-lg rounded-full hover:bg-slate-200 transition-all"
          >
            다시 도전하기
          </button>
        </div>
      )}
    </div>
  );
}