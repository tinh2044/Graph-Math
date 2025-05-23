import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  addExpression, 
  updateExpression, 
  removeExpression, 
  setActiveExpression as setActive, 
  toggleVisibility as toggleVis,
  type Expression
} from '../store/expressionSlice';

export const useExpressions = () => {
  const dispatch = useAppDispatch();
  const expressions = useAppSelector(state => state.expressions.expressions);
  const activeExpression = useAppSelector(state => state.expressions.activeExpression);

  const addExpressionHandler = useCallback((expression: Omit<Expression, 'id'>) => {
    dispatch(addExpression(expression));
  }, [dispatch]);

  const updateExpressionHandler = useCallback((id: string, updates: Partial<Expression>) => {
    dispatch(updateExpression({ id, updates }));
  }, [dispatch]);

  const removeExpressionHandler = useCallback((id: string) => {
    dispatch(removeExpression(id));
  }, [dispatch]);

  const setActiveExpressionHandler = useCallback((id: string | null) => {
    dispatch(setActive(id));
  }, [dispatch]);

  const toggleVisibilityHandler = useCallback((id: string) => {
    dispatch(toggleVis(id));
  }, [dispatch]);

  return {
    expressions,
    activeExpression,
    addExpression: addExpressionHandler,
    updateExpression: updateExpressionHandler,
    removeExpression: removeExpressionHandler,
    setActiveExpression: setActiveExpressionHandler,
    toggleVisibility: toggleVisibilityHandler
  };
}; 