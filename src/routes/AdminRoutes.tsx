import { Routes, Route } from "react-router";
import Dashboard from "../pages/admin/Dashboard";
import Events from "../pages/admin/Events";
import NewEvent from "../pages/admin/NewEvent";
import EventDetails from "../pages/admin/EventDetails";
import Providers from "../pages/admin/Providers";
import NewProvider from "../pages/admin/NewProvider";
import ProviderDetails from "../pages/admin/ProviderDetails";
import AdminSettings from "../pages/admin/Settings";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="events" element={<Events />} />
      <Route path="events/new" element={<NewEvent />} />
      <Route path="events/:id" element={<EventDetails />} />
      <Route path="providers" element={<Providers />} />
      <Route path="providers/new" element={<NewProvider />} />
      <Route path="providers/:id" element={<ProviderDetails />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
