import { useState } from 'react';
import { useAdmin, type RegisteredUser } from '../context/AdminContext';

export default function AdminUsersPage() {
  const { users, setUsers } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (userId: string, status: RegisteredUser['status']) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, status } : u));
    setUsers(updated);
  };

  const statusColor: Record<string, string> = {
    active: 'admin-badge--green',
    suspended: 'admin-badge--red',
    pending: 'admin-badge--amber',
  };

  const totalSpent = users.reduce((sum, u) => sum + u.totalSpent, 0);
  const averageSpent = users.length ? Math.round(totalSpent / users.length) : 0;

  const stats = [
    { label: 'Total Users', value: String(users.length), icon: '👥' },
    { label: 'Active Users', value: String(users.filter(u => u.status === 'active').length), icon: '🟢' },
    { label: 'Avg customer spend', value: `₹${averageSpent.toLocaleString()}`, icon: '💳' },
  ];

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">User Registry</h1>
          <p className="admin-page__desc">Manage registered customers. {users.length} users in the system.</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="admin-user-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-user-stat">
            <span className="admin-user-stat__icon">{stat.icon}</span>
            <div>
              <span className="admin-user-stat__value">{stat.value}</span>
              <span className="admin-user-stat__label">{stat.label}</span>
            </div>
          </div>
        ))}
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
            placeholder="Search by user name, email, phone..."
            className="admin-search__input"
            id="user-search"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select"
          id="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending Approval</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="admin-card__body admin-card__body--flush">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Info</th>
                  <th>Phone</th>
                  <th>Joined Date</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const initials = user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-cell__avatar">{initials}</div>
                          <div className="admin-user-cell__info">
                            <span className="admin-user-cell__name">{user.name}</span>
                            <span className="admin-user-cell__email">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table__mono">{user.phone}</td>
                      <td className="admin-table__date">{user.joinedDate}</td>
                      <td className="admin-table__center">{user.orders}</td>
                      <td className="admin-table__amount">₹{user.totalSpent.toLocaleString()}</td>
                      <td>
                        <span className={`admin-badge ${statusColor[user.status]}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {user.status !== 'active' && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'active')}
                              className="admin-action-btn admin-action-btn--approve"
                              title="Activate User"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          {user.status !== 'suspended' && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'suspended')}
                              className="admin-action-btn admin-action-btn--suspend"
                              title="Suspend User"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="admin-empty">
              <span className="admin-empty__icon">👤</span>
              <p className="admin-empty__text">No users match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
