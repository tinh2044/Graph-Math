import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigProvider } from 'antd';
import AppFooter from '../AppFooter';

const renderWithAntd = (component: React.ReactElement) => {
  return render(
    <ConfigProvider>
      {component}
    </ConfigProvider>
  );
};

describe('AppFooter', () => {
  it('renders footer with copyright text', () => {
    renderWithAntd(<AppFooter />);
    
    const currentYear = new Date().getFullYear();
    const copyrightText = `Graph Math ©${currentYear} Phát triển bởi`;
    
    expect(screen.getByText(copyrightText, { exact: false })).toBeInTheDocument();
  });

  it('renders developer link', () => {
    renderWithAntd(<AppFooter />);
    
    const developerLink = screen.getByRole('link', { name: 'Nguyễn Chí Tình' });
    expect(developerLink).toBeInTheDocument();
    expect(developerLink).toHaveAttribute('href', 'https://github.com/tinh2044');
    expect(developerLink).toHaveAttribute('target', '_blank');
  });

  it('has correct footer structure', () => {
    renderWithAntd(<AppFooter />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays current year in copyright', () => {
    renderWithAntd(<AppFooter />);
    
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
}); 