import React from 'react';
import { 
  UsersIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const DashboardContent = () => {
  // Mock data - replace with real data later
  const stats = [
    { 
      title: 'Total Users', 
      value: '2,847', 
      change: '+12%', 
      changeType: 'positive',
      icon: UsersIcon,
      color: 'blue'
    },
    { 
      title: 'Revenue', 
      value: '$45,231', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    { 
      title: 'Active Sessions', 
      value: '1,234', 
      change: '-2.1%', 
      changeType: 'negative',
      icon: ChartBarIcon,
      color: 'purple'
    },
    { 
      title: 'Issues', 
      value: '23', 
      change: '+5', 
      changeType: 'warning',
      icon: ExclamationTriangleIcon,
      color: 'red'
    }
  ];

  const getColorClasses = (color, type) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500'
    };
    
    return colorMap[color] || 'bg-gray-500';
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{stat.value}</p>
                  <p className={`text-xs sm:text-sm font-medium ${getChangeColor(stat.changeType)} truncate`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${getColorClasses(stat.color)} bg-opacity-10 flex-shrink-0 ml-3`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${getColorClasses(stat.color)}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {[
            { action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
            { action: 'Payment received', user: 'jane.smith@example.com', time: '15 minutes ago', type: 'payment' },
            { action: 'Support ticket created', user: 'mike.wilson@example.com', time: '1 hour ago', type: 'support' },
            { action: 'System update completed', user: 'System', time: '2 hours ago', type: 'system' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                activity.type === 'user' ? 'bg-blue-500' :
                activity.type === 'payment' ? 'bg-green-500' :
                activity.type === 'support' ? 'bg-yellow-500' : 'bg-purple-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{activity.action}</p>
                <p className="text-xs text-slate-500 truncate">{activity.user}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
