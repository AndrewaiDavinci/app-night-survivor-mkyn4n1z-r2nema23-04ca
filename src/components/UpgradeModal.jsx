import React, { useMemo } from 'react';
import { UPGRADES } from '../lib/gameUtils';
import { cn } from '../lib/utils';

export default function UpgradeModal({ onSelect }) {
  const options = useMemo(() => {
    return [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-4xl w-full px-6">
        <h2 className="text-3xl font-black text-white text-center mb-8 tracking-tighter italic">
          레벨 업! 능력을 선택하세요
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group relative p-6 bg-slate-900 border-2 border-slate-800 rounded-2xl text-left transition-all",
                "hover:border-amber-400 hover:scale-105 hover:bg-slate-800 active:scale-95"
              )}
            >
              <div className="text-4xl mb-4 group-hover:animate-bounce">{option.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{option.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{option.desc}</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-amber-400 font-bold text-xs">선택하기 →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}