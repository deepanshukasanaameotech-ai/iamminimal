import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';

export const DeepWork: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes default
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionCount(s => s + 1);
      // Play sound here ideally
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(45 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em]">Deep Work Protocol</h2>
        <p className="text-zinc-600 text-sm">Eliminate all distractions. Single task focus.</p>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className="text-8xl md:text-9xl font-bold font-mono text-white relative z-10 tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center space-x-8">
        {!isActive ? (
          <button 
            onClick={toggleTimer}
            className="group flex flex-col items-center space-y-2 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="p-4 rounded-full border border-zinc-800 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all">
               <Play fill="currentColor" size={32} />
            </div>
            <span className="text-xs uppercase tracking-widest">Engage</span>
          </button>
        ) : (
          <button 
            onClick={toggleTimer}
            className="group flex flex-col items-center space-y-2 text-zinc-400 hover:text-white transition-colors"
          >
             <div className="p-4 rounded-full border border-zinc-800 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all">
               <Pause fill="currentColor" size={32} />
             </div>
             <span className="text-xs uppercase tracking-widest">Pause</span>
          </button>
        )}

        <button 
          onClick={resetTimer}
          className="group flex flex-col items-center space-y-2 text-zinc-600 hover:text-red-400 transition-colors"
        >
           <div className="p-4 rounded-full border border-zinc-800/50 group-hover:border-red-900 transition-all">
             <Square fill="currentColor" size={24} />
           </div>
           <span className="text-xs uppercase tracking-widest">Terminate</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 text-zinc-700 bg-zinc-900/50 px-4 py-2 rounded-full">
        <Timer size={14} />
        <span className="text-xs font-mono uppercase">Sessions Completed: <span className="text-white">{sessionCount}</span></span>
      </div>
    </div>
  );
};