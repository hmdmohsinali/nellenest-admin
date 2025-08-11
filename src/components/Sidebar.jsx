import React from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  HomeIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white h-screen fixed left-0 top-0 shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Nellenest Admin
        </h1>
        <p className="text-slate-400 text-sm mt-1">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all duration-200 border border-red-500/30"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;