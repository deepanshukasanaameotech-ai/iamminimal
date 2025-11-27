import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Protocol {
  id: string;
  title: string;
  description: string;
  type: 'completed' | 'active' | 'pending'; // completed = check, active = button, pending = timer/todo
  isCompleted: boolean;
  iconName: 'Droplets' | 'Dumbbell' | 'Timer' | 'Activity' | 'Flame' | 'Moon' | 'Footprints';
}

interface HealthState {
  protocols: Protocol[];
}

const initialState: HealthState = {
  protocols: [
    {
      id: '1',
      title: 'Morning Hydration',
      description: '1L Water + Electrolytes',
      type: 'completed',
      isCompleted: true,
      iconName: 'Droplets',
    },
    {
      id: '2',
      title: '50 Pushups',
      description: 'Physical Activation',
      type: 'active',
      isCompleted: false,
      iconName: 'Dumbbell',
    },
    {
      id: '3',
      title: 'Cold Exposure',
      description: '3 Minutes @ 50°F',
      type: 'pending',
      isCompleted: false,
      iconName: 'Timer',
    },
  ],
};

// Load from localStorage
const loadState = (): HealthState => {
  try {
    const serializedState = localStorage.getItem('axis_health');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const healthSlice = createSlice({
  name: 'health',
  initialState: loadState(),
  reducers: {
    addProtocol: (state, action: PayloadAction<Protocol>) => {
      state.protocols.push(action.payload);
      localStorage.setItem('axis_health', JSON.stringify(state));
    },
    toggleProtocol: (state, action: PayloadAction<string>) => {
      const protocol = state.protocols.find(p => p.id === action.payload);
      if (protocol) {
        protocol.isCompleted = !protocol.isCompleted;
        // If it was 'active' type, toggling might mean completing it
        if (protocol.type === 'active' && protocol.isCompleted) {
            // Keep type as active but visual state changes based on isCompleted
        }
        localStorage.setItem('axis_health', JSON.stringify(state));
      }
    },
    removeProtocol: (state, action: PayloadAction<string>) => {
      state.protocols = state.protocols.filter(p => p.id !== action.payload);
      localStorage.setItem('axis_health', JSON.stringify(state));
    },
  },
});

export const { addProtocol, toggleProtocol, removeProtocol } = healthSlice.actions;
export default healthSlice.reducer;
