import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessorDashboard from './pages/ProfessorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/professor/dashboard'} replace />
          : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/professor/dashboard'} replace />
          : <Register />
      } />

      {/* Professor routes */}
      <Route element={
        <ProtectedRoute requiredRole="PROFESSOR">
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/calendar" element={
          <div className="text-center py-20 text-gray-400">Booking Calendar — Coming Soon</div>
        } />
      </Route>

      {/* Admin routes */}
      <Route element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={
          <div className="text-center py-20 text-gray-400">Manage Rooms — Coming Soon</div>
        } />
        <Route path="/admin/datashows" element={
          <div className="text-center py-20 text-gray-400">Manage DataShows — Coming Soon</div>
        } />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/professor/dashboard'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default App;
