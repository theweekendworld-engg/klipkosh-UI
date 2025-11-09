import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Settings, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-purple-300/20 bg-transparent backdrop-blur-sm">
        <div className="container flex h-16 sm:h-20 items-center justify-between relative px-2 sm:px-4">
          {/* Left side - Mobile Menu Button / Desktop "Brought to you by" */}
          <div className="flex items-center flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center h-9 w-9 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Desktop "Brought to you by" */}
            <div className="hidden md:block">
              <span className="text-xs text-white/50">Brought to you by</span>
              <span className="text-xs text-white/70 ml-1">theweekendworld</span>
            </div>
          </div>

          {/* Center - KlipKosh (Artistic with Alternating Dim) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight whitespace-nowrap">
              <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-alternate-dim">
                Klip
              </span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-alternate-dim-delayed">
                Kosh
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 ml-auto flex-shrink-0 z-20">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 text-sm md:text-sm px-2 md:px-3 h-8 md:h-9">Home</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 text-sm md:text-sm px-2 md:px-3 h-8 md:h-9">Pricing</Button>
            </Link>
            {isSignedIn && (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 text-sm md:text-sm px-2 md:px-3 h-8 md:h-9">Dashboard</Button>
                </Link>
                {onSettingsClick && (
                  <Button variant="ghost" size="icon" onClick={onSettingsClick} className="text-white hover:bg-white/10 h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0">
                    <Settings className="h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                )}
                <div className="h-7 sm:h-7 md:h-8 md:w-8 flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="md:hidden fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-black/95 backdrop-blur-md shadow-xl z-50 transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-purple-300/20 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-white hover:bg-white/10 h-12 text-base"
                  >
                    Home
                  </Button>
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-white hover:bg-white/10 h-12 text-base"
                  >
                    Pricing
                  </Button>
                </Link>
                {isSignedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:text-white hover:bg-white/10 h-12 text-base"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    {onSettingsClick && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSettingsClick();
                        }}
                        className="w-full justify-start text-white hover:text-white hover:bg-white/10 h-12 text-base"
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        Settings
                      </Button>
                    )}
                    <div className="pt-4 border-t border-purple-300/20">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm text-white/70">Account</span>
                        <div className="h-8 w-8">
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

