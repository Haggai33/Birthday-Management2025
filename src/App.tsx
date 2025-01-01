import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BirthdayProvider } from './context/BirthdayContext';
import { GeltProvider } from './context/GeltContext';
import { initializeFirebaseCollections } from './services/firebase/setup';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GeltDashboard from './pages/GeltDashboard';
import BirthdayForm from './pages/BirthdayForm';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BirthdayProvider>
          <GeltProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="gelt" element={
                    <PrivateRoute>
                      <GeltDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="add" element={
                    <PrivateRoute>
                      <BirthdayForm />
                    </PrivateRoute>
                  } />
                  <Route path="edit/:id" element={
                    <PrivateRoute>
                      <BirthdayForm />
                    </PrivateRoute>
                  } />
                  <Route path="admin" element={
                    <PrivateRoute>
                      <AdminPanel />
                    </PrivateRoute>
                  } />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </GeltProvider>
        </BirthdayProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;