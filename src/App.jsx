import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
