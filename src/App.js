import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import LandingPage from './components/public/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import ContentForm from './components/content/ContentForm';
import ContentView from './components/content/ContentView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ContentProvider>
      <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/content/:id" element={<ContentView />} />

              {/* Protected user routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content/new"
                element={
                  <ProtectedRoute>
                    <ContentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content/edit/:id"
                element={
                  <ProtectedRoute>
                    <ContentForm />
                  </ProtectedRoute>
                }
              />

              {/* Protected admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                  <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          </Router>
        </ContentProvider>
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;