import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import { USER_ROLES } from '../utils/constants';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import RegisterCasePage from '../pages/Cases/RegisterCasePage';
import CaseListPage from '../pages/Cases/CaseListPage';
import CaseDetailsPage from '../pages/Cases/CaseDetailsPage';
import SearchCasesPage from '../pages/Cases/SearchCasesPage';
import UserManagementPage from '../pages/Users/UserManagementPage';
import ProfilePage from '../pages/Users/ProfilePage';
import GenerateReportPage from '../pages/Reports/GenerateReportPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON]}>
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/cases/register" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.FOCAL_PERSON]}>
          <MainLayout>
            <RegisterCasePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/cases" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR]}>
          <MainLayout>
            <CaseListPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/cases/:id" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON]}>
          <MainLayout>
            <CaseDetailsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/cases/search" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON]}>
          <MainLayout>
            <SearchCasesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN]}>
          <MainLayout>
            <UserManagementPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR]}>
          <MainLayout>
            <GenerateReportPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirect root to landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Catch all - redirect to landing */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;