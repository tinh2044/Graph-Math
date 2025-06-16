import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ConfigProvider } from 'antd';
import ExpressionList from '../index';
import graphDataReducer from '@/redux/slices/graphDataSlice';

const mockExpressions = [
  {
    id: '1',
    equation: 'x^2',
    latex: 'x^2',
    color: '#1677ff',
    isVisible: true,
  },
  {
    id: '2', 
    equation: 'sin(x)',
    latex: '\\sin(x)',
    color: '#52c41a',
    isVisible: false,
  },
];

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      graphData: graphDataReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <ConfigProvider>
        {component}
      </ConfigProvider>
    </Provider>
  );
};

describe('ExpressionList', () => {
  it('renders empty state when no expressions', () => {
    renderWithStore(<ExpressionList />, {
      graphData: {
        expressions: [],
        activeExpression: null,
        previewExpression: null,
      }
    });
    
    expect(screen.getByText('Chưa có biểu thức nào')).toBeInTheDocument();
  });

  it('renders expressions list when expressions exist', () => {
    renderWithStore(<ExpressionList />, {
      graphData: {
        expressions: mockExpressions,
        activeExpression: null,
        previewExpression: null,
      }
    });
    
    // Should render the main list (first one is the expressions list)
    const lists = screen.getAllByRole('list');
    expect(lists[0]).toBeInTheDocument();
    
    // Should not show empty state
    expect(screen.queryByText('Chưa có biểu thức nào')).not.toBeInTheDocument();
  });

  it('renders correct number of expression items', () => {
    renderWithStore(<ExpressionList />, {
      graphData: {
        expressions: mockExpressions,
        activeExpression: null,
        previewExpression: null,
      }
    });
    
    // Each expression creates multiple listitem elements (one for the expression, plus actions)
    // So we just check that we have the expected expressions by looking for the visibility buttons
    const visibilityButtons = screen.getAllByRole('button');
    const eyeButtons = visibilityButtons.filter(button => {
      const icon = button.querySelector('[aria-label="eye"], [aria-label="eye-invisible"]');
      return icon !== null;
    });
    expect(eyeButtons).toHaveLength(mockExpressions.length);
  });
}); 