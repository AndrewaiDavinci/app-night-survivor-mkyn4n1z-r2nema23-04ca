import React from 'react';

export default function HUD({ stats }) {
  const { hp, maxHp, exp, nextExp, level, kills, time } = stats;
  const hpPercent = Math.max(0, (hp / maxHp) * 100);
  const expPercent = (exp / nextExp) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="w-64 space-y-2">
          {/* XP Bar */}
          <div className="h-4 bg-slate-800/50 rounded-full border border-slate-700 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-amber-400 transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-amber-400 text-xs font-bold px-1">
            <span>LV. {level}</span>
            <span>{Math.floor(exp)} / {nextExp}</span>
          </div>

          {/* HP Bar */}
          <div className="h-6 bg-slate-800/50 rounded-md border border-slate-700 overflow-hidden backdrop-blur-sm mt-4">
            <div 
              className="h-full bg-red-500 transition-all duration-200"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="text-white text-[10px] font-bold text-center -mt-5 drop-shadow-md">
            HP {Math.ceil(hp)} / {maxHp}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 backdrop-blur-sm">
            <span className="text-white font-mono text-xl">{formatTime(time)}</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            처치: <span className="text-red-400">{kills}</span>
          </div>
        </div>
      </div>
    </div>
  );
}