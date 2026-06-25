import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data
const MOCK_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Dr. Rajesh Kumar',
  email: 'admin@heartpharma.com',
  role: 'super_admin',
  joinedDate: 'Jan 2023',
};

const MOCK_USERS: RegisteredUser[] = [
  { id: 'usr-001', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 98765 43210', status: 'active', joinedDate: 'Mar 15, 2024', orders: 12, totalSpent: 4580 },
  { id: 'usr-002', name: 'Amit Patel', email: 'amit.p@outlook.com', phone: '+91 87654 32109', status: 'active', joinedDate: 'Apr 02, 2024', orders: 8, totalSpent: 3210 },
  { id: 'usr-003', name: 'Sneha Reddy', email: 'sneha.r@yahoo.com', phone: '+91 76543 21098', status: 'pending', joinedDate: 'Jun 18, 2024', orders: 0, totalSpent: 0 },
  { id: 'usr-004', name: 'Vikram Singh', email: 'vikram.s@gmail.com', phone: '+91 65432 10987', status: 'active', joinedDate: 'Feb 10, 2024', orders: 23, totalSpent: 12450 },
  { id: 'usr-005', name: 'Anjali Desai', email: 'anjali.d@hotmail.com', phone: '+91 54321 09876', status: 'suspended', joinedDate: 'Jan 28, 2024', orders: 5, totalSpent: 1870 },
  { id: 'usr-006', name: 'Rahul Joshi', email: 'rahul.j@gmail.com', phone: '+91 43210 98765', status: 'active', joinedDate: 'May 05, 2024', orders: 15, totalSpent: 6320 },
  { id: 'usr-007', name: 'Meera Nair', email: 'meera.n@gmail.com', phone: '+91 32109 87654', status: 'active', joinedDate: 'Apr 22, 2024', orders: 3, totalSpent: 890 },
  { id: 'usr-008', name: 'Karthik Rao', email: 'karthik@protonmail.com', phone: '+91 21098 76543', status: 'active', joinedDate: 'Jun 01, 2024', orders: 7, totalSpent: 2450 },
];

const MOCK_ORDERS: AdminOrder[] = [
  { id: 'ORD-2024-001', customerId: 'usr-001', customerName: 'Priya Sharma', customerEmail: 'priya@gmail.com', items: [{ productId: 'paracetamol-500', productName: 'Paracetamol 500mg', quantity: 3, price: 35 }, { productId: 'vitamin-c-1000', productName: 'Vitamin C 1000mg', quantity: 1, price: 299 }], total: 404, status: 'delivered', date: 'Jun 20, 2024', address: '123 Health Ave, Mumbai 400001' },
  { id: 'ORD-2024-002', customerId: 'usr-002', customerName: 'Amit Patel', customerEmail: 'amit.p@outlook.com', items: [{ productId: 'blood-pressure-monitor', productName: 'Automatic BP Monitor', quantity: 1, price: 1299 }], total: 1299, status: 'shipped', date: 'Jun 22, 2024', address: '456 Business Park, Delhi 110001' },
  { id: 'ORD-2024-003', customerId: 'usr-004', customerName: 'Vikram Singh', customerEmail: 'vikram.s@gmail.com', items: [{ productId: 'omega-3-capsules', productName: 'Omega-3 Fish Oil Capsules', quantity: 2, price: 449 }, { productId: 'multivitamin-daily', productName: 'Daily Multivitamin Complex', quantity: 1, price: 349 }], total: 1247, status: 'processing', date: 'Jun 24, 2024', address: '789 Sector 21, Chandigarh 160022' },
  { id: 'ORD-2024-004', customerId: 'usr-006', customerName: 'Rahul Joshi', customerEmail: 'rahul.j@gmail.com', items: [{ productId: 'first-aid-kit', productName: 'Complete First Aid Kit', quantity: 1, price: 599 }], total: 599, status: 'pending', date: 'Jun 25, 2024', address: '12 MG Road, Bangalore 560001' },
  { id: 'ORD-2024-005', customerId: 'usr-007', customerName: 'Meera Nair', customerEmail: 'meera.n@gmail.com', items: [{ productId: 'baby-rash-cream', productName: 'Baby Diaper Rash Cream', quantity: 2, price: 175 }, { productId: 'hand-sanitizer', productName: 'Hand Sanitizer 500ml', quantity: 3, price: 149 }], total: 797, status: 'pending', date: 'Jun 25, 2024', address: '34 Marine Drive, Kochi 682001' },
  { id: 'ORD-2024-006', customerId: 'usr-008', customerName: 'Karthik Rao', customerEmail: 'karthik@protonmail.com', items: [{ productId: 'cough-syrup', productName: 'Herbal Cough Syrup', quantity: 1, price: 125 }], total: 125, status: 'cancelled', date: 'Jun 19, 2024', address: '56 Jubilee Hills, Hyderabad 500033' },
];

const MOCK_PAGES: CMSPage[] = [
  { id: 'pg-001', title: 'Cookie Policy', slug: 'cookies', content: `<h2>Cookie Policy</h2>\n<p>Heart Pharma uses cookies and similar tracking technologies to enhance your browsing experience, serve personalized content, and analyze our traffic.</p>\n<h3>What Are Cookies?</h3>\n<p>Cookies are small text files placed on your device when you visit our website. They help us remember your preferences and provide a better experience.</p>\n<h3>Types of Cookies We Use</h3>\n<ul>\n<li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., shopping cart, authentication).</li>\n<li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>\n<li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements.</li>\n</ul>\n<h3>Managing Cookies</h3>\n<p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>`, status: 'published', lastUpdated: 'Jun 20, 2024', type: 'cookies' },
  { id: 'pg-002', title: 'Privacy Policy', slug: 'privacy', content: `<h2>Privacy Policy</h2>\n<p>At Heart Pharma, we are committed to protecting your privacy and personal data. This policy outlines how we collect, use, and safeguard your information.</p>\n<h3>Information We Collect</h3>\n<ul>\n<li>Personal details (name, email, phone number)</li>\n<li>Shipping and billing addresses</li>\n<li>Order history and preferences</li>\n<li>Device and browser information</li>\n</ul>\n<h3>How We Use Your Information</h3>\n<p>We use your information to process orders, provide customer support, send promotional communications (with consent), and improve our services.</p>\n<h3>Data Security</h3>\n<p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your data.</p>\n<h3>Your Rights</h3>\n<p>You have the right to access, correct, delete, or port your personal data. Contact us at privacy@heartpharma.com for any requests.</p>`, status: 'published', lastUpdated: 'Jun 18, 2024', type: 'privacy' },
  { id: 'pg-003', title: 'Terms & Conditions', slug: 'terms', content: `<h2>Terms & Conditions</h2>\n<p>These terms govern your use of the Heart Pharma website and services. By using our platform, you agree to these terms.</p>\n<h3>Account Registration</h3>\n<p>You must provide accurate information during registration. You are responsible for maintaining the security of your account credentials.</p>\n<h3>Orders & Payments</h3>\n<p>All orders are subject to availability. Prices are listed in INR and include applicable taxes. We accept major credit/debit cards, UPI, and net banking.</p>\n<h3>Shipping & Delivery</h3>\n<p>We aim to deliver within 3-7 business days. Delivery times may vary based on location and product availability.</p>\n<h3>Returns & Refunds</h3>\n<p>Products may be returned within 7 days of delivery if unopened and in original packaging. Medicines cannot be returned due to health regulations.</p>\n<h3>Limitation of Liability</h3>\n<p>Heart Pharma is not liable for any indirect or consequential damages arising from the use of our products or services.</p>`, status: 'published', lastUpdated: 'Jun 15, 2024', type: 'terms' },
  { id: 'pg-004', title: 'About Heart Pharma', slug: 'about-cms', content: `<h2>About Heart Pharma</h2>\n<p>Heart Pharma was founded with a mission to make quality healthcare accessible to everyone. We are a trusted pharmacy delivering genuine medicines and health products across India.</p>\n<h3>Our Story</h3>\n<p>What started as a small neighborhood pharmacy has grown into a trusted health partner for over 50,000 families. Our team of licensed pharmacists ensures every product meets the highest quality standards.</p>\n<h3>Our Values</h3>\n<ul>\n<li><strong>Authenticity:</strong> 100% genuine products from licensed manufacturers</li>\n<li><strong>Compassion:</strong> Every customer is treated like family</li>\n<li><strong>Innovation:</strong> Continuously improving our services</li>\n<li><strong>Accessibility:</strong> Making healthcare affordable for all</li>\n</ul>`, status: 'published', lastUpdated: 'Jun 10, 2024', type: 'about' },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<RegisteredUser[]>(MOCK_USERS);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [pages, setPages] = useState<CMSPage[]>(MOCK_PAGES);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    name: MOCK_ADMIN.name,
    email: MOCK_ADMIN.email,
    phone: '+91 99999 00000',
    notifyOrders: true,
    notifyUsers: true,
    notifyStock: false,
    twoFactor: false,
  });

  const isAdminLoggedIn = admin !== null;

  const adminLogin = useCallback((email: string, password: string): boolean => {
    // Mock admin credentials
    if (email === 'admin@heartpharma.com' && password === 'admin123') {
      setAdmin(MOCK_ADMIN);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
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
