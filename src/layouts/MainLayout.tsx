
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileNavbar from '@/components/MobileNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import NewPostForm from '@/components/NewPostForm';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Close sidebar on mobile when clicking outside
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
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const refreshContent = () => {
    // This will be passed to NewPostForm to refresh content after posting
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <div id="sidebar">
          <Sidebar isOpen={sidebarOpen} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          {user && (
            <div className="mb-6 flex justify-end">
              <NewPostForm onPostCreated={refreshContent} />
            </div>
          )}
          {children}
        </main>
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default MainLayout;
