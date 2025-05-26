import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import NannyListPage from '../pages/NannyListPage';
import NannyProfilePage from '../pages/NannyProfilePage';
import DashboardPage from '../pages/DashboardPage';
import MessagesPage from '../pages/MessagesPage';
import BookingsPage from '../pages/BookingsPage';
import ReviewsPage from '../pages/ReviewsPage';
import { useAuthStore } from '../store/auth';

const Routes: React.FC = () => {
  const { isLoading, user } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'signin',
          element: user ? <Navigate to="/dashboard" /> : <AuthPage />,
        },
        {
          path: 'signup',
          element: user ? <Navigate to="/dashboard" /> : <AuthPage />,
        },
        {
          path: 'nannies',
          element: <NannyListPage />,
        },
        {
          path: 'nannies/:id',
          element: <NannyProfilePage />,
        },
        {
          path: 'dashboard',
          element: user ? <DashboardPage /> : <Navigate to="/signin" />,
        },
        {
          path: 'messages',
          element: user ? <MessagesPage /> : <Navigate to="/signin" />,
        },
        {
          path: 'messages/:userId',
          element: user ? <MessagesPage /> : <Navigate to="/signin" />,
        },
        {
          path: 'bookings',
          element: user ? <BookingsPage /> : <Navigate to="/signin" />,
        },
        {
          path: 'reviews',
          element: user ? <ReviewsPage /> : <Navigate to="/signin" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;