import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

export function useAuth() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  const getAuthToken = async (): Promise<string | null> => {
    if (!isSignedIn) return null;
    try {
      return await getToken();
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  };

  return {
    userId,
    sessionId,
    user,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    getAuthToken,
  };
}

