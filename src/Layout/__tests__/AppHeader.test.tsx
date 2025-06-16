import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ConfigProvider } from 'antd';
import AppHeader from '../AppHeader';
import themeReducer from '@/redux/slices/themeSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
  });
};

const renderWithStore = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ConfigProvider>
        {component}
      </ConfigProvider>
    </Provider>
  );
};

describe('AppHeader', () => {
  it('renders header with logo and title', () => {
    renderWithStore(<AppHeader />);
    
    // Check for logo
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
    
    // Check for title
    expect(screen.getByText('Graph Math')).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    renderWithStore(<AppHeader />);
    
    const githubLink = screen.getByRole('link');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/tinh2044');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders theme switcher', () => {
    renderWithStore(<AppHeader />);
    
    const themeSwitcher = screen.getByRole('switch');
    expect(themeSwitcher).toBeInTheDocument();
  });

  it('has correct header structure', () => {
    renderWithStore(<AppHeader />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders title with correct heading level', () => {
    renderWithStore(<AppHeader />);
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Graph Math');
  });
}); 