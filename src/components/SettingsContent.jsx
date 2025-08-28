import React from 'react';

const SettingsContent = () => {
  return (
    <div className="py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Meditations</h1>
        <p className="text-sm sm:text-base text-slate-600">Manage meditation-related settings and content (coming soon)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-slate-800 font-semibold text-lg mb-2">No meditations to display yet</div>
          <p className="text-slate-600 text-sm mb-6">We’re working on this section. You’ll be able to manage meditations here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
