import React, { useState } from 'react';
import { Habit } from '../types';
import { Plus, X, Trash2, Zap, ArrowRight, Check } from 'lucide-react';
import { getBehavioralInsight } from '../services/ai';

interface HabitLabProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export const HabitLab: React.FC<HabitLabProps> = ({ habits, setHabits }) => {
  const [activeTab, setActiveTab] = useState<'HABITS' | 'ORDER' | 'RULES'>('HABITS');
  const [newHabit, setNewHabit] = useState('');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Order Room State
  const [orderTask, setOrderTask] = useState<string | null>(null);
  const [chaosArea, setChaosArea] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const addHabit = () => {
    if (habits.length >= 3) return; // Limit to 3 for focus
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit,
      streak: 0,
      completedDates: [],
      intensity: 'MED'
    };
    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(today);
        const newDates = isCompleted 
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today];
        
        // Simple streak logic
        const newStreak = isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;
        
        return { ...h, completedDates: newDates, streak: newStreak };
      }
      return h;
    }));
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getHabitAdvice = async (habitTitle: string) => {
    setLoadingAi(true);
    setAiTip(null);
    const tip = await getBehavioralInsight(habitTitle, 'HABIT');
    setAiTip(tip);
    setLoadingAi(false);
  };

  const generateOrderTask = async () => {
    if (!chaosArea) return;
    setLoadingAi(true);
    const task = await getBehavioralInsight(chaosArea, 'ORDER');
    setOrderTask(task);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Sub-nav */}
      <div className="flex space-x-6 border-b border-zinc-800 pb-2">
        {['HABITS', 'ORDER', 'RULES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`text-sm font-bold tracking-widest pb-2 transition-colors ${
              activeTab === tab ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'HABITS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-light text-zinc-400">Behavioral Engine</h2>
            <span className="text-xs text-zinc-600 uppercase tracking-widest">{habits.length}/3 Slots Active</span>
          </div>

          <div className="space-y-4">
            {habits.map(habit => {
              const completedToday = habit.completedDates.includes(today);
              return (
                <div key={habit.id} className="bg-zinc-900/50 p-6 border border-zinc-800 hover:border-zinc-700 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl text-zinc-200 font-medium">{habit.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Streak: {habit.streak} Days</p>
                    </div>
                    <button onClick={() => removeHabit(habit.id)} className="text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => toggleHabit(habit.id)}
                      className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors ${
                        completedToday ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50' : 'bg-zinc-900 border border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {completedToday ? <Check size={18} /> : <div className="w-4 h-4 rounded-full border border-zinc-500" />}
                      <span className="uppercase text-xs font-bold tracking-wider">{completedToday ? "Complete" : "Execute"}</span>
                    </button>
                    <button 
                       onClick={() => getHabitAdvice(habit.title)}
                       className="p-3 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                       title="Get AI Optimization Tip"
                    >
                      <Zap size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {habits.length < 3 && (
               <div className="flex items-center space-x-3 mt-6 border-b border-zinc-800 pb-2">
                 <input 
                   value={newHabit}
                   onChange={(e) => setNewHabit(e.target.value)}
                   placeholder="New micro-habit..."
                   className="bg-transparent flex-1 focus:outline-none text-zinc-300 placeholder-zinc-700"
                   onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                 />
                 <button onClick={addHabit} className="text-emerald-500 hover:text-emerald-400">
                   <Plus size={20} />
                 </button>
               </div>
            )}
          </div>
          
          {loadingAi && <div className="text-xs text-emerald-500 animate-pulse">Consulting Behavioral Database...</div>}
          {aiTip && (
            <div className="bg-zinc-900 border border-emerald-900/30 p-4 text-sm text-zinc-400 italic">
              " {aiTip} "
            </div>
          )}
        </div>
      )}

      {activeTab === 'ORDER' && (
        <div className="space-y-8">
           <div className="space-y-2">
             <h2 className="text-2xl font-light text-zinc-400">The Order Room</h2>
             <p className="text-zinc-600 text-sm">Chaos in environment = Chaos in mind.</p>
           </div>

           {!orderTask ? (
             <div className="bg-zinc-900 p-6 border border-zinc-800 space-y-4">
               <label className="text-xs uppercase tracking-widest text-zinc-500">Target Chaos Area</label>
               <input 
                 value={chaosArea}
                 onChange={(e) => setChaosArea(e.target.value)}
                 placeholder="e.g., Desktop, Bedroom, Finances"
                 className="w-full bg-zinc-950 p-3 text-zinc-200 focus:outline-none border border-zinc-800 focus:border-emerald-500 transition-colors"
               />
               <button 
                 onClick={generateOrderTask}
                 disabled={loadingAi}
                 className="w-full py-3 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center space-x-2"
               >
                 <span>{loadingAi ? "Analyzing..." : "Generate 10-Min Task"}</span>
                 {!loadingAi && <ArrowRight size={16} />}
               </button>
             </div>
           ) : (
             <div className="bg-emerald-950/20 border border-emerald-500/30 p-8 text-center space-y-6 animate-in zoom-in-95">
               <h3 className="text-emerald-500 text-xs uppercase tracking-[0.3em]">Directive</h3>
               <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">{orderTask}</p>
               <button 
                 onClick={() => { setOrderTask(null); setChaosArea(''); }}
                 className="text-zinc-500 hover:text-white text-sm underline underline-offset-4"
               >
                 Mission Complete
               </button>
             </div>
           )}
        </div>
      )}

      {activeTab === 'RULES' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-zinc-400">Personal Code</h2>
          <div className="space-y-4">
             {/* Hardcoded examples for the blueprint feel */}
             <div className="p-4 border-l-2 border-emerald-500 bg-zinc-900/30">
               <p className="text-sm font-bold text-zinc-300">RULE 01: MONEY</p>
               <p className="text-zinc-500 mt-1">Never buy a liability on credit.</p>
             </div>
             <div className="p-4 border-l-2 border-zinc-700 bg-zinc-900/30">
               <p className="text-sm font-bold text-zinc-300">RULE 02: HEALTH</p>
               <p className="text-zinc-500 mt-1">No calories after 8:00 PM.</p>
             </div>
             <div className="p-4 border-l-2 border-zinc-700 bg-zinc-900/30 opacity-50">
               <p className="text-sm font-bold text-zinc-300">ADD NEW RULE +</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};