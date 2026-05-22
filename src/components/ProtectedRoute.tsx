import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, userOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-sky-600 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User access requested but account role is admin
  if (userOnly && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Admin access requested but account role is traditional user
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-rose-100 rounded-3xl shadow-sm text-center">
        <div className="inline-flex p-3 bg-rose-50 rounded-2xl text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-950 mb-2">Access Unauthorized</h2>
        <p className="text-sm text-gray-500 leading-normal mb-6">
          The view you are trying as an active user contains protected administrative parameters. Please log out and sign in with a registered admin console credential.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
}
