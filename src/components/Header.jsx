import React, { useState } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Header = ({ onSidebarToggle }) => {
  const [notifications] = useState([
    { id: 1, message: 'New user registration', time: '2 minutes ago', unread: true },
    { id: 2, message: 'System update completed', time: '1 hour ago', unread: true },
    { id: 3, message: 'Payment received', time: '3 hours ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - Search and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 relative">
              <BellIcon className="w-6 h-6 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 hidden group-hover:block">
              <div className="px-4 py-2 border-b border-slate-200">
                <h3 className="font-medium text-slate-800">Notifications</h3>
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
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
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
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
