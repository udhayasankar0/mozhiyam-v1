import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileNavbar from '@/components/MobileNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import NewPostForm from '@/components/NewPostForm';

interface MainLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  onCategoryChange?: (categoryId: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onRefresh, onCategoryChange }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobile && sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);
  
  useEffect(() => {
    setSidebarOpen(false);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const refreshContent = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar} 
        onRefresh={onRefresh}
      />
      
      <div className="flex-1 flex pt-16">
        <Sidebar isOpen={sidebarOpen} onCategoryChange={onCategoryChange} />
        
        <main className="flex-1 bg-gray-50">
          <div className="py-6">
            {user && (
              <div className="mb-6 flex justify-end">
                <NewPostForm onPostCreated={refreshContent} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
};

export default MainLayout;
