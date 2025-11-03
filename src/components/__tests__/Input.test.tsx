import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../ui/input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('accepts value and onChange', () => {
    const handleChange = vi.fn();
    render(<Input value="test" onChange={handleChange} data-testid="test-input" />);
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('applies className', () => {
    render(<Input className="custom-class" data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('custom-class');
  });
});

