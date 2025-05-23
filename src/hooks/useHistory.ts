import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  addToHistory, 
  clearHistory, 
  removeFromHistory, 
  updateHistoryColor 
} from '../store/historySlice';
import type { Expression } from '../store/expressionSlice';

export const useHistory = () => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(state => state.history.history);

  const addToHistoryHandler = useCallback((expression: Expression) => {
    dispatch(addToHistory(expression));
  }, [dispatch]);

  const clearHistoryHandler = useCallback(() => {
    dispatch(clearHistory());
  }, [dispatch]);

  const removeFromHistoryHandler = useCallback((id: string) => {
    dispatch(removeFromHistory(id));
  }, [dispatch]);

  const updateHistoryColorHandler = useCallback((id: string, color: string) => {
    dispatch(updateHistoryColor({ id, color }));
  }, [dispatch]);

  return {
    history,
    addToHistory: addToHistoryHandler,
    clearHistory: clearHistoryHandler,
    removeFromHistory: removeFromHistoryHandler,
    updateHistoryColor: updateHistoryColorHandler
  };
}; 