// src/components/LifeSystems.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePillar } from '../features/pillarsSlice';
import { addProtocol, toggleProtocol, removeProtocol, Protocol } from '../features/healthSlice';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Moon, Footprints, Droplets, Dumbbell, Check, Activity, Timer, Flame, Plus, Trash2, X } from 'lucide-react';

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

export const LifeSystems: React.FC = () => {
  const [view, setView] = useState<'OVERVIEW' | 'MONEY' | 'HEALTH'>('OVERVIEW');
  const [isAddingProtocol, setIsAddingProtocol] = useState(false);
  const [newProtocolTitle, setNewProtocolTitle] = useState('');
  
  const dispatch = useDispatch();
  const pillars = useSelector((state: RootState) => state.pillars);
  const protocols = useSelector((state: RootState) => state.health.protocols);

  // Ensure recharts receives numeric values (guard against undefined/null/strings)
  const data = (Object.entries(pillars) as Array<[keyof typeof pillars, number]>).map(([name, value]) => ({
    name: String(name),
    value: Number(value) || 0,
  }));

  const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'];

  const handleIncrease = (key: keyof typeof pillars) => {
    const current = Number(pillars[key]) || 0;
    const next = Math.min(100, current + 5);
    dispatch(updatePillar({ key, value: next }));
  };

  const handleAddProtocol = () => {
    if (!newProtocolTitle.trim()) return;
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      title: newProtocolTitle,
      description: 'Custom Protocol',
      type: 'active',
      isCompleted: false,
      iconName: 'Activity',
    };
    dispatch(addProtocol(newProtocol));
    setNewProtocolTitle('');
    setIsAddingProtocol(false);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Droplets': return <Droplets size={14} className="text-blue-400" />;
      case 'Dumbbell': return <Dumbbell size={14} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />;
      case 'Timer': return <Timer size={14} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />;
      default: return <Activity size={14} className="text-zinc-400" />;
    }
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
                score={Number(pillars[key as keyof typeof pillars]) || 0}
                onClick={() => handleIncrease(key as keyof typeof pillars)}
              />
            ))}
          </div>

          <div className="h-64 w-full bg-zinc-900/20 border border-zinc-800/50 p-4 relative">
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
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            {/* Sleep Card */}
            <div className="p-5 border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900/10 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Moon size={48} />
              </div>
              
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Rest & Recovery</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-light text-white tracking-tight">7.5</span>
                    <span className="text-xs text-zinc-500 font-medium">HRS</span>
                  </div>
                </div>
                <div className="bg-indigo-500/10 p-2 rounded-full">
                  <Moon size={16} className="text-indigo-400" />
                </div>
              </div>

              <div className="space-y-2 mt-4 z-10">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Quality</span>
                  <span className="text-indigo-400">88%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-indigo-900 w-[20%]" /> {/* Deep */}
                  <div className="h-full bg-indigo-600 w-[45%]" /> {/* Core */}
                  <div className="h-full bg-indigo-400 w-[25%]" /> {/* REM */}
                  <div className="h-full bg-zinc-700 w-[10%]" />  {/* Awake */}
                </div>
                <div className="flex justify-between text-[10px] text-zinc-600 uppercase tracking-wider">
                  <span>Deep</span>
                  <span>REM</span>
                  <span>Light</span>
                </div>
              </div>
            </div>

            {/* Steps Card */}
            <div className="p-5 border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900/10 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Footprints size={80} />
              </div>

              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Movement</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-light text-white tracking-tight">8,432</span>
                    <span className="text-xs text-zinc-500 font-medium">STEPS</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <Footprints size={16} className="text-emerald-400" />
                </div>
              </div>

              <div className="mt-4 z-10 flex items-center space-x-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                   {/* Simple SVG Circular Progress */}
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="text-emerald-500 drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]"
                        strokeDasharray="84, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Flame size={14} className="text-emerald-500" />
                   </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Daily Goal</span>
                  <span className="text-xs font-mono text-emerald-400">84%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] pl-1">Daily Protocol</h4>
              <button 
                onClick={() => setIsAddingProtocol(!isAddingProtocol)}
                className="text-zinc-500 hover:text-emerald-500 transition-colors"
                aria-label="Add Protocol"
              >
                {isAddingProtocol ? <X size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {isAddingProtocol && (
              <div className="flex items-center space-x-2 p-2 bg-zinc-900/40 border border-zinc-800/50 rounded-sm animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={newProtocolTitle}
                  onChange={(e) => setNewProtocolTitle(e.target.value)}
                  placeholder="New Protocol..."
                  className="bg-transparent border-none text-sm text-white focus:ring-0 flex-1 placeholder:text-zinc-600"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProtocol()}
                  autoFocus
                />
                <button 
                  onClick={handleAddProtocol}
                  className="text-emerald-500 hover:text-emerald-400"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
            
            {protocols.map((protocol) => (
              <button
                key={protocol.id}
                onClick={() => dispatch(toggleProtocol(protocol.id))}
                className={`w-full group flex items-center justify-between p-3 border transition-all duration-300 rounded-sm text-left relative overflow-hidden ${
                  protocol.isCompleted 
                    ? 'bg-zinc-900/40 border-zinc-800/50 opacity-60 hover:opacity-100' 
                    : 'bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30 hover:bg-emerald-900/10'
                }`}
              >
                 {/* Delete button (hover only) */}
                <div 
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-2 text-zinc-600 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeProtocol(protocol.id));
                  }}
                >
                  <Trash2 size={14} />
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    protocol.isCompleted ? 'bg-blue-500/10' : 'bg-zinc-800 group-hover:bg-emerald-500/20'
                  }`}>
                    {getIcon(protocol.iconName)}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm transition-colors ${
                      protocol.isCompleted 
                        ? 'text-zinc-400 line-through decoration-zinc-600' 
                        : 'text-zinc-300 group-hover:text-emerald-100'
                    }`}>
                      {protocol.title}
                    </span>
                    <span className={`text-[10px] transition-colors ${
                      protocol.isCompleted ? 'text-zinc-600' : 'text-zinc-500 group-hover:text-emerald-400/60'
                    }`}>
                      {protocol.description}
                    </span>
                  </div>
                </div>
                
                <div className={`w-5 h-5 border rounded-sm transition-colors flex items-center justify-center mr-8 ${
                  protocol.isCompleted ? 'border-blue-500/50' : 'border-zinc-600 group-hover:border-emerald-500'
                }`}>
                   {protocol.isCompleted && <Check size={14} className="text-blue-500" />}
                   {!protocol.isCompleted && (
                     <div className="w-3 h-3 bg-emerald-500 rounded-[1px] opacity-0 group-active:opacity-100 transition-opacity" />
                   )}
                </div>
              </button>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default LifeSystems;
 