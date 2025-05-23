import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define Expression type
export interface Expression {
  id: string;
  equation: string;
  latex: string;
  color: string;
  isVisible: boolean;
}

// Define the state (without history)
interface GraphDataState {
  expressions: Expression[];
  activeExpression: Expression | null;
  // history: HistoryItem[]; // Removed history
}

// const initialHistoryState = { // Removed
//   history: [],
// };

// Load initial state from localStorage (without history)
const loadState = (): GraphDataState => {
  let expressions: Expression[] = [];
  let activeExpression: Expression | null = null;

  try {
    const serializedExpressions = localStorage.getItem('expressions');
    if (serializedExpressions) {
      expressions = JSON.parse(serializedExpressions);
    }
    const serializedActiveExpression = localStorage.getItem('activeExpression');
    if (serializedActiveExpression) {
      activeExpression = JSON.parse(serializedActiveExpression);
    }
  } catch (err) {
    console.error("Error loading expression state from localStorage:", err);
    expressions = []; // Reset to initial if error
    activeExpression = null;
  }

  // Removed history loading

  return { expressions, activeExpression };
};

const initialState: GraphDataState = loadState();

const graphDataSlice = createSlice({
  name: 'graphData',
  initialState,
  reducers: {
    addExpression: (state, action: PayloadAction<Omit<Expression, 'id'>>) => {
      const newExpression: Expression = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.expressions.push(newExpression);
      state.activeExpression = newExpression;
      
      // Removed history adding logic
      
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      // localStorage.setItem('expressionHistory', JSON.stringify(state.history)); // Removed
    },
    updateExpression: (state, action: PayloadAction<{ id: string; updates: Partial<Expression> }>) => {
      const { id, updates } = action.payload;
      const index = state.expressions.findIndex(exp => exp.id === id);
      if (index !== -1) {
        state.expressions[index] = { ...state.expressions[index], ...updates };
        if (state.activeExpression?.id === id) {
          state.activeExpression = { ...state.activeExpression, ...updates };
        }
        localStorage.setItem('expressions', JSON.stringify(state.expressions));
        if (state.activeExpression) {
          localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
        }
      }
    },
    removeExpression: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.expressions = state.expressions.filter(exp => exp.id !== id);
      if (state.activeExpression?.id === id) {
        state.activeExpression = state.expressions.length > 0 ? state.expressions[0] : null;
      }
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      if (state.activeExpression) {
        localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      } else {
        localStorage.removeItem('activeExpression');
      }
    },
    setActiveExpression: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.activeExpression = null;
      } else {
        state.activeExpression = state.expressions.find(exp => exp.id === action.payload) || null;
      }
      if (state.activeExpression) {
        localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      } else {
        localStorage.removeItem('activeExpression');
      }
    },
    toggleVisibility: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.expressions.findIndex(exp => exp.id === id);
      if (index !== -1) {
        const updatedExpression = { ...state.expressions[index], isVisible: !state.expressions[index].isVisible };
        state.expressions[index] = updatedExpression;
        if (state.activeExpression?.id === id) {
          state.activeExpression = updatedExpression;
        }
        localStorage.setItem('expressions', JSON.stringify(state.expressions));
        if (state.activeExpression) {
          localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
        }
      }
    },
  },
});

export const {
  addExpression, 
  updateExpression,
  removeExpression,
  setActiveExpression,
  toggleVisibility,
  
} = graphDataSlice.actions;

export default graphDataSlice.reducer;
