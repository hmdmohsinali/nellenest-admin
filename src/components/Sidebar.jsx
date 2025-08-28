import React from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  HomeIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, onTabChange, onLogout, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'analytics', label: 'Courses', icon: ChartBarIcon },
    { id: 'settings', label: 'Meditations', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-xl
        flex flex-col
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Logo/Brand */}
        <div className="px-6 pb-6 border-b border-slate-700">
          <h1 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Nellenest Admin
          </h1>
          <p className="text-slate-400 text-xs lg:text-sm mt-1">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
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
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all duration-200 border border-red-500/30"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium text-sm lg:text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;