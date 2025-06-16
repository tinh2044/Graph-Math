import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ConfigProvider } from 'antd';
import App from '../App';
import graphDataReducer from '@/redux/slices/graphDataSlice';
import themeReducer from '@/redux/slices/themeSlice';

// Mock complex components
jest.mock('@/components/Graph', () => {
  return function MockGraph() {
    return <div data-testid="mock-graph">Graph Component</div>;
  };
});

jest.mock('@/components/EquationInput', () => {
  return React.forwardRef(function MockEquationInput() {
    return <div data-testid="mock-equation-input">Equation Input Component</div>;
  });
});

jest.mock('@/Layout/AppLayout', () => {
  return function MockAppLayout({ children }: { children: React.ReactNode }) {
    return (
      <div data-testid="mock-app-layout">
        <header role="banner">Mock Header</header>
        <main>{children}</main>
        <footer role="contentinfo">Mock Footer</footer>
      </div>
    );
  };
});

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      graphData: graphDataReducer,
      theme: themeReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <ConfigProvider>
        {component}
      </ConfigProvider>
    </Provider>
  );
};

describe('App', () => {
  it('renders main app layout', () => {
    renderWithProviders(<App />);
    
    // Check for header
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Check for footer  
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Check for mock header
    expect(screen.getByText('Mock Header')).toBeInTheDocument();
  });

  it('renders equation input component', () => {
    renderWithProviders(<App />);
    
    const equationInput = screen.getByTestId('mock-equation-input');
    expect(equationInput).toBeInTheDocument();
  });

  it('renders graph component', () => {
    renderWithProviders(<App />);
    
    const graph = screen.getByTestId('mock-graph');
    expect(graph).toBeInTheDocument();
  });

  it('renders expression list', () => {
    renderWithProviders(<App />);
    
    // Should show empty state initially
    expect(screen.getByText('Chưa có biểu thức nào')).toBeInTheDocument();
  });

  it('applies dark theme class correctly', () => {
    renderWithProviders(<App />, {
      theme: { theme: 'dark' }
    });
    
    // Document should have dark class
    expect(document.documentElement).toHaveClass('dark');
  });
}); 