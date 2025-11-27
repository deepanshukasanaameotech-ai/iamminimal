import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Rule {
  id: string;
  title: string;
  description: string;
}

interface RulesState {
  rules: Rule[];
}

const initialState: RulesState = {
  rules: [
    {
      id: '1',
      title: 'RULE 01: MONEY',
      description: 'Never buy a liability on credit.',
    },
    {
      id: '2',
      title: 'RULE 02: HEALTH',
      description: 'No calories after 8:00 PM.',
    },
  ],
};

// Load from localStorage
const loadState = (): RulesState => {
  try {
    const serializedState = localStorage.getItem('axis_rules');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const rulesSlice = createSlice({
  name: 'rules',
  initialState: loadState(),
  reducers: {
    addRule: (state, action: PayloadAction<Rule>) => {
      state.rules.push(action.payload);
      localStorage.setItem('axis_rules', JSON.stringify(state));
    },
    removeRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter(r => r.id !== action.payload);
      localStorage.setItem('axis_rules', JSON.stringify(state));
    },
  },
});

export const { addRule, removeRule } = rulesSlice.actions;
export default rulesSlice.reducer;
