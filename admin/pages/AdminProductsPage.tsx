import { useState } from 'react';
import { db } from '../data/db';
import { categories, type Product } from '../data/products';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productList, setProductList] = useState<Product[]>(() => db.getProducts());

  const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'in' ? p.inStock : !p.inStock);
    return matchSearch && matchCategory && matchStock;
  });

  const handleToggleStock = (productId: string) => {
    const updated = productList.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    setProductList(updated);
    db.saveProducts(updated);
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Product Management</h1>
          <p className="admin-page__desc">Manage your pharmacy product catalog. {productList.length} products total.</p>
        </div>
        <button className="admin-btn admin-btn--primary" id="add-product-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or ID..."
            className="admin-search__input"
            id="product-search"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-select"
          id="category-filter"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as 'all' | 'in' | 'out')}
          className="admin-select"
          id="stock-filter"
        >
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
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={editingProduct === product.id ? 'admin-table__row--editing' : ''}>
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
                        <span className="admin-product-rating__star">⭐</span>
                        <span className="admin-product-rating__value">{product.rating}</span>
                        <span className="admin-product-rating__count">({product.reviews})</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStock(product.id)}
                        className={`admin-badge admin-badge--clickable ${product.inStock ? 'admin-badge--green' : 'admin-badge--red'}`}
                      >
                        {product.inStock ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          onClick={() => setEditingProduct(editingProduct === product.id ? null : product.id)}
                          className="admin-action-btn admin-action-btn--edit"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="admin-action-btn admin-action-btn--delete" title="Delete">
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
    </div>
  );
}
