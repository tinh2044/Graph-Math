import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Simple test component
const SimpleComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button>Click me</button>
    </div>
  );
};

describe('SimpleComponent', () => {
  it('renders title correctly', () => {
    render(<SimpleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders button', () => {
    render(<SimpleComponent title="Test" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
}); 