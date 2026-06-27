import { defaultProducts, type Product } from './products';

export type { Product };

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar?: string;
  joinedDate: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  orders: number;
  totalSpent: number;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  type: 'cookies' | 'privacy' | 'terms' | 'about' | 'custom';
}

export interface AdminSettings {
  name: string;
  email: string;
  phone: string;
  notifyOrders: boolean;
  notifyUsers: boolean;
  notifyStock: boolean;
  twoFactor: boolean;
}

export const INITIAL_USERS: RegisteredUser[] = [
  { id: 'usr-001', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 98765 43210', status: 'active', joinedDate: 'Mar 15, 2024', orders: 12, totalSpent: 4580 },
  { id: 'usr-002', name: 'Amit Patel', email: 'amit.p@outlook.com', phone: '+91 87654 32109', status: 'active', joinedDate: 'Apr 02, 2024', orders: 8, totalSpent: 3210 },
  { id: 'usr-003', name: 'Sneha Reddy', email: 'sneha.r@yahoo.com', phone: '+91 76543 21098', status: 'pending', joinedDate: 'Jun 18, 2024', orders: 0, totalSpent: 0 },
  { id: 'usr-004', name: 'Vikram Singh', email: 'vikram.s@gmail.com', phone: '+91 65432 10987', status: 'active', joinedDate: 'Feb 10, 2024', orders: 23, totalSpent: 12450 },
  { id: 'usr-005', name: 'Anjali Desai', email: 'anjali.d@hotmail.com', phone: '+91 54321 09876', status: 'suspended', joinedDate: 'Jan 28, 2024', orders: 5, totalSpent: 1870 },
  { id: 'usr-006', name: 'Rahul Joshi', email: 'rahul.j@gmail.com', phone: '+91 43210 98765', status: 'active', joinedDate: 'May 05, 2024', orders: 15, totalSpent: 6320 },
  { id: 'usr-007', name: 'Meera Nair', email: 'meera.n@gmail.com', phone: '+91 32109 87654', status: 'active', joinedDate: 'Apr 22, 2024', orders: 3, totalSpent: 890 },
  { id: 'usr-008', name: 'Karthik Rao', email: 'karthik@protonmail.com', phone: '+91 21098 76543', status: 'active', joinedDate: 'Jun 01, 2024', orders: 7, totalSpent: 2450 },
];

export const INITIAL_ORDERS: AdminOrder[] = [
  { id: 'ORD-2024-001', customerId: 'usr-001', customerName: 'Priya Sharma', customerEmail: 'priya@gmail.com', items: [{ productId: 'paracetamol-500', productName: 'Paracetamol 500mg', quantity: 3, price: 35 }], total: 404, status: 'delivered', date: 'Jun 20, 2024', address: '123 Health Ave, Mumbai 400001' },
  { id: 'ORD-2024-002', customerId: 'usr-002', customerName: 'Amit Patel', customerEmail: 'amit.p@outlook.com', items: [{ productId: 'blood-pressure-monitor', productName: 'Automatic BP Monitor', quantity: 1, price: 1299 }], total: 1299, status: 'shipped', date: 'Jun 22, 2024', address: '456 Business Park, Delhi 110001' },
  { id: 'ORD-2024-003', customerId: 'usr-004', customerName: 'Vikram Singh', customerEmail: 'vikram.s@gmail.com', items: [{ productId: 'omega-3-capsules', productName: 'Omega-3 Fish Oil', quantity: 2, price: 449 }], total: 1247, status: 'processing', date: 'Jun 24, 2024', address: '789 Sector 21, Chandigarh 160022' },
  { id: 'ORD-2024-004', customerId: 'usr-006', customerName: 'Rahul Joshi', customerEmail: 'rahul.j@gmail.com', items: [{ productId: 'first-aid-kit', productName: 'Complete First Aid Kit', quantity: 1, price: 599 }], total: 599, status: 'pending', date: 'Jun 25, 2024', address: '12 MG Road, Bangalore 560001' },
  { id: 'ORD-2024-005', customerId: 'usr-007', customerName: 'Meera Nair', customerEmail: 'meera.n@gmail.com', items: [{ productId: 'baby-rash-cream', productName: 'Baby Diaper Rash Cream', quantity: 2, price: 175 }], total: 797, status: 'pending', date: 'Jun 25, 2024', address: '34 Marine Drive, Kochi 682001' },
  { id: 'ORD-2024-006', customerId: 'usr-008', customerName: 'Karthik Rao', customerEmail: 'karthik@protonmail.com', items: [{ productId: 'cough-syrup', productName: 'Herbal Cough Syrup', quantity: 1, price: 125 }], total: 125, status: 'cancelled', date: 'Jun 19, 2024', address: '56 Jubilee Hills, Hyderabad 500033' },
];

export const INITIAL_PAGES: CMSPage[] = [
  { id: 'pg-001', title: 'Cookie Policy', slug: 'cookies', content: '<h2>Cookie Policy</h2><p>Heart Pharma uses cookies to enhance your browsing experience.</p>', status: 'published', lastUpdated: 'Jun 20, 2024', type: 'cookies' },
  { id: 'pg-002', title: 'Privacy Policy', slug: 'privacy', content: '<h2>Privacy Policy</h2><p>At Heart Pharma, we are committed to protecting your privacy.</p>', status: 'published', lastUpdated: 'Jun 18, 2024', type: 'privacy' },
  { id: 'pg-003', title: 'Terms & Conditions', slug: 'terms', content: '<h2>Terms & Conditions</h2><p>These terms govern your use of the Heart Pharma website.</p>', status: 'published', lastUpdated: 'Jun 15, 2024', type: 'terms' },
  { id: 'pg-004', title: 'About Heart Pharma', slug: 'about-cms', content: '<h2>About Heart Pharma</h2><p>Heart Pharma was founded with a mission to make quality healthcare accessible.</p>', status: 'published', lastUpdated: 'Jun 10, 2024', type: 'about' },
];

export const INITIAL_SETTINGS: AdminSettings = {
  name: 'Dr. Rajesh Kumar', email: 'admin@heartpharma.com', phone: '+91 99999 00000',
  notifyOrders: true, notifyUsers: true, notifyStock: false, twoFactor: false,
};

export const INITIAL_PRODUCTS = defaultProducts;

export const DATA_KEYS = ['hp_products', 'hp_users', 'hp_orders', 'hp_pages', 'hp_settings'] as const;

export const db = {
  getProducts(): Product[] {
    const data = localStorage.getItem('hp_products');
    if (!data) { localStorage.setItem('hp_products', JSON.stringify(defaultProducts)); return defaultProducts; }
    return JSON.parse(data);
  },
  saveProducts(products: Product[]) {
    localStorage.setItem('hp_products', JSON.stringify(products));
    window.dispatchEvent(new Event('storage'));
  },
  getUsers(): RegisteredUser[] {
    const data = localStorage.getItem('hp_users');
    if (!data) { localStorage.setItem('hp_users', JSON.stringify(INITIAL_USERS)); return INITIAL_USERS; }
    return JSON.parse(data);
  },
  saveUsers(users: RegisteredUser[]) {
    localStorage.setItem('hp_users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
  },
  getOrders(): AdminOrder[] {
    const data = localStorage.getItem('hp_orders');
    if (!data) { localStorage.setItem('hp_orders', JSON.stringify(INITIAL_ORDERS)); return INITIAL_ORDERS; }
    return JSON.parse(data);
  },
  saveOrders(orders: AdminOrder[]) {
    localStorage.setItem('hp_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('storage'));
  },
  getPages(): CMSPage[] {
    const data = localStorage.getItem('hp_pages');
    if (!data) { localStorage.setItem('hp_pages', JSON.stringify(INITIAL_PAGES)); return INITIAL_PAGES; }
    return JSON.parse(data);
  },
  savePages(pages: CMSPage[]) {
    localStorage.setItem('hp_pages', JSON.stringify(pages));
    window.dispatchEvent(new Event('storage'));
  },
  getSettings(): AdminSettings {
    const data = localStorage.getItem('hp_settings');
    if (!data) { localStorage.setItem('hp_settings', JSON.stringify(INITIAL_SETTINGS)); return INITIAL_SETTINGS; }
    return JSON.parse(data);
  },
  saveSettings(settings: AdminSettings) {
    localStorage.setItem('hp_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
  },

  /**
   * Atomic clear of all application data.
   * Preserves authentication (hp_admin_session).
   * Re-seeds localStorage with initial defaults and returns them.
   */
  clearAll() {
    DATA_KEYS.forEach((k) => localStorage.removeItem(k));
    // Re-seed with defaults
    localStorage.setItem('hp_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('hp_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('hp_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('hp_pages', JSON.stringify(INITIAL_PAGES));
    localStorage.setItem('hp_settings', JSON.stringify(INITIAL_SETTINGS));
    return {
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      orders: INITIAL_ORDERS,
      pages: INITIAL_PAGES,
      settings: INITIAL_SETTINGS,
    };
  },
};
