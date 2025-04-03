
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileNavbar from '@/components/MobileNavbar';

interface MainLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  onCategoryChange?: (category: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  onRefresh, 
  onCategoryChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={toggleSidebar} 
        onCategoryChange={onCategoryChange}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={toggleSidebar} 
          onRefresh={onRefresh}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>

        {/* Mobile navigation */}
        <MobileNavbar />
      </div>
    </div>
  );
};

export default MainLayout;
