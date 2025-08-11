import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

const AnalyticsContent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock analytics data - replace with real data later
  const metrics = [
    { 
      name: 'Total Views', 
      value: '89,400', 
      change: '+12.5%', 
      changeType: 'positive',
      icon: EyeIcon,
      color: 'blue'
    },
    { 
      name: 'Unique Users', 
      value: '23,500', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'green'
    },
    { 
      name: 'Revenue', 
      value: '$156,000', 
      change: '+23.1%', 
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'purple'
    },
    { 
      name: 'Conversions', 
      value: '2,847', 
      change: '-2.4%', 
      changeType: 'negative',
      icon: ShoppingCartIcon,
      color: 'orange'
    }
  ];

  const chartData = [
    { date: 'Mon', views: 12000, users: 3200, revenue: 28000 },
    { date: 'Tue', views: 15000, users: 3800, revenue: 32000 },
    { date: 'Wed', views: 18000, users: 4200, revenue: 38000 },
    { date: 'Thu', views: 22000, users: 4800, revenue: 45000 },
    { date: 'Fri', views: 25000, users: 5200, revenue: 52000 },
    { date: 'Sat', views: 28000, users: 5800, revenue: 58000 },
    { date: 'Sun', views: 30000, users: 6200, revenue: 65000 }
  ];

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (type) => {
    return type === 'positive' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">Track your key performance metrics and user behavior</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg w-fit">
          {['1d', '7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedPeriod === period
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === '1d' ? '24 Hours' : 
               period === '7d' ? '7 Days' : 
               period === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.changeType);
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${getColorClasses(metric.color)} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${getColorClasses(metric.color)}`} />
                </div>
                <div className="flex items-center space-x-1">
                  <ChangeIcon className={`w-4 h-4 ${getChangeColor(metric.changeType)}`} />
                  <span className={`text-xs sm:text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">{metric.name}</h3>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {/* Views Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Page Views</h3>
          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xs sm:text-sm text-slate-500 w-8 sm:w-12 flex-shrink-0">{data.date}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.views / 30000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 w-12 sm:w-16 text-right flex-shrink-0">
                  {data.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Unique Users</h3>
          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xs sm:text-sm text-slate-500 w-8 sm:w-12 flex-shrink-0">{data.date}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.users / 6200) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 w-12 sm:w-16 text-right flex-shrink-0">
                  {data.users.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Top Performing Content</h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { title: 'Homepage', views: 45000, engagement: '8.2%', trend: '+12%' },
            { title: 'Product Catalog', views: 32000, engagement: '6.8%', trend: '+8%' },
            { title: 'About Us', views: 28000, engagement: '5.4%', trend: '+15%' },
            { title: 'Contact Page', views: 22000, engagement: '4.2%', trend: '+3%' },
            { title: 'Blog Post #1', views: 18000, engagement: '7.1%', trend: '+22%' }
          ].map((content, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800 text-sm sm:text-base truncate">{content.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 truncate">Engagement: {content.engagement}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-medium text-slate-800 text-sm sm:text-base">{content.views.toLocaleString()} views</p>
                <p className="text-xs sm:text-sm text-green-600">{content.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;
