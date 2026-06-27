import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  db,
  type AdminUser,
  type RegisteredUser,
  type AdminOrder,
  type CMSPage,
  type AdminSettings,
  type Product,
} from '../data/db';

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── Context shape ────────────────────────────────────────────────────────────
interface AdminContextType {
  // Auth
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  // Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: RegisteredUser[];
  setUsers: React.Dispatch<React.SetStateAction<RegisteredUser[]>>;
  orders: AdminOrder[];
  setOrders: React.Dispatch<React.SetStateAction<AdminOrder[]>>;
  pages: CMSPage[];
  setPages: React.Dispatch<React.SetStateAction<CMSPage[]>>;
  adminSettings: AdminSettings;
  setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  // Actions
  clearAllData: () => Promise<void>;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: number) => void;
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

  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [users, setUsers] = useState<RegisteredUser[]>(() => db.getUsers());
  const [orders, setOrders] = useState<AdminOrder[]>(() => db.getOrders());
  const [pages, setPages] = useState<CMSPage[]>(() => db.getPages());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => db.getSettings());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // ── Persist to localStorage whenever context state changes ──────────────────
  useEffect(() => { db.saveProducts(products); }, [products]);
  useEffect(() => { db.saveUsers(users); }, [users]);
  useEffect(() => { db.saveOrders(orders); }, [orders]);
  useEffect(() => { db.savePages(pages); }, [pages]);
  useEffect(() => { db.saveSettings(adminSettings); }, [adminSettings]);

  // ── Sync state when another tab/window changes localStorage ─────────────────
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(db.getProducts());
      setUsers(db.getUsers());
      setOrders(db.getOrders());
      setPages(db.getPages());
      setAdminSettings(db.getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ── Toast helpers ────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────
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

  // ── Clear All Data ────────────────────────────────────────────────────────────
  // Atomic reset: clears only application data, preserves auth session.
  // Updates every piece of shared context state in one synchronous batch
  // so every subscribed page re-renders simultaneously.
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      // 1. Atomic localStorage wipe + re-seed (returns initial datasets)
      const initial = db.clearAll();

      // 2. Update all context state in one render cycle
      setProducts(initial.products);
      setUsers(initial.users);
      setOrders(initial.orders);
      setPages(initial.pages);
      setAdminSettings(initial.settings);

      // 3. Success feedback
      showToast('Application data cleared successfully.', 'success');
    } catch (err) {
      console.error('clearAllData failed:', err);
      showToast('Failed to clear data. Please try again.', 'error');
      throw err; // re-throw so caller can handle loading state
    }
  }, [showToast]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAdminLoggedIn: admin !== null,
        adminLogin,
        adminLogout,
        products,
        setProducts,
        users,
        setUsers,
        orders,
        setOrders,
        pages,
        setPages,
        adminSettings,
        setAdminSettings,
        clearAllData,
        toasts,
        showToast,
        dismissToast,
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
