import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Global Styles
import './theme.css';
import './index.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import RoleProtectedRoute from './layouts/RoleProtectedRoute';

// Pages (Public)
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import CompanyAdminSignup from './pages/company/CompanyAdminSignup';

// Pages (User Role)
import UserDashboard from './pages/user/UserDashboard';
import CompanyDetails from './pages/user/CompanyDetails';
import BookToken from './pages/user/BookToken';
import Profile from './pages/user/Profile';

// Pages (Company Admin Role)
import CompanyDashboard from './pages/company/CompanyDashboard';
import ManageServices from './pages/company/ManageServices';
import AddService from './pages/company/AddService';
import CompanyAnalytics from './pages/company/CompanyAnalytics';
import QueueCustomers from './pages/company/QueueCustomers';
import CompanyProfile from './pages/company/CompanyProfile';
import QueueManagement from './pages/company/QueueManagement';

// Pages (Super Admin Role)
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CompaniesManagement from './pages/admin/CompaniesManagement';
import TokensManagement from './pages/admin/TokensManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Error Pages
import NotFound from './pages/error/NotFound';
import ErrorBoundary from './pages/error/ErrorBoundary';

// Context Provider
import AuthProvider from './components/AuthProvider';

// Confirm Modal
import ConfirmModal from './components/confirmModal/ConfirmModal';
import { useConfirmModal } from './components/confirmModal/useConfirmModal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, // Standalone, no layout wrapper
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'signup/company-admin', element: <CompanyAdminSignup /> },
    ],
  },
  // Redirect old auth routes to new paths
  { path: '/login', element: <Navigate to="/auth/login" replace /> },
  { path: '/signup', element: <Navigate to="/auth/signup" replace /> },
  { path: '/forgot-password', element: <Navigate to="/auth/forgot-password" replace /> },
  { path: '/signup/company-admin', element: <Navigate to="/auth/signup/company-admin" replace /> },
  {
    path: '/user',
    element: <RoleProtectedRoute requiredRoles={['USER']} />,
    children: [
      {
        path: '',
        element: <AppLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: 'dashboard', element: <UserDashboard /> },
          { path: 'company/:companyId', element: <CompanyDetails /> },
          { path: 'book-token', element: <BookToken /> },
          { path: 'profile', element: <Profile /> },
        ]
      }
    ]
  },
  {
    path: '/company',
    element: <RoleProtectedRoute requiredRoles={['COMPANY_ADMIN']} />,
    children: [
      {
        path: '',
        element: <AppLayout />,
        children: [
          { index: true, element: <CompanyDashboard /> },
          { path: 'dashboard', element: <CompanyDashboard /> },
          { path: 'manage-services', element: <ManageServices /> },
          { path: 'add-service', element: <AddService /> },
          { path: 'edit-service/:serviceId', element: <AddService /> },
          { path: 'analytics', element: <CompanyAnalytics /> },
          { path: 'queue/:serviceId', element: <QueueCustomers /> },
          { path: 'queue-management', element: <QueueManagement /> },
          { path: 'profile-settings', element: <CompanyProfile /> },
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: <RoleProtectedRoute requiredRoles={['SUPER_ADMIN']} />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <UsersManagement /> },
          { path: 'companies', element: <CompaniesManagement /> },
          { path: 'tokens', element: <TokensManagement /> },
          { path: 'settings', element: <SystemSettings /> },
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  const { ConfirmModalProps } = useConfirmModal();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
        <ConfirmModal {...ConfirmModalProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

