import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { db, type AdminUser, type RegisteredUser, type AdminOrder, type CMSPage, type AdminSettings } from '../data/db';

interface AdminContextType {
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  users: RegisteredUser[];
  setUsers: React.Dispatch<React.SetStateAction<RegisteredUser[]>>;
  orders: AdminOrder[];
  setOrders: React.Dispatch<React.SetStateAction<AdminOrder[]>>;
  pages: CMSPage[];
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  adminSettings: AdminSettings;
  setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  clearAllData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const MOCK_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Dr. Rajesh Kumar',
  email: 'admin@heartpharma.com',
  role: 'super_admin',
  joinedDate: 'Jan 2023',
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('hp_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<RegisteredUser[]>(() => db.getUsers());
  const [orders, setOrders] = useState<AdminOrder[]>(() => db.getOrders());
  const [pages, setPages] = useState<CMSPage[]>(() => db.getPages());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => db.getSettings());

  // Keep state synced with localStorage
  useEffect(() => {
    db.saveUsers(users);
  }, [users]);

  useEffect(() => {
    db.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    db.savePages(pages);
  }, [pages]);

  useEffect(() => {
    db.saveSettings(adminSettings);
  }, [adminSettings]);

  // Sync state across storage events (for instance, when a user checkouts in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setUsers(db.getUsers());
      setOrders(db.getOrders());
      setPages(db.getPages());
      setAdminSettings(db.getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAdminLoggedIn = admin !== null;

  const adminLogin = useCallback((email: string, password: string): boolean => {
    if (email === 'admin@heartpharma.com' && password === 'admin123') {
      setAdmin(MOCK_ADMIN);
      localStorage.setItem('hp_admin_session', JSON.stringify(MOCK_ADMIN));
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('hp_admin_session');
  }, []);

  const clearAllData = useCallback(() => {
    // Only clear data keys — never touch the admin session
    ['hp_products', 'hp_users', 'hp_orders', 'hp_pages', 'hp_settings'].forEach((k) =>
      localStorage.removeItem(k)
    );
    // Re-seed defaults from db (which returns INITIAL_* when key is absent)
    setUsers(db.getUsers());
    setOrders(db.getOrders());
    setPages(db.getPages());
    setAdminSettings(db.getSettings());
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        users,
        setUsers,
        orders,
        setOrders,
        pages,
        setPages,
        adminSettings,
        setAdminSettings,
        clearAllData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
