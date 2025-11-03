import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Header } from '../Header';

const mockClerk = {
  publishableKey: 'pk_test_mock',
  isLoaded: true,
  user: null,
  isSignedIn: false,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider publishableKey="pk_test_mock">
    <BrowserRouter>{children}</BrowserRouter>
  </ClerkProvider>
);

describe('Header', () => {
  it('renders PostPilot logo', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText('PostPilot')).toBeInTheDocument();
  });

  it('renders settings button when onSettingsClick is provided', () => {
    const onSettingsClick = vi.fn();
    render(<Header onSettingsClick={onSettingsClick} />, { wrapper });
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });
});

