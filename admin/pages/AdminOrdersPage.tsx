import { useState } from 'react';
import { useAdmin, type AdminOrder } from '../context/AdminContext';

export default function AdminOrdersPage() {
  const { orders, setOrders } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (orderId: string, status: AdminOrder['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status });
    }
  };

  const statusColor: Record<string, string> = {
    pending: 'admin-badge--amber',
    processing: 'admin-badge--blue',
    shipped: 'admin-badge--indigo',
    delivered: 'admin-badge--green',
    cancelled: 'admin-badge--red',
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Order Management</h1>
          <p className="admin-page__desc">Process orders and update shipping statuses. {orders.length} orders total.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search">
          <svg className="admin-search__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="admin-search__input"
            id="order-search"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select"
          id="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Main Grid */}
      <div className="admin-orders-grid">
        {/* Table list */}
        <div className="admin-card">
          <div className="admin-card__body admin-card__body--flush">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setActiveOrder(order)}
                      className={`admin-table__row--clickable ${activeOrder?.id === order.id ? 'admin-table__row--selected' : ''}`}
                    >
                      <td className="admin-table__id">{order.id}</td>
                      <td>
                        <div className="admin-table__customer">
                          <span className="admin-table__customer-name">{order.customerName}</span>
                          <span className="admin-table__customer-email">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="admin-table__date">{order.date}</td>
                      <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
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
            {filteredOrders.length === 0 && (
              <div className="admin-empty">
                <span className="admin-empty__icon">📦</span>
                <p className="admin-empty__text">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Details panel */}
        {activeOrder && (
          <div className="admin-card admin-order-details animate-slide-up">
            <div className="admin-card__header">
              <h2 className="admin-card__title">Order Details</h2>
              <button className="admin-order-details__close" onClick={() => setActiveOrder(null)}>×</button>
            </div>
            <div className="admin-card__body">
              <div className="admin-order-details__section">
                <div className="admin-order-details__row">
                  <span className="admin-order-details__label">Order ID</span>
                  <span className="admin-order-details__value admin-table__id">{activeOrder.id}</span>
                </div>
                <div className="admin-order-details__row">
                  <span className="admin-order-details__label">Placed On</span>
                  <span className="admin-order-details__value">{activeOrder.date}</span>
                </div>
                <div className="admin-order-details__row">
                  <span className="admin-order-details__label">Current Status</span>
                  <span className={`admin-badge ${statusColor[activeOrder.status]}`}>
                    {activeOrder.status.charAt(0).toUpperCase() + activeOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="admin-order-details__divider" />

              <div className="admin-order-details__section">
                <h3 className="admin-order-details__sub">Customer Info</h3>
                <p className="admin-order-details__text font-bold">{activeOrder.customerName}</p>
                <p className="admin-order-details__sub-text">{activeOrder.customerEmail}</p>
                <p className="admin-order-details__sub-text mt-1">Shipping Address:</p>
                <p className="admin-order-details__address">{activeOrder.address}</p>
              </div>

              <div className="admin-order-details__divider" />

              <div className="admin-order-details__section">
                <h3 className="admin-order-details__sub">Items Info</h3>
                <div className="admin-order-details__items">
                  {activeOrder.items.map((item) => (
                    <div key={item.productId} className="admin-order-details__item">
                      <div className="admin-order-details__item-left">
                        <span className="admin-order-details__item-name">{item.productName}</span>
                        <span className="admin-order-details__item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="admin-order-details__item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="admin-order-details__total">
                  <span>Grand Total</span>
                  <span>₹{activeOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="admin-order-details__divider" />

              <div className="admin-order-details__section">
                <h3 className="admin-order-details__sub mb-3">Update Order Status</h3>
                <div className="admin-order-details__actions">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(activeOrder.id, status)}
                      className={`admin-btn admin-btn--sm ${
                        activeOrder.status === status ? 'admin-btn--primary' : 'admin-btn--outline'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
