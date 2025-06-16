import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ConfigProvider } from 'antd';
import ThemeSwitcher from '../ThemeSwitcher';
import themeReducer from '@/redux/slices/themeSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState,
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

describe('ThemeSwitcher', () => {
  it('renders theme switcher correctly', () => {
    renderWithStore(<ThemeSwitcher />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('shows unchecked for light theme', () => {
    renderWithStore(<ThemeSwitcher />, {
      theme: { theme: 'light' }
    });
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
  });

  it('shows checked for dark theme', () => {
    renderWithStore(<ThemeSwitcher />, {
      theme: { theme: 'dark' }
    });
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('toggles theme when clicked', () => {
    renderWithStore(<ThemeSwitcher />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    // After clicking, the switch should change state
    expect(switchElement).toBeChecked();
  });
}); 