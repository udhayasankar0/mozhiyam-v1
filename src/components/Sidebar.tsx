
import React, { useState } from 'react';
import { Book, BookOpen, MessageSquare, List } from 'lucide-react';
import CategoryFilter from './CategoryFilter';

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
      className={`fixed md:sticky top-0 left-0 z-40 h-full md:h-[calc(100vh-4rem)] w-64 bg-sidebar transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 overflow-y-auto py-6 flex flex-col border-r`}
    >
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <div className="mt-auto px-4 pt-4 border-t border-border">
        <div className="flex flex-col gap-2">
          <button className="btn-primary w-full flex justify-center items-center">
            Submit Your Work
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
