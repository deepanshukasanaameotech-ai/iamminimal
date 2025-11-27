import React from 'react';
import { View } from '../types';
import { LayoutGrid, Brain, Activity, Target, BookOpen } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setView: (v: View) => void;
  children: React.ReactNode;
}

const NavItem = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 w-full transition-all duration-300 ${
      active ? 'text-emerald-500 bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    <Icon size={20} strokeWidth={1.5} />
    <span className="text-[10px] uppercase tracking-widest mt-1.5 font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="max-w-2xl mx-auto min-h-full p-6 pb-24">
            {children}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950 border-t border-zinc-900 flex items-stretch z-50">
        <NavItem 
          active={currentView === View.COMMAND} 
          onClick={() => setView(View.COMMAND)} 
          icon={LayoutGrid} 
          label="Command" 
        />
        <NavItem 
          active={currentView === View.SYSTEMS} 
          onClick={() => setView(View.SYSTEMS)} 
          icon={Activity} 
          label="Systems" 
        />
        <NavItem 
          active={currentView === View.LAB} 
          onClick={() => setView(View.LAB)} 
          icon={Brain} 
          label="Lab" 
        />
        <NavItem 
          active={currentView === View.FOCUS} 
          onClick={() => setView(View.FOCUS)} 
          icon={Target} 
          label="Focus" 
        />
        <NavItem 
          active={currentView === View.MIND} 
          onClick={() => setView(View.MIND)} 
          icon={BookOpen} 
          label="Mind" 
        />
      </nav>
    </div>
  );
};