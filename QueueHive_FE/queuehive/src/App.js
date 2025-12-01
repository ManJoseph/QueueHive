import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Global Styles
import './theme.css';
import './index.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
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

// Pages (Super Admin Role)
import AdminDashboard from './pages/admin/AdminDashboard';

// Error Pages
import NotFound from './pages/error/NotFound';
import ErrorBoundary from './pages/error/ErrorBoundary';

// Context Provider
import AuthProvider from './components/AuthProvider';


const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'company-admin-signup', element: <CompanyAdminSignup /> },
    ],
  },
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
          { path: 'company/:id', element: <CompanyDetails /> },
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
                { path: 'profile-settings', element: <p>Company Profile Settings (TODO)</p> },
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
            element: <AppLayout />,
            children: [
                { index: true, element: <AdminDashboard /> },
                { path: 'dashboard', element: <AdminDashboard /> },
            ]
        }
    ]
  },
  {
    path: '*', // Wildcard route for 404
    element: <NotFound />
  }
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

