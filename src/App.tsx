import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const App = () => (
  <Routes>
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
);

export default App;
