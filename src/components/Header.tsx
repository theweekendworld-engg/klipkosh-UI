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
    <header className="border-b border-purple-300/20 bg-transparent backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Brought to you by</span>
          <span className="text-xl font-bold text-white ml-2">PostPilot</span>
        </Link>
        <div className="hidden md:block">
          <span className="text-sm text-white/70">YouTube Transcript Generator</span>
        </div>
        <nav className="flex items-center space-x-4">
          {isSignedIn && (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Dashboard</Button>
              </Link>
              {onSettingsClick && (
                <Button variant="ghost" size="icon" onClick={onSettingsClick} className="text-white hover:bg-white/10">
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

