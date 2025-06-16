import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay - Simple Tests', () => {
  it('renders nothing when no error', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when error exists', () => {
    const errorMessage = 'Test error message';
    render(<ErrorDisplay error={errorMessage} />);
    
    expect(screen.getByText('Lỗi')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 