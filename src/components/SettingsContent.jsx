import React, { useState } from 'react';
import { 
  BellIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  UserIcon,
  KeyIcon,
  Cog6ToothIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const SettingsContent = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true
  });

  const [theme, setTheme] = useState('light');

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm sm:text-base">{label}</p>
        {description && <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0 ml-3 ${
          enabled ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage your account preferences and system settings</p>
      </div>

      {/* Profile Settings */}
      <SettingSection 
        title="Profile Settings" 
        description="Update your personal information and account details"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                Change Avatar
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Notification Preferences */}
      <SettingSection 
        title="Notification Preferences" 
        description="Choose how you want to receive notifications"
      >
        <div className="space-y-2">
          <ToggleSwitch
            enabled={notifications.email}
            onChange={() => handleNotificationChange('email')}
            label="Email Notifications"
            description="Receive important updates via email"
          />
          <ToggleSwitch
            enabled={notifications.push}
            onChange={() => handleNotificationChange('push')}
            label="Push Notifications"
            description="Get instant notifications in your browser"
          />
          <ToggleSwitch
            enabled={notifications.sms}
            onChange={() => handleNotificationChange('sms')}
            label="SMS Notifications"
            description="Receive critical alerts via SMS"
          />
          <ToggleSwitch
            enabled={notifications.marketing}
            onChange={() => handleNotificationChange('marketing')}
            label="Marketing Communications"
            description="Receive updates about new features and promotions"
          />
        </div>
      </SettingSection>

      {/* Privacy & Security */}
      <SettingSection 
        title="Privacy & Security" 
        description="Control your privacy settings and security preferences"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          
          <ToggleSwitch
            enabled={privacy.dataSharing}
            onChange={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
            label="Data Sharing"
            description="Allow us to share anonymized data for research purposes"
          />
          
          <ToggleSwitch
            enabled={privacy.analytics}
            onChange={() => handlePrivacyChange('analytics', !privacy.analytics)}
            label="Analytics & Performance"
            description="Help us improve by sharing usage analytics"
          />
        </div>
      </SettingSection>

      {/* Appearance */}
      <SettingSection 
        title="Appearance" 
        description="Customize the look and feel of your dashboard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
            <div className="flex flex-wrap gap-3">
              {['light', 'dark', 'auto'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                    theme === themeOption
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingSection>

      {/* System Settings */}
      <SettingSection 
        title="System Settings" 
        description="Advanced configuration options"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Cog6ToothIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-800 text-sm sm:text-base">Auto-save</p>
                <p className="text-xs sm:text-sm text-slate-500">Automatically save your changes</p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium flex-shrink-0">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-800 text-sm sm:text-base">Two-Factor Authentication</p>
                <p className="text-xs sm:text-sm text-slate-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm font-medium flex-shrink-0">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <KeyIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-800 text-sm sm:text-base">API Keys</p>
                <p className="text-xs sm:text-sm text-slate-500">Manage your API access keys</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex-shrink-0">
              Manage
            </button>
          </div>
        </div>
      </SettingSection>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button className="w-full sm:w-auto px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-sm font-medium">
          Cancel
        </button>
        <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium">
          <CheckIcon className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsContent;
