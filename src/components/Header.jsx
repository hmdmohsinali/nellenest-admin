import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Header = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [notifications] = useState([
    { id: 1, message: 'New user registration', time: '2 minutes ago', unread: true },
    { id: 2, message: 'System update completed', time: '1 hour ago', unread: true },
    { id: 3, message: 'Payment received', time: '3 hours ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 fixed top-0 right-0 left-0 lg:left-64 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - Search and Menu Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
          
          {/* Search - Hidden on very small screens, visible on sm and up */}
          <div className="hidden sm:block relative flex-1 max-w-xs lg:max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications and User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 relative">
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-2 border-b border-slate-200">
                <h3 className="font-medium text-slate-800 text-sm sm:text-base">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors duration-200 ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.unread ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-200">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User info - Hidden on very small screens */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-800 truncate max-w-24 lg:max-w-32">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate max-w-24 lg:max-w-32">{user?.role || 'User'}</p>
            </div>
            
            <div className="relative group">
              <button className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
                <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              
              {/* User Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                    Account Preferences
                  </button>
                </div>
                <div className="py-1 border-t border-slate-200">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Visible only on very small screens */}
      <div className="sm:hidden mt-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
