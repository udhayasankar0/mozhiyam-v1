
import React, { useState } from 'react';
import { Book, BookOpen, MessageSquare, List, PenSquare, Award, User, Home } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'அனைத்தும்', englishName: 'All', icon: List },
    { id: 'poems', name: 'கவிதைகள்', englishName: 'Poems', icon: Book },
    { id: 'stories', name: 'சிறுகதைகள்', englishName: 'Short Stories', icon: BookOpen },
    { id: 'opinions', name: 'கருத்துக்கள்', englishName: 'Opinions', icon: MessageSquare },
  ];
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  return (
    <aside 
      className={`fixed md:sticky top-0 left-0 z-40 h-full md:h-[calc(100vh-4rem)] w-64 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 overflow-hidden border-r border-gray-200`}
    >
      <ScrollArea className="h-full py-6 px-3">
        <div className="space-y-1 mb-6">
          <Link to="/" className="sidebar-item w-full text-left">
            <Home size={18} />
            <span className="tamil">முகப்பு</span>
          </Link>
          <Link to="/leaderboard" className="sidebar-item w-full text-left">
            <Award size={18} />
            <span className="tamil">தரவரிசை</span>
          </Link>
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 px-4 mb-2">Categories</h2>
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div className="px-3 mb-6">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link to="/editor" className="flex items-center justify-center gap-2">
              <PenSquare size={16} />
              <span className="tamil">புதிய படைப்பு</span>
            </Link>
          </Button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="px-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">உங்கள் கணக்கு</h3>
            <div className="space-y-2">
              <Link to="/profile" className="sidebar-item w-full text-left">
                <User size={18} />
                <span className="tamil">சுயவிவரம்</span>
              </Link>
              <Link to="/followers" className="sidebar-item w-full text-left">
                <MessageSquare size={18} />
                <span className="tamil">பின்தொடர்பவர்கள்</span>
              </Link>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
