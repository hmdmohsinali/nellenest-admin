import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import UsersContent from './UsersContent';
import AnalyticsContent from './AnalyticsContent';
import SettingsContent from './SettingsContent';
import SleepSongsContent from './SleepSongsContent';
import MusicsContent from './MusicsContent';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug function to check localStorage
  const debugAuth = () => {
    console.log('=== DEBUG AUTH ===');
    console.log('localStorage authToken:', localStorage.getItem('authToken'));
    console.log('localStorage userData:', localStorage.getItem('userData'));
    console.log('Context isAuthenticated:', isAuthenticated);
    console.log('Context user:', user);
    console.log('Context token:', token);
    console.log('==================');
  };

  // Call debug function on mount
  React.useEffect(() => {
    debugAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Debug Panel - Remove this in production */}
      <div className="bg-yellow-100 p-2 text-xs border-b">
        <button 
          onClick={debugAuth}
          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
        >
          Debug Auth
        </button>
        <span className="mr-2">Auth: {isAuthenticated ? '✅' : '❌'}</span>
        <span className="mr-2">Token: {token ? '✅' : '❌'}</span>
        <span className="mr-2">User: {user ? '✅' : '❌'}</span>
        <span>Path: {location.pathname}</span>
      </div>

      <Header onSidebarToggle={() => setSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={() => logout()}
        activeTab={location.pathname.includes('/users') ? 'users' : 
                   location.pathname.includes('/analytics') ? 'analytics' : 
                   location.pathname.includes('/settings') ? 'settings' :
                   location.pathname.includes('/sleep-songs') ? 'sleep-songs' :
                   location.pathname.includes('/musics') ? 'musics' : 'dashboard'}
        onTabChange={(tab) => {
          // Navigate to the appropriate route
          switch (tab) {
            case 'dashboard':
              navigate('/dashboard');
              break;
            case 'users':
              navigate('/dashboard/users');
              break;
            case 'analytics':
              navigate('/dashboard/analytics');
              break;
            case 'settings':
              navigate('/dashboard/settings');
              break;
            case 'sleep-songs':
              navigate('/dashboard/sleep-songs');
              break;
            case 'musics':
              navigate('/dashboard/musics');
              break;
            default:
              navigate('/dashboard');
          }
          // Close sidebar on mobile after navigation
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
      />
      
      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/users" element={<UsersContent />} />
            <Route path="/analytics" element={<AnalyticsContent />} />
            <Route path="/settings" element={<SettingsContent />} />
            <Route path="/sleep-songs" element={<SleepSongsContent />} />
            <Route path="/musics" element={<MusicsContent />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
