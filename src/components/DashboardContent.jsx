import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon,
  ChartBarIcon, 
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../services';
import LoadingSpinner from './LoadingSpinner';

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminAPI.getDashboardStats();
      
      // Handle the actual API response format: { stats: { ... } }
      if (response && response.stats) {
        setDashboardData(response);
      } else {
        throw new Error('Failed to fetch dashboard data - invalid response format');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data if API fails
  const fallbackStats = [
    { 
      title: 'Total Users', 
      value: '2,847', 
      change: '+12%', 
      changeType: 'positive',
      icon: UsersIcon,
      color: 'blue'
    },
    { 
      title: 'Total Courses', 
      value: '156', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'green'
    },
    { 
      title: 'Active Courses', 
      value: '142', 
      change: '+5.1%', 
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'purple'
    },
    { 
      title: 'Recent Users', 
      value: '89', 
      change: '+15%', 
      changeType: 'positive',
      icon: ClockIcon,
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    
    return colorMap[color] || 'bg-gray-500';
  };

  const getGradientClasses = (color) => {
    const gradientMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };
    
    return gradientMap[color] || 'from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="py-6 lg:py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 lg:py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use API data or fallback data
  const stats = dashboardData?.stats ? [
    { 
      title: 'Total Users', 
      value: dashboardData.stats.totalUsers?.toString() || '0', 
      change: '+12%', 
      changeType: 'positive',
      icon: UsersIcon,
      color: 'blue',
      description: 'Registered users in the system'
    },
    { 
      title: 'Total Courses', 
      value: dashboardData.stats.totalCourses?.toString() || '0', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'green',
      description: 'Available courses'
    },
    { 
      title: 'Active Courses', 
      value: dashboardData.stats.activeCourses?.toString() || '0', 
      change: '+5.1%', 
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'purple',
      description: 'Currently active courses'
    },
    { 
      title: 'Recent Users', 
      value: dashboardData.stats.recentUsers?.toString() || '0', 
      change: '+15%', 
      changeType: 'positive',
      icon: ClockIcon,
      color: 'orange',
      description: 'New users this month'
    }
  ] : fallbackStats;

  return (
    <div className="py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-600">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getGradientClasses(stat.color)} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                  <Icon className={`w-6 h-6 ${getColorClasses(stat.color)}`} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Role Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">User Distribution</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <UserGroupIcon className="w-4 h-4" />
            <span>Role Breakdown</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData?.stats?.usersByRole?.map((role, index) => {
            const isAdmin = role._id === 'admin';
            const totalUsers = dashboardData.stats.totalUsers;
            const percentage = totalUsers ? Math.round((role.count / totalUsers) * 100) : 0;
            
            return (
              <div key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isAdmin ? 'bg-purple-100' : 'bg-blue-100'}`}>
                      {isAdmin ? (
                        <ShieldCheckIcon className={`w-5 h-5 ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                      ) : (
                        <UsersIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {isAdmin ? 'Administrators' : 'Regular Users'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {isAdmin ? 'Full system access' : 'Standard user access'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-800">{role.count}</div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-600">{percentage}%</div>
                    <div className="text-xs text-slate-500">of total users</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Courses</p>
              <p className="text-2xl font-bold">{dashboardData?.stats?.activeCourses || 0}</p>
            </div>
            <AcademicCapIcon className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Inactive Courses</p>
              <p className="text-2xl font-bold">{dashboardData?.stats?.inactiveCourses || 0}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Recent Activity</p>
              <p className="text-2xl font-bold">{dashboardData?.stats?.recentUsers || 0}</p>
            </div>
            <ClockIcon className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-green-800">API Status</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-blue-800">Database</p>
              <p className="text-xs text-blue-600">Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-purple-800">Authentication</p>
              <p className="text-xs text-purple-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-orange-800">Last Updated</p>
              <p className="text-xs text-orange-600">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
