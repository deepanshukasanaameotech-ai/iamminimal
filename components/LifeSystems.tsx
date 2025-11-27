// src/components/LifeSystems.tsx
import React, { useState } from 'react';
import { AppState } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LifeSystemsProps {
  pillars: AppState['pillars'];
  updatePillars: (key: keyof AppState['pillars'], value: number) => void;
}

const PillarCard: React.FC<{ title: string; score: number; onClick: () => void }> = ({ title, score, onClick }) => (
  <div
    onClick={onClick}
    className="bg-zinc-900/30 border border-zinc-800 p-4 hover:border-zinc-600 transition-all cursor-pointer group"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick();
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
        {title}
      </span>
      <span className="text-sm font-mono text-zinc-300">{score}%</span>
    </div>
    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
    </div>
  </div>
);

export const LifeSystems: React.FC<LifeSystemsProps> = ({ pillars, updatePillars }) => {
  const [view, setView] = useState<'OVERVIEW' | 'MONEY' | 'HEALTH'>('OVERVIEW');

  // Ensure recharts receives numeric values (guard against undefined/null/strings)
  const data = (Object.entries(pillars) as Array<[keyof AppState['pillars'], number]>).map(([name, value]) => ({
    name: String(name),
    value: Number(value) || 0,
  }));

  const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'];

  const handleIncrease = (key: keyof AppState['pillars']) => {
    const current = Number(pillars[key]) || 0;
    const next = Math.min(100, current + 5);
    updatePillars(key, next);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex space-x-4 border-b border-zinc-800 pb-2 overflow-x-auto">
        {(['OVERVIEW', 'MONEY', 'HEALTH'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-sm font-bold tracking-widest pb-2 whitespace-nowrap ${
              view === v ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-600'
            }`}
            aria-pressed={view === v}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(pillars).map((key) => (
              <PillarCard
                key={key}
                title={String(key)}
                score={Number(pillars[key as keyof AppState['pillars']]) || 0}
                onClick={() => handleIncrease(key as keyof AppState['pillars'])}
              />
            ))}
          </div>

          <div className="h-64 w-full bg-zinc-900/20 border border-zinc-800/50 p-4 relative">
            {/* ResponsiveContainer requires a fixed height on the parent (here h-64) */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-zinc-700 text-xs uppercase tracking-widest font-bold">System Balance</span>
            </div>
          </div>
        </div>
      )}

      {view === 'MONEY' && (
        <div className="space-y-6">
          <div className="p-6 border border-zinc-800 bg-zinc-900/20 text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Financial Discipline</p>
            <h3 className="text-2xl font-light text-white">
              Daily Spending Limit: <span className="text-emerald-500">$50.00</span>
            </h3>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Wealth Protocol</h4>
            <label className="flex items-center space-x-3 p-3 bg-zinc-900 border border-zinc-800 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" aria-label="Review bank account daily" />
              <span className="text-zinc-300">Review bank account daily</span>
            </label>
            <label className="flex items-center space-x-3 p-3 bg-zinc-900 border border-zinc-800 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" aria-label="No impulse purchases over 100 dollars" />
              <span className="text-zinc-300">No impulse purchases &gt; $100</span>
            </label>
          </div>
        </div>
      )}

      {view === 'HEALTH' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 border border-zinc-800 bg-zinc-900/20 flex flex-col items-center">
              <span className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Sleep</span>
              <span className="text-2xl font-light text-white">
                7.5 <span className="text-sm text-zinc-600">HRS</span>
              </span>
            </div>
            <div className="p-6 border border-zinc-800 bg-zinc-900/20 flex flex-col items-center">
              <span className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Steps</span>
              <span className="text-2xl font-light text-white">8,432</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Non-Negotiables</h4>
            <div className="flex items-center space-x-3 p-3 bg-zinc-900 border border-zinc-800 opacity-50">
              <div className="w-5 h-5 border border-zinc-600 rounded-sm" />
              <span className="text-zinc-300 line-through">Morning Hydration</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-zinc-900 border border-zinc-800">
              <button
                className="w-5 h-5 border border-zinc-600 rounded-sm hover:bg-emerald-500 hover:border-emerald-500 transition-colors"
                aria-label="toggle 50 pushups"
              />
              <span className="text-zinc-300">50 Pushups</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeSystems;
 