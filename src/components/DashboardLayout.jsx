import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import UsersContent from './UsersContent';
import AnalyticsContent from './AnalyticsContent';
import SettingsContent from './SettingsContent';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
      
      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Header */}
        <Header onSidebarToggle={handleSidebarToggle} />
        
        {/* Page Content */}
        <main className="pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
