import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { useThemeStore } from './context/themeStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import InterviewerDetailPage from './pages/candidate/InterviewerDetailPage';
import InterviewerDashboard from './pages/interviewer/InterviewerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileCompletion from './pages/ProfileCompletion';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';
import ThemeProvider from './components/ThemeProvider';
import DebugAuth from './components/DebugAuth';

function App() {
  const { isAuthenticated, user, isProfileComplete } = useAuthStore();
  const { theme } = useThemeStore();

  return (
    <ThemeProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Router>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
                } 
              />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  {user?.role === 'candidate' && <CandidateDashboard />}
                  {user?.role === 'recruiter' && <InterviewerDashboard />}
                  {user?.role === 'admin' && <AdminDashboard />}
                </ProtectedRoute>
              } />

              {/* Profile completion route */}
              <Route path="/complete-profile" element={
                <AuthRoute>
                  <ProfileCompletion />
                </AuthRoute>
              } />

              {/* Interviewer detail route */}
              <Route path="/interviewer/:interviewerId" element={
                <ProtectedRoute>
                  <InterviewerDetailPage />
                </ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
          <DebugAuth />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
