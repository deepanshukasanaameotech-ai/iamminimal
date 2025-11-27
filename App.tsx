import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CommandCenter } from './components/CommandCenter';
import { HabitLab } from './components/HabitLab';
import { LifeSystems } from './components/LifeSystems';
import { DeepWork } from './components/DeepWork';
import { Journal } from './components/Journal';
import { AppState, View, DayLog, Habit, JournalEntry } from './types';

const INITIAL_DAY_LOG: DayLog = {
  date: new Date().toISOString().split('T')[0],
  topGoal: '',
  essentialTask: '',
  dailyRule: '',
  completed: false
};

function App() {
  const [view, setView] = useState<View>(View.COMMAND);
  
  // State initialization with localStorage fallback
  const [dayLog, setDayLog] = useState<DayLog>(() => {
    const saved = localStorage.getItem('axis_daylog');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return { ...INITIAL_DAY_LOG, date: today };
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('axis_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [pillars, setPillars] = useState<AppState['pillars']>(() => {
    const saved = localStorage.getItem('axis_pillars');
    return saved ? JSON.parse(saved) : {
      mind: 50, body: 50, money: 50, career: 50, relationships: 50, environment: 50
    };
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('axis_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('axis_daylog', JSON.stringify(dayLog)), [dayLog]);
  useEffect(() => localStorage.setItem('axis_habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('axis_pillars', JSON.stringify(pillars)), [pillars]);
  useEffect(() => localStorage.setItem('axis_journal', JSON.stringify(journalEntries)), [journalEntries]);

  const updatePillars = (key: keyof AppState['pillars'], value: number) => {
    setPillars(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout currentView={view} setView={setView}>
      {view === View.COMMAND && (
        <CommandCenter dayLog={dayLog} updateDayLog={setDayLog} />
      )}
      
      {view === View.LAB && (
        <HabitLab habits={habits} setHabits={setHabits} />
      )}
      
      {view === View.SYSTEMS && (
        <LifeSystems pillars={pillars} updatePillars={updatePillars} />
      )}
      
      {view === View.FOCUS && (
        <DeepWork />
      )}
      
      {view === View.MIND && (
        <Journal entries={journalEntries} setEntries={setJournalEntries} identity={[]} />
      )}
    </Layout>
  );
}

export default App;