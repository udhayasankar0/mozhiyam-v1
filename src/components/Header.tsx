
import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-card px-4 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="btn-ghost p-2 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            <span className="tamil">நூலகம்</span>
            <span className="sr-only">Tamil Library</span>
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 mx-6">
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="flex md:hidden items-center gap-2">
        {searchOpen ? (
          <div className="absolute inset-x-0 top-0 h-full bg-background px-4 py-3 flex items-center animate-fade-in">
            <SearchBar />
            <button 
              onClick={() => setSearchOpen(false)}
              className="ml-2 p-2"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setSearchOpen(true)}
            className="btn-ghost p-2"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
