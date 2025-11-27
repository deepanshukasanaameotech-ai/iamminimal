import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PillarsState {
  mind: number;
  body: number;
  money: number;
  career: number;
  relationships: number;
  environment: number;
}

const initialState: PillarsState = {
  mind: 50,
  body: 50,
  money: 50,
  career: 50,
  relationships: 50,
  environment: 50,
};

// Load from localStorage if available
const loadState = (): PillarsState => {
  try {
    const serializedState = localStorage.getItem('axis_pillars');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const pillarsSlice = createSlice({
  name: 'pillars',
  initialState: loadState(),
  reducers: {
    updatePillar: (state, action: PayloadAction<{ key: keyof PillarsState; value: number }>) => {
      const { key, value } = action.payload;
      state[key] = value;
      localStorage.setItem('axis_pillars', JSON.stringify(state));
    },
  },
});

export const { updatePillar } = pillarsSlice.actions;
export default pillarsSlice.reducer;
