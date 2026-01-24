import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { Login } from "./pages/Login";
import { AdminSetup } from "./components/AdminSetup";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<AdminSetup />} />
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminRoutes />
          </AdminProtectedRoute>
        }
      />
      <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
