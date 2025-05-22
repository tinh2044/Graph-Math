import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Expression } from './ExpressionContext';


export interface HistoryItem {
  id: string;
  timestamp: number;
  expression: Expression;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (expression: Expression) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  
  useEffect(() => {
    const savedHistory = localStorage.getItem('expressionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('expressionHistory', JSON.stringify(history));
  }, [history]);

  
  const addToHistory = (expression: Expression) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      expression: { ...expression },
    };
    
    
    const isDuplicate = history.some(item => 
      item.expression.equation === expression.equation
    );
    
    if (!isDuplicate) {
      setHistory(prev => {
        
        const newHistory = [historyItem, ...prev];
        return newHistory.length > 50 ? newHistory.slice(0, 50) : newHistory;
      });
    }
  };

  
  const clearHistory = () => {
    setHistory([]);
  };

  
  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ 
      history, 
      addToHistory, 
      clearHistory,
      removeFromHistory
    }}>
      {children}
    </HistoryContext.Provider>
  );
};


export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}; 