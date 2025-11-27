import React, { useState, useEffect } from 'react';
import { DayLog } from '../types';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

interface CommandCenterProps {
  dayLog: DayLog;
  updateDayLog: (log: DayLog) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ dayLog, updateDayLog }) => {
  const [isEditing, setIsEditing] = useState(!dayLog.topGoal);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full justify-center space-y-12 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          AXIS<span className="text-emerald-500">.</span>
        </h1>
        <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">Daily Command Protocol</p>
      </header>

      <div className="space-y-8">
        {/* ONE BIG GOAL */}
        <div className="group relative">
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2 block">
            01 // Prime Directive (Top Goal)
          </label>
          {isEditing ? (
            <input 
              type="text" 
              value={dayLog.topGoal}
              onChange={(e) => updateDayLog({ ...dayLog, topGoal: e.target.value })}
              className="w-full bg-transparent border-b border-zinc-800 text-2xl py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-800 text-white"
              placeholder="Define one absolute goal..."
              autoFocus
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="text-3xl font-light text-white cursor-pointer hover:text-emerald-400 transition-colors">
              {dayLog.topGoal || "Not Set"}
            </div>
          )}
        </div>

        {/* ESSENTIAL TASK */}
        <div className="group relative">
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2 block">
            02 // Critical Action
          </label>
          {isEditing ? (
            <input 
              type="text" 
              value={dayLog.essentialTask}
              onChange={(e) => updateDayLog({ ...dayLog, essentialTask: e.target.value })}
              className="w-full bg-transparent border-b border-zinc-800 text-xl py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-800 text-zinc-300"
              placeholder="One non-negotiable task..."
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="text-xl text-zinc-300 cursor-pointer hover:text-emerald-400 transition-colors">
              {dayLog.essentialTask || "Not Set"}
            </div>
          )}
        </div>

        {/* DAILY RULE */}
        <div className="group relative">
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2 block">
            03 // Discipline Rule
          </label>
          {isEditing ? (
            <input 
              type="text" 
              value={dayLog.dailyRule}
              onChange={(e) => updateDayLog({ ...dayLog, dailyRule: e.target.value })}
              className="w-full bg-transparent border-b border-zinc-800 text-xl py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-zinc-800 text-zinc-300"
              placeholder="e.g. No social media until 6PM"
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="flex items-center space-x-3 text-xl text-zinc-400 cursor-pointer hover:text-emerald-400 transition-colors">
              <AlertTriangle size={16} className="text-emerald-600" />
              <span>{dayLog.dailyRule || "Not Set"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-12">
        {isEditing ? (
           <button 
             onClick={handleSave}
             className="w-full py-4 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
           >
             Lock Protocol
           </button>
        ) : (
          <button 
            onClick={() => updateDayLog({ ...dayLog, completed: !dayLog.completed })}
            className={`w-full py-6 border transition-all flex items-center justify-center space-x-3 group ${
              dayLog.completed 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' 
                : 'border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300'
            }`}
          >
             {dayLog.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
             <span className="font-mono uppercase tracking-widest text-lg">
               {dayLog.completed ? "Protocol Executed" : "Mark as Executed"}
             </span>
          </button>
        )}
      </div>
    </div>
  );
};