import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from './components/Layout';
import { CommandCenter } from './components/CommandCenter';
import { HabitLab } from './components/HabitLab';
import { LifeSystems } from './components/LifeSystems';
import { DeepWork } from './components/DeepWork';
import { Journal } from './components/Journal';
import { View, DayLog, Habit, JournalEntry } from './types';

const INITIAL_DAY_LOG: DayLog = {
  date: new Date().toISOString().split('T')[0],
  topGoal: '',
  essentialTask: '',
  dailyRule: '',
  completed: false
};

function AppContent() {
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

  // Pillars state moved to Redux

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('axis_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('axis_daylog', JSON.stringify(dayLog)), [dayLog]);
  useEffect(() => localStorage.setItem('axis_habits', JSON.stringify(habits)), [habits]);
  // Pillars persistence handled in Redux slice
  useEffect(() => localStorage.setItem('axis_journal', JSON.stringify(journalEntries)), [journalEntries]);

  return (
    <Layout currentView={view} setView={setView}>
      {view === View.COMMAND && (
        <CommandCenter dayLog={dayLog} updateDayLog={setDayLog} />
      )}
      
      {view === View.LAB && (
        <HabitLab habits={habits} setHabits={setHabits} />
      )}
      
      {view === View.SYSTEMS && (
        <LifeSystems />
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

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;