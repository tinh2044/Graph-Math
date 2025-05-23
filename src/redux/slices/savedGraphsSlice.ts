import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { SavedGraph } from '../../context/SavedGraphsContext'; // Define SavedGraph here
import type { Expression } from './expressionSlice'; // Import Expression

// Define SavedGraph type here
export interface SavedGraph {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  expressions: Expression[];
  settings: {
    xRange: [number, number];
    yRange: [number, number];
    grid: boolean;
  };
}

interface SavedGraphsState {
  savedGraphs: SavedGraph[];
}

const initialState: SavedGraphsState = {
  savedGraphs: [],
};

// Load initial state from localStorage
const loadState = (): SavedGraphsState => {
  try {
    const serializedGraphs = localStorage.getItem('savedGraphs');
    if (serializedGraphs === null) {
      return initialState;
    }
    return { savedGraphs: JSON.parse(serializedGraphs) };
  } catch (err) {
    return initialState;
  }
};

const savedGraphsSlice = createSlice({
  name: 'savedGraphs',
  initialState: loadState(),
  reducers: {
    addGraph: (state, action: PayloadAction<Omit<SavedGraph, 'id' | 'timestamp'>>) => {
      const newGraph: SavedGraph = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.savedGraphs.push(newGraph);
      localStorage.setItem('savedGraphs', JSON.stringify(state.savedGraphs));
    },
    updateGraph: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<SavedGraph, 'id'>> }>) => {
      const { id, updates } = action.payload;
      const index = state.savedGraphs.findIndex(graph => graph.id === id);
      if (index !== -1) {
        state.savedGraphs[index] = { ...state.savedGraphs[index], ...updates };
        localStorage.setItem('savedGraphs', JSON.stringify(state.savedGraphs));
      }
    },
    deleteGraph: (state, action: PayloadAction<string>) => {
      state.savedGraphs = state.savedGraphs.filter(graph => graph.id !== action.payload);
      localStorage.setItem('savedGraphs', JSON.stringify(state.savedGraphs));
    },
    // getGraphById is a selector, not a reducer. It will be handled outside the slice.
  },
});

export const { addGraph, updateGraph, deleteGraph } = savedGraphsSlice.actions;

export default savedGraphsSlice.reducer; 