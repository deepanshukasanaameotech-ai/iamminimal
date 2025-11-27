export enum View {
  COMMAND = 'COMMAND',
  SYSTEMS = 'SYSTEMS', // Life Pillars, Money, Health
  LAB = 'LAB', // Habits, Order, Rules
  FOCUS = 'FOCUS', // Deep Work
  MIND = 'MIND' // Journal, Identity Map, Review
}

export interface DayLog {
  date: string;
  topGoal: string;
  essentialTask: string;
  dailyRule: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[];
  intensity: 'LOW' | 'MED' | 'HIGH';
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  type: 'REFLECTION' | 'TRUTH' | 'GRATITUDE';
  tags: string[];
  aiInsight?: string;
}

export interface IdentityTrait {
  id: string;
  label: string;
  type: 'CURRENT_WEAKNESS' | 'FUTURE_STRENGTH';
}

export interface AppState {
  view: View;
  dayLogs: Record<string, DayLog>; // Key is YYYY-MM-DD
  habits: Habit[];
  journal: JournalEntry[];
  identity: IdentityTrait[];
  pillars: {
    mind: number;
    body: number;
    money: number;
    career: number;
    relationships: number;
    environment: number;
  };
}