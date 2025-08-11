import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import UsersContent from './components/UsersContent';
import AnalyticsContent from './components/AnalyticsContent';
import SettingsContent from './components/SettingsContent';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    alert('Logout functionality would be implemented here');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
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
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header onSidebarToggle={handleSidebarToggle} />
        
        {/* Page Content */}
        <main className="pt-20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
