
import React from 'react';
import { Home, User, Award, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileNavbar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center justify-center w-full h-full text-primary hover:bg-gray-50">
          <Home size={20} />
          <span className="text-xs mt-1 tamil">முகப்பு</span>
        </Link>
        <Link to="/leaderboard" className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:bg-gray-50">
          <Award size={20} />
          <span className="text-xs mt-1 tamil">தரவரிசை</span>
        </Link>
        <Link to="/editor" className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:bg-gray-50">
          <PenSquare size={20} />
          <span className="text-xs mt-1 tamil">புதியது</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:bg-gray-50">
          <User size={20} />
          <span className="text-xs mt-1 tamil">என்னுடையது</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
