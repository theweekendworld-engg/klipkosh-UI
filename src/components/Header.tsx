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
      <div className="container flex h-20 items-center justify-between relative">
        {/* Left side - Brought to you by */}
        <div className="hidden md:block">
          <span className="text-xs text-white/50">Brought to you by</span>
          <span className="text-xs text-white/70 ml-1">theweekendworld</span>
        </div>

        {/* Center - KlipKosh (Artistic with Alternating Dim) */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-alternate-dim">
              Klip
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-alternate-dim-delayed">
              Kosh
            </span>
          </h1>
        </Link>

        {/* Right side - Navigation */}
        <nav className="flex items-center space-x-4 ml-auto">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Home</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Pricing</Button>
          </Link>
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

