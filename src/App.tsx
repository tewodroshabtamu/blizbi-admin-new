import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PublicProtectedRoute from "./components/PublicProtectedRoute";
import Redirect from "./pages/public/Redirect";

const App = () => (
  <Routes>
    <Route path="/redirect" element={<Redirect />} />
    <Route
      path="/admin/*"
      element={
        <AdminProtectedRoute>
          <AdminRoutes />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/*"
      element={
        <PublicProtectedRoute>
          <PublicRoutes />
        </PublicProtectedRoute>
      }
    />
  </Routes>
);

export default App;
