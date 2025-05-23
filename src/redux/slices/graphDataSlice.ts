import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

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
  previewExpression: Expression | null;
  // history: HistoryItem[]; // Removed history
}

// const initialHistoryState = { // Removed
//   history: [],
// };

// Load initial state from localStorage (without history)
const loadState = (): GraphDataState => {
  let expressions: Expression[] = [];
  let activeExpression: Expression | null = null;
  let previewExpression: Expression | null = null;

  try {
    const serializedExpressions = localStorage.getItem('expressions');
    if (serializedExpressions) {
      expressions = JSON.parse(serializedExpressions);
    }
    const serializedActiveExpression = localStorage.getItem('activeExpression');
    if (serializedActiveExpression) {
      activeExpression = JSON.parse(serializedActiveExpression);
    }
    const serializedPreviewExpression = localStorage.getItem('previewExpression');
    if (serializedPreviewExpression) {
      previewExpression = JSON.parse(serializedPreviewExpression);
    }
  } catch (err) {
    console.error("Error loading expression state from localStorage:", err);
    expressions = []; // Reset to initial if error
    activeExpression = null;
    previewExpression = null;
  }

  // Removed history loading

  return { expressions, activeExpression, previewExpression };
};

const initialState: GraphDataState = loadState();

const graphDataSlice = createSlice({
  name: 'graphData',
  initialState,
  reducers: {
    addExpression: (state, action: PayloadAction<Omit<Expression, 'id'>>) => {
      const newExpression = {
        ...action.payload,
        id: uuidv4(),
      };
      state.expressions.push(newExpression);
      state.activeExpression = newExpression;
      
      // Removed history adding logic
      
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      localStorage.setItem('previewExpression', JSON.stringify(state.previewExpression));
      // localStorage.setItem('expressionHistory', JSON.stringify(state.history)); // Removed
    },
    updateExpression: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Omit<Expression, 'id'>> }>
    ) => {
      const { id, updates } = action.payload;
      const expression = state.expressions.find(exp => exp.id === id);
      if (expression) {
        Object.assign(expression, updates);
      }
      if (state.activeExpression?.id === id) {
        state.activeExpression = { ...state.activeExpression, ...updates } as Expression;
      }
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      if (state.activeExpression) {
        localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      }
      if (state.previewExpression) {
        localStorage.setItem('previewExpression', JSON.stringify(state.previewExpression));
      }
    },
    removeExpression: (state, action: PayloadAction<string>) => {
      state.expressions = state.expressions.filter(exp => exp.id !== action.payload);
      if (state.activeExpression?.id === action.payload) {
        state.activeExpression = null;
      }
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      if (state.activeExpression) {
        localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      } else {
        localStorage.removeItem('activeExpression');
      }
      if (state.previewExpression) {
        localStorage.removeItem('previewExpression');
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
      const expression = state.expressions.find(exp => exp.id === action.payload);
      if (expression) {
        expression.isVisible = !expression.isVisible;
      }
      if (state.activeExpression?.id === action.payload) {
        state.activeExpression = expression as Expression;
      }
      localStorage.setItem('expressions', JSON.stringify(state.expressions));
      if (state.activeExpression) {
        localStorage.setItem('activeExpression', JSON.stringify(state.activeExpression));
      }
    },
    setPreviewExpression: (state, action: PayloadAction<Expression | null>) => {
      state.previewExpression = action.payload;
      if (state.previewExpression) {
        localStorage.setItem('previewExpression', JSON.stringify(state.previewExpression));
      } else {
        localStorage.removeItem('previewExpression');
      }
    },
  },
});

export const {
  addExpression,
  removeExpression,
  updateExpression,
  toggleVisibility,
  setActiveExpression,
  setPreviewExpression,
} = graphDataSlice.actions;

export default graphDataSlice.reducer;
