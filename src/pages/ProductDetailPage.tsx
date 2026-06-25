import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useTransition } from '../context/TransitionContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'uses' | 'side-effects'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const { isLoggedIn, addToCart } = useAuth();
  const { navigateWithSplash } = useTransition();
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigateWithSplash('/auth', {
        from: `/product/${product.id}`,
        message: 'Please sign in to add items to your cart.',
      });
      return;
    }

    const success = addToCart(product.id, quantity);
    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigateWithSplash('/auth', {
        from: `/product/${product.id}`,
        message: 'Please sign in to purchase items.',
      });
      return;
    }

    addToCart(product.id, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gray-50 p-6 sm:p-10">
              {product.badge && (
                <span className="absolute top-6 left-6 bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                  -{discount}% OFF
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-xl object-cover aspect-square sm:aspect-[4/3]"
              />
            </div>

            {/* Info */}
            <div className="p-6 sm:p-10 flex flex-col">
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider mb-2 bg-teal-50 px-3 py-1 rounded-full w-fit">
                {product.category.replace('-', ' ')}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-base ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Manufacturer & Dosage */}
              <div className="space-y-2 mb-6 text-sm">
                {product.manufacturer && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-24">Manufacturer:</span>
                    <span className="font-semibold text-gray-700">{product.manufacturer}</span>
                  </div>
                )}
                {product.dosage && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-24">Dosage:</span>
                    <span className="font-semibold text-gray-700">{product.dosage}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-24">Availability:</span>
                  {product.inStock ? (
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock
                    </span>
                  ) : (
                    <span className="font-semibold text-red-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Not signed in notice */}
              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2.5 animate-fade-in">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800">
                    <button onClick={() => navigateWithSplash('/auth', { from: `/product/${product.id}`, message: 'Sign in to add items to your cart.' })} className="font-bold underline hover:text-amber-900 cursor-pointer">
                      Sign in
                    </button>{' '}
                    to add this item to your cart and complete your purchase.
                  </p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-3 mt-auto">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-bold text-gray-800 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-md text-sm ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : product.inStock
                      ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm ${
                    product.inStock
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ⚡ Buy Now — ₹{product.price * quantity}
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  { icon: '🔒', text: 'Secure Payment' },
                  { icon: '🚚', text: 'Free Delivery' },
                  { icon: '↩️', text: '7-Day Returns' },
                ].map((signal) => (
                  <div key={signal.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>{signal.icon}</span>
                    <span>{signal.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'description' as const, label: 'Description' },
              { id: 'uses' as const, label: 'Uses & Benefits' },
              { id: 'side-effects' as const, label: 'Side Effects' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="animate-fade-in">
                <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
              </div>
            )}

            {activeTab === 'uses' && (
              <div className="animate-fade-in">
                <ul className="space-y-3">
                  {product.uses.map((use) => (
                    <li key={use} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-600">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'side-effects' && (
              <div className="animate-fade-in">
                {product.sideEffects.length > 0 ? (
                  <ul className="space-y-3">
                    {product.sideEffects.map((effect) => (
                      <li key={effect} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </span>
                        <span className="text-gray-600">{effect}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No known side effects reported for this product.</p>
                )}
                <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                  <strong>Disclaimer:</strong> This information is for reference only. Please consult your healthcare provider before starting any medication.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
