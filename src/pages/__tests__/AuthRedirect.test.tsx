import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '../Dashboard';

// Mock Clerk
vi.mock('@clerk/clerk-react', async () => {
  const actual = await vi.importActual('@clerk/clerk-react');
  return {
    ...actual,
    useAuth: () => ({
      userId: null,
      isSignedIn: false,
      isLoaded: true,
      getAuthToken: vi.fn(),
    }),
    useUser: () => ({ user: null }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider publishableKey="pk_test_mock">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  </ClerkProvider>
);

describe('Auth Redirect', () => {
  it('redirects unauthenticated users from dashboard', async () => {
    const mockNavigate = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(<Dashboard />, { wrapper });

    await waitFor(() => {
      // Component should attempt to redirect
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

