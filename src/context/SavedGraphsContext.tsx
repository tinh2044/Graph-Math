import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Expression } from './ExpressionContext';

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

interface SavedGraphsContextType {
  savedGraphs: SavedGraph[];
  addGraph: (graph: Omit<SavedGraph, 'id' | 'timestamp'>) => void;
  updateGraph: (id: string, updates: Partial<Omit<SavedGraph, 'id'>>) => void;
  deleteGraph: (id: string) => void;
  getGraphById: (id: string) => SavedGraph | undefined;
}

const SavedGraphsContext = createContext<SavedGraphsContextType | undefined>(undefined);

interface SavedGraphsProviderProps {
  children: ReactNode;
}

export const SavedGraphsProvider: React.FC<SavedGraphsProviderProps> = ({ children }) => {
  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedGraphs');
    if (saved) {
      setSavedGraphs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedGraphs', JSON.stringify(savedGraphs));
  }, [savedGraphs]);

  const addGraph = (graph: Omit<SavedGraph, 'id' | 'timestamp'>) => {
    const newGraph: SavedGraph = {
      ...graph,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setSavedGraphs(prev => [...prev, newGraph]);
  };

  const updateGraph = (id: string, updates: Partial<Omit<SavedGraph, 'id'>>) => {
    setSavedGraphs(prev => 
      prev.map(graph => graph.id === id ? { ...graph, ...updates } : graph)
    );
  };

  const deleteGraph = (id: string) => {
    setSavedGraphs(prev => prev.filter(graph => graph.id !== id));
  };

  const getGraphById = (id: string) => {
    return savedGraphs.find(graph => graph.id === id);
  };

  return (
    <SavedGraphsContext.Provider value={{
      savedGraphs,
      addGraph,
      updateGraph,
      deleteGraph,
      getGraphById,
    }}>
      {children}
    </SavedGraphsContext.Provider>
  );
};

export const useSavedGraphs = (): SavedGraphsContextType => {
  const context = useContext(SavedGraphsContext);
  if (context === undefined) {
    throw new Error('useSavedGraphs must be used within a SavedGraphsProvider');
  }
  return context;
}; 