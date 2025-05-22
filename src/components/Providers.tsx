import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { ExpressionProvider } from '../context/ExpressionContext';
import { HistoryProvider } from '../context/HistoryContext';
import { SavedGraphsProvider } from '../context/SavedGraphsContext';
import { BrowserRouter as Router } from 'react-router-dom';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ExpressionProvider>
        <HistoryProvider>
          <SavedGraphsProvider>
            <Router>
              {children}
            </Router>
          </SavedGraphsProvider>
        </HistoryProvider>
      </ExpressionProvider>
    </ThemeProvider>
  );
};

export default Providers; 