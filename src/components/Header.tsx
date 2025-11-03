import { UserButton } from '@clerk/clerk-react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">PostPilot</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-4">
          {isSignedIn && (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {onSettingsClick && (
                <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              )}
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

