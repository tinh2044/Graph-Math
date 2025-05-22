import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Expression {
  id: string;
  equation: string;
  latex: string;
  color: string;
  isVisible: boolean;
}

interface ExpressionContextType {
  expressions: Expression[];
  activeExpression: Expression | null;
  addExpression: (expression: Omit<Expression, 'id'>) => void;
  updateExpression: (id: string, updates: Partial<Expression>) => void;
  removeExpression: (id: string) => void;
  setActiveExpression: (id: string | null) => void;
  toggleVisibility: (id: string) => void;
}

const ExpressionContext = createContext<ExpressionContextType | undefined>(undefined);

interface ExpressionProviderProps {
  children: ReactNode;
}

export const ExpressionProvider: React.FC<ExpressionProviderProps> = ({ children }) => {
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [activeExpression, setActiveExpressionState] = useState<Expression | null>(null);

  useEffect(() => {
    const savedExpressions = localStorage.getItem('expressions');
    if (savedExpressions) {
      setExpressions(JSON.parse(savedExpressions));
    }
    
    const savedActiveExpression = localStorage.getItem('activeExpression');
    if (savedActiveExpression) {
      const active = JSON.parse(savedActiveExpression);
      setActiveExpressionState(active);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expressions', JSON.stringify(expressions));
  }, [expressions]);

  useEffect(() => {
    if (activeExpression) {
      localStorage.setItem('activeExpression', JSON.stringify(activeExpression));
    } else {
      localStorage.removeItem('activeExpression');
    }
  }, [activeExpression]);

  const addExpression = (expression: Omit<Expression, 'id'>) => {
    const newExpression = { 
      ...expression, 
      id: Date.now().toString() 
    };
    setExpressions(prev => [...prev, newExpression]);
    setActiveExpressionState(newExpression);
  };

  const updateExpression = (id: string, updates: Partial<Expression>) => {
    setExpressions(prev => 
      prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    );
    
    if (activeExpression?.id === id) {
      setActiveExpressionState(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeExpression = (id: string) => {
    setExpressions(prev => prev.filter(exp => exp.id !== id));
    
    if (activeExpression?.id === id) {
      const remainingExpressions = expressions.filter(exp => exp.id !== id);
      setActiveExpressionState(remainingExpressions.length > 0 ? remainingExpressions[0] : null);
    }
  };

  const setActiveExpression = (id: string | null) => {
    if (id === null) {
      setActiveExpressionState(null);
      return;
    }
    
    const found = expressions.find(exp => exp.id === id);
    setActiveExpressionState(found || null);
  };

  const toggleVisibility = (id: string) => {
    setExpressions(prev => 
      prev.map(exp => exp.id === id ? { ...exp, isVisible: !exp.isVisible } : exp)
    );

    if (activeExpression?.id === id) {
      setActiveExpressionState(prev => 
        prev ? { ...prev, isVisible: !prev.isVisible } : null
      );
    }
  };

  return (
    <ExpressionContext.Provider value={{
      expressions,
      activeExpression,
      addExpression,
      updateExpression,
      removeExpression,
      setActiveExpression,
      toggleVisibility
    }}>
      {children}
    </ExpressionContext.Provider>
  );
};

export const useExpressions = (): ExpressionContextType => {
  const context = useContext(ExpressionContext);
  if (context === undefined) {
    throw new Error('useExpressions must be used within an ExpressionProvider');
  }
  return context;
}; 