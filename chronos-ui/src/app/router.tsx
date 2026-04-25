import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthGuard } from '../features/auth/components/AuthGuard';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { JobsPage } from '../features/jobs/pages/JobsPage';
import { JobDetailsPage } from '../features/jobs/pages/JobDetailsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { AppShell } from '../components/layout/AppShell';

const ProtectedLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/jobs',
            element: <JobsPage />,
          },
          {
            path: '/jobs/:jobId',
            element: <JobDetailsPage />,
          },
          {
            path: '/notifications',
            element: <NotificationsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
