import { useState } from 'react';
import { db } from '../data/db';
import { categories, type Product } from '../data/products';

const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  category: 'medicines',
  image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80',
  price: 0,
  originalPrice: 0,
  rating: 4.0,
  reviews: 0,
  inStock: true,
  description: '',
  prescription: false,
});

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [productList, setProductList] = useState<Product[]>(() => db.getProducts());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addError, setAddError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Product | null>(null);

  const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'in' ? p.inStock : !p.inStock);
    return matchSearch && matchCategory && matchStock;
  });

  const handleToggleStock = (productId: string) => {
    const updated = productList.map((p) => p.id === productId ? { ...p, inStock: !p.inStock } : p);
    setProductList(updated);
    db.saveProducts(updated);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!addForm.name.trim()) { setAddError('Product name is required.'); return; }
    if (addForm.price <= 0) { setAddError('Price must be greater than 0.'); return; }
    const newProduct: Product = {
      ...addForm,
      id: `prod-${Date.now()}`,
      originalPrice: addForm.originalPrice || addForm.price,
    };
    const updated = [newProduct, ...productList];
    setProductList(updated);
    db.saveProducts(updated);
    setShowAddModal(false);
    setAddForm(emptyForm());
  };

  const handleDelete = (product: Product) => {
    const updated = productList.filter((p) => p.id !== product.id);
    setProductList(updated);
    db.saveProducts(updated);
    setDeleteTarget(null);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    const updated = productList.map((p) => p.id === editForm.id ? editForm : p);
    setProductList(updated);
    db.saveProducts(updated);
    setEditTarget(null);
    setEditForm(null);
  };

  const openEdit = (product: Product) => {
    setEditTarget(product);
    setEditForm({ ...product });
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Product Management</h1>
          <p className="admin-page__desc">Manage your pharmacy product catalog. {productList.length} products total.</p>
        </div>
        <button className="admin-btn admin-btn--primary" id="add-product-btn" onClick={() => { setAddForm(emptyForm()); setAddError(''); setShowAddModal(true); }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search">
          <svg className="admin-search__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products by name or ID..." className="admin-search__input" id="product-search" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-select" id="category-filter">
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value as 'all' | 'in' | 'out')} className="admin-select" id="stock-filter">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-card__body admin-card__body--flush">
          <div className="admin-table-wrap">
            <table className="admin-table admin-table--products">
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        <img src={product.image} alt={product.name} className="admin-product-cell__img" />
                        <div className="admin-product-cell__info">
                          <span className="admin-product-cell__name">{product.name}</span>
                          <span className="admin-product-cell__id">{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--outline">
                        {categories.find(c => c.id === product.category)?.icon}{' '}
                        {categories.find(c => c.id === product.category)?.name}
                      </span>
                    </td>
                    <td>
                      <div className="admin-product-price">
                        <span className="admin-product-price__current">₹{product.price}</span>
                        <span className="admin-product-price__original">₹{product.originalPrice}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-product-rating">
                        <span>⭐</span>
                        <span className="admin-product-rating__value">{product.rating}</span>
                        <span className="admin-product-rating__count">({product.reviews})</span>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => handleToggleStock(product.id)} className={`admin-badge admin-badge--clickable ${product.inStock ? 'admin-badge--green' : 'admin-badge--red'}`}>
                        {product.inStock ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button onClick={() => openEdit(product)} className="admin-action-btn admin-action-btn--edit" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="admin-action-btn admin-action-btn--delete" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="admin-empty">
              <span className="admin-empty__icon">🔍</span>
              <p className="admin-empty__text">No products match your filters</p>
              <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStockFilter('all'); }} className="admin-btn admin-btn--ghost">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title" style={{ textAlign: 'left', marginBottom: 0 }}>Add New Product</h2>
              <button className="admin-modal__close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            {addError && <div className="admin-alert admin-alert--danger" style={{ margin: '0 0 16px' }}><span>{addError}</span></div>}
            <form onSubmit={handleAdd} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label className="admin-form__label">Product Name *</label>
                  <input className="admin-form__input" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required placeholder="e.g. Vitamin C 500mg" />
                </div>
                <div className="admin-form__field">
                  <label className="admin-form__label">Category</label>
                  <select className="admin-select" value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })}>
                    {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label className="admin-form__label">Price (₹) *</label>
                  <input type="number" className="admin-form__input" value={addForm.price || ''} onChange={e => setAddForm({ ...addForm, price: Number(e.target.value) })} required min={1} placeholder="199" />
                </div>
                <div className="admin-form__field">
                  <label className="admin-form__label">Original Price (₹)</label>
                  <input type="number" className="admin-form__input" value={addForm.originalPrice || ''} onChange={e => setAddForm({ ...addForm, originalPrice: Number(e.target.value) })} min={0} placeholder="249" />
                </div>
              </div>
              <div className="admin-form__field">
                <label className="admin-form__label">Image URL</label>
                <input className="admin-form__input" value={addForm.image} onChange={e => setAddForm({ ...addForm, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="admin-form__field">
                <label className="admin-form__label">Description</label>
                <textarea className="admin-form__textarea" rows={3} value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} placeholder="Short product description..." />
              </div>
              <div className="admin-form__row">
                <label className="admin-checkbox-label">
                  <input type="checkbox" className="admin-checkbox" checked={addForm.inStock} onChange={e => setAddForm({ ...addForm, inStock: e.target.checked })} />
                  <div><span className="admin-checkbox-text">In Stock</span></div>
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" className="admin-checkbox" checked={addForm.prescription} onChange={e => setAddForm({ ...addForm, prescription: e.target.checked })} />
                  <div><span className="admin-checkbox-text">Requires Prescription</span></div>
                </label>
              </div>
              <div className="admin-form__actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editTarget && editForm && (
        <div className="admin-modal-overlay" onClick={() => { setEditTarget(null); setEditForm(null); }}>
          <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title" style={{ textAlign: 'left', marginBottom: 0 }}>Edit Product</h2>
              <button className="admin-modal__close" onClick={() => { setEditTarget(null); setEditForm(null); }}>×</button>
            </div>
            <form onSubmit={handleEditSave} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label className="admin-form__label">Product Name *</label>
                  <input className="admin-form__input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                </div>
                <div className="admin-form__field">
                  <label className="admin-form__label">Category</label>
                  <select className="admin-select" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                    {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label className="admin-form__label">Price (₹) *</label>
                  <input type="number" className="admin-form__input" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} required min={1} />
                </div>
                <div className="admin-form__field">
                  <label className="admin-form__label">Original Price (₹)</label>
                  <input type="number" className="admin-form__input" value={editForm.originalPrice} onChange={e => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <div className="admin-form__field">
                <label className="admin-form__label">Image URL</label>
                <input className="admin-form__input" value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
              </div>
              <div className="admin-form__field">
                <label className="admin-form__label">Description</label>
                <textarea className="admin-form__textarea" rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div className="admin-form__row">
                <label className="admin-checkbox-label">
                  <input type="checkbox" className="admin-checkbox" checked={editForm.inStock} onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })} />
                  <div><span className="admin-checkbox-text">In Stock</span></div>
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" className="admin-checkbox" checked={editForm.prescription} onChange={e => setEditForm({ ...editForm, prescription: e.target.checked })} />
                  <div><span className="admin-checkbox-text">Requires Prescription</span></div>
                </label>
              </div>
              <div className="admin-form__actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setEditTarget(null); setEditForm(null); }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__icon admin-modal__icon--danger">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="admin-modal__title">Delete Product?</h2>
            <p className="admin-modal__desc">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteTarget)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
