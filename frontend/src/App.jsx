import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import ProfessorSchedule from "./pages/professor/ProfessorSchedule";
import ProfessorBook from "./pages/professor/ProfessorBook";
import ProfessorReservations from "./pages/professor/ProfessorReservations";
import ProfessorClaims from "./pages/professor/ProfessorClaims";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminWeeks from "./pages/admin/AdminWeeks";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminReservations from "./pages/admin/AdminReservations";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === "ADMIN"
                  ? "/admin/overview"
                  : "/professor/dashboard"
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === "ADMIN"
                  ? "/admin/overview"
                  : "/professor/dashboard"
              }
              replace
            />
          ) : (
            <Register />
          )
        }
      />

      {/* Professor routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="PROFESSOR">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/schedule" element={<ProfessorSchedule />} />
        <Route path="/professor/book" element={<ProfessorBook />} />
        <Route
          path="/professor/reservations"
          element={<ProfessorReservations />}
        />
        <Route path="/professor/claims" element={<ProfessorClaims />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/overview" element={<AdminOverview />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/maintenance" element={<AdminMaintenance />} />
        <Route path="/admin/claims" element={<AdminClaims />} />
        <Route path="/admin/weeks" element={<AdminWeeks />} />
        <Route path="/admin/sessions" element={<AdminSessions />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
      </Route>

      {/* Default redirect */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === "ADMIN"
                  ? "/admin/overview"
                  : "/professor/dashboard"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
