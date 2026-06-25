import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import BackButton from '../components/BackButton';
import { db } from '../data/db';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function ProfilePage() {
  const { user, isLoggedIn, logout, cart, cartCount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Redirect if not logged in
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            You need to sign in to view your profile and manage your account.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Cart savings for profile stats
  const cartSavings = cart.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return sum + ((p?.originalPrice || 0) - (p?.price || 0)) * item.quantity;
  }, 0);

  // Read orders from db
  const userOrders = db.getOrders()
    .filter((o) => o.customerEmail === user.email)
    .map((o) => {
      let statusColor = 'text-amber-600 bg-amber-50';
      if (o.status === 'delivered') statusColor = 'text-green-600 bg-green-50';
      else if (o.status === 'shipped' || o.status === 'processing') statusColor = 'text-blue-600 bg-blue-50';
      else if (o.status === 'cancelled') statusColor = 'text-red-600 bg-red-50';

      return {
        id: o.id,
        date: o.date,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        statusColor,
        items: o.items.reduce((sum, item) => sum + item.quantity, 0),
        total: o.total,
      };
    });

  // Mock addresses
  const mockAddresses = [
    { id: 1, label: 'Home', icon: '🏠', address: '123 Health Avenue, Apartment 4B, Medical District, Mumbai 400001', isDefault: true },
    { id: 2, label: 'Office', icon: '🏢', address: '456 Business Park, Tower C, Floor 12, BKC, Mumbai 400051', isDefault: false },
  ];

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleProfileSave = () => {
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          <BackButton label="Back" className="mb-5 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-xl border-2 border-white/30">
              {initials}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{user.name}</h1>
              <p className="text-teal-100 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </p>
              <p className="text-teal-200/80 text-xs mt-1">Member since {user.joinedDate}</p>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-12">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Nav tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 h-fit lg:sticky lg:top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-gray-600 hover:text-primary hover:bg-teal-50'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="flex-1 text-left">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Cart link card */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-primary hover:bg-teal-50 transition-all duration-200 group"
                >
                  <span className="text-base">🛒</span>
                  <span className="flex-1 text-left">My Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                      {cartCount}
                    </span>
                  )}
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* ============ PROFILE TAB ============ */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-900">Personal Information</h2>
                    {!editingProfile ? (
                      <button
                        onClick={() => {
                          setProfileForm({ name: user.name, email: user.email, phone: user.phone });
                          setEditingProfile(true);
                        }}
                        className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProfile(false)} className="text-sm text-gray-500 font-semibold hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                        <button onClick={handleProfileSave} className="text-sm text-white font-semibold bg-primary hover:bg-primary-dark px-4 py-1.5 rounded-lg transition-colors">Save</button>
                      </div>
                    )}
                  </div>

                  {profileSaved && (
                    <div className="mx-6 sm:mx-8 mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 animate-slide-down">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-green-700 font-medium">Profile updated successfully!</p>
                    </div>
                  )}

                  <div className="px-6 sm:px-8 py-6 space-y-6">
                    {[
                      { label: 'Full Name', key: 'name' as const, type: 'text' },
                      { label: 'Email Address', key: 'email' as const, type: 'email' },
                      { label: 'Phone Number', key: 'phone' as const, type: 'tel' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                        {editingProfile ? (
                          <input
                            type={field.type}
                            value={profileForm[field.key]}
                            onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        ) : (
                          <p className="text-gray-800 font-semibold">{user[field.key]}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Member Since</label>
                      <p className="text-gray-800 font-semibold">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats + Cart CTA */}
                <div className="grid sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Orders', value: '3', icon: '📦', color: 'from-blue-50 to-blue-100/50' },
                    { label: 'Cart Items', value: String(cartCount), icon: '🛒', color: 'from-teal-50 to-teal-100/50' },
                    { label: 'Saved', value: '₹' + cartSavings, icon: '💰', color: 'from-green-50 to-green-100/50' },
                    { label: 'Addresses', value: '2', icon: '📍', color: 'from-purple-50 to-purple-100/50' },
                  ].map((stat) => (
                    <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-center border border-gray-100`}>
                      <div className="text-xl mb-1">{stat.icon}</div>
                      <div className="text-lg font-extrabold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Go to cart CTA */}
                {cartCount > 0 && (
                  <Link
                    to="/cart"
                    className="flex items-center justify-between bg-gradient-to-r from-primary to-teal-600 rounded-2xl p-5 shadow-lg shadow-primary/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                        🛒
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                        <p className="text-teal-100 text-sm">View your cart and proceed to checkout</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            )}

            {/* ============ ORDERS TAB ============ */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-extrabold text-gray-900">Order History</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {userOrders.map((order) => (
                      <div key={order.id} className="px-6 sm:px-8 py-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">📦</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-800 text-sm">{order.id}</p>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{order.date} · {order.items} {order.items === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-gray-900">₹{order.total}</p>
                          <button className="text-xs text-primary font-semibold hover:underline mt-0.5">View Details</button>
                        </div>
                      </div>
                    ))}
                    {userOrders.length === 0 && (
                      <div className="px-6 sm:px-8 py-10 text-center text-gray-500">
                        No orders placed yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============ ADDRESSES TAB ============ */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-900">Saved Addresses</h2>
                    <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {mockAddresses.map((addr) => (
                      <div key={addr.id} className="px-6 sm:px-8 py-5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">{addr.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800 text-sm">{addr.label}</p>
                            {addr.isDefault && <span className="text-xs font-bold text-primary bg-teal-50 px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{addr.address}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs text-primary font-semibold hover:underline">Edit</button>
                          <button className="text-xs text-red-500 font-semibold hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============ SETTINGS TAB ============ */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-extrabold text-gray-900">Account Settings</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {/* Notifications */}
                    <div className="px-6 sm:px-8 py-5">
                      <h3 className="font-bold text-gray-800 text-sm mb-4">Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Order updates', desc: 'Get notified about your order status', default: true },
                          { label: 'Promotional emails', desc: 'Receive deals, discounts, and offers', default: true },
                          { label: 'Health tips', desc: 'Weekly health tips and wellness articles', default: false },
                          { label: 'SMS notifications', desc: 'Receive text messages for order updates', default: true },
                        ].map((notif) => (
                          <label key={notif.label} className="flex items-center justify-between cursor-pointer group">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">{notif.label}</p>
                              <p className="text-xs text-gray-500">{notif.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={notif.default} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="px-6 sm:px-8 py-5">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Password</h3>
                      <p className="text-xs text-gray-500 mb-3">Change your account password</p>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">Change Password</button>
                    </div>

                    {/* Danger Zone */}
                    <div className="px-6 sm:px-8 py-5">
                      <h3 className="font-bold text-red-600 text-sm mb-2">Danger Zone</h3>
                      <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-red-200">Delete Account</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
