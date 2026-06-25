import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAddPagePage from './pages/AdminAddPagePage';
import AdminCMSPageEditor from './pages/AdminCMSPageEditor';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useAdmin();
  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminOverviewPage />} />
                <Route path="/products" element={<AdminProductsPage />} />
                <Route path="/orders" element={<AdminOrdersPage />} />
                <Route path="/users" element={<AdminUsersPage />} />
                <Route path="/settings" element={<AdminSettingsPage />} />
                <Route path="/pages/new" element={<AdminAddPagePage />} />
                <Route path="/pages/:slug" element={<AdminCMSPageEditor />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <AdminProvider>
        <AdminRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}
