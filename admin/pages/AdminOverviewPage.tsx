import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { db } from '../data/db';

export default function AdminOverviewPage() {
  const { users, orders, clearAllData } = useAdmin();
  const products = db.getProducts();
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalProducts = products.length;
  const outOfStock = products.filter(p => !p.inStock).length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', change: '+12.5%', positive: true, color: 'admin-stat--green' },
    { label: 'Total Orders', value: String(orders.length), icon: '📦', change: '+8.2%', positive: true, color: 'admin-stat--blue' },
    { label: 'Active Users', value: String(activeUsers), icon: '👥', change: '+5.1%', positive: true, color: 'admin-stat--purple' },
    { label: 'Products', value: String(totalProducts), icon: '💊', change: `${outOfStock} out of stock`, positive: false, color: 'admin-stat--amber' },
  ];

  const recentOrders = orders.slice(0, 5);

  const statusColor: Record<string, string> = {
    pending: 'admin-badge--amber',
    processing: 'admin-badge--blue',
    shipped: 'admin-badge--indigo',
    delivered: 'admin-badge--green',
    cancelled: 'admin-badge--red',
  };

  const handleClearAll = () => {
    setClearing(true);
    setTimeout(() => {
      clearAllData();
      setClearing(false);
      setCleared(true);
      setTimeout(() => {
        setShowClearModal(false);
        setCleared(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="admin-page animate-fade-in">
      {/* Header */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard Overview</h1>
          <p className="admin-page__desc">Welcome back! Here's what's happening with your pharmacy today.</p>
        </div>
        <button
          id="clear-all-data-btn"
          className="admin-btn admin-btn--danger"
          onClick={() => setShowClearModal(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All Data
        </button>
      </div>

      {/* Stats grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`admin-stat-card ${stat.color} animate-slide-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__icon">{stat.icon}</span>
              <span className={`admin-stat-card__change ${stat.positive ? 'admin-stat-card__change--up' : 'admin-stat-card__change--down'}`}>
                {stat.positive && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {stat.change}
              </span>
            </div>
            <div className="admin-stat-card__value">{stat.value}</div>
            <div className="admin-stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="admin-overview-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Recent Orders</h2>
            <span className="admin-card__badge">{pendingOrders} pending</span>
          </div>
          <div className="admin-card__body admin-card__body--flush">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="admin-table__empty">No orders found</td></tr>
                  ) : recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-table__id">{order.id}</td>
                      <td>
                        <div className="admin-table__customer">
                          <span className="admin-table__customer-name">{order.customerName}</span>
                          <span className="admin-table__customer-email">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="admin-table__amount">₹{order.total.toLocaleString()}</td>
                      <td>
                        <span className={`admin-badge ${statusColor[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats & Activity */}
        <div className="admin-overview-side">
          {/* Order Status Breakdown */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">Order Status</h2>
            </div>
            <div className="admin-card__body">
              <div className="admin-status-list">
                {[
                  { label: 'Delivered', count: deliveredOrders, color: '#22c55e' },
                  { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#6366f1' },
                  { label: 'Processing', count: orders.filter(o => o.status === 'processing').length, color: '#3b82f6' },
                  { label: 'Pending', count: pendingOrders, color: '#f59e0b' },
                  { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
                ].map((item) => (
                  <div key={item.label} className="admin-status-item">
                    <div className="admin-status-item__left">
                      <span className="admin-status-item__dot" style={{ background: item.color }} />
                      <span className="admin-status-item__label">{item.label}</span>
                    </div>
                    <div className="admin-status-item__right">
                      <span className="admin-status-item__count">{item.count}</span>
                      <div className="admin-status-item__bar">
                        <div
                          className="admin-status-item__bar-fill"
                          style={{ width: `${orders.length ? (item.count / orders.length) * 100 : 0}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top products */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">Top Products</h2>
            </div>
            <div className="admin-card__body">
              <div className="admin-top-products">
                {products.slice(0, 4).map((product, i) => (
                  <div key={product.id} className="admin-top-product">
                    <span className="admin-top-product__rank">#{i + 1}</span>
                    <img src={product.image} alt={product.name} className="admin-top-product__img" />
                    <div className="admin-top-product__info">
                      <span className="admin-top-product__name">{product.name}</span>
                      <span className="admin-top-product__price">₹{product.price}</span>
                    </div>
                    <span className="admin-top-product__reviews">{product.reviews} sold</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Data Modal */}
      {showClearModal && (
        <div className="admin-modal-overlay" onClick={() => !clearing && setShowClearModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            {cleared ? (
              <div className="admin-modal__success">
                <div className="admin-modal__success-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="admin-modal__success-text">All data has been cleared!</p>
              </div>
            ) : (
              <>
                <div className="admin-modal__icon admin-modal__icon--danger">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <h2 className="admin-modal__title">Clear All Data?</h2>
                <p className="admin-modal__desc">
                  This will permanently erase all <strong>orders</strong>, <strong>users</strong>, <strong>products</strong>, <strong>pages</strong> and <strong>settings</strong> stored in the admin portal. This action cannot be undone.
                </p>
                <div className="admin-modal__actions">
                  <button
                    className="admin-btn admin-btn--ghost"
                    onClick={() => setShowClearModal(false)}
                    disabled={clearing}
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-clear-btn"
                    className="admin-btn admin-btn--danger"
                    onClick={handleClearAll}
                    disabled={clearing}
                  >
                    {clearing ? (
                      <>
                        <span className="admin-spinner" />
                        Clearing…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Yes, Clear All Data
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
