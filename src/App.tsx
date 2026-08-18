import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { FullPageSpinner } from '@/components/ui/LoadingStates';
import type { ReactNode } from 'react';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import LectureLibraryPage from '@/pages/LectureLibraryPage';
import LecturePlayerPage from '@/pages/LecturePlayerPage';
import NotesPage from '@/pages/NotesPage';
import SubjectsPage from '@/pages/SubjectsPage';
import CollectionsPage from '@/pages/CollectionsPage';
import RevisionPage from '@/pages/RevisionPage';
import StudySessionsPage from '@/pages/StudySessionsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/lectures"
        element={<ProtectedRoute><AppLayout><LectureLibraryPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/lectures/:id"
        element={<ProtectedRoute><AppLayout><LecturePlayerPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/notes"
        element={<ProtectedRoute><AppLayout><NotesPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/subjects"
        element={<ProtectedRoute><AppLayout><SubjectsPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/collections"
        element={<ProtectedRoute><AppLayout><CollectionsPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/revision"
        element={<ProtectedRoute><AppLayout><RevisionPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/sessions"
        element={<ProtectedRoute><AppLayout><StudySessionsPage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
