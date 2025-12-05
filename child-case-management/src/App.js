import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterCasePage from './pages/Cases/RegisterCasePage';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Route */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Register Case */}
          <Route
            path="/cases/register"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RegisterCasePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
