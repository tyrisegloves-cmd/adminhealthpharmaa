import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransition } from '../context/TransitionContext';
import { products } from '../data/products';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const { user, isLoggedIn, cart, removeFromCart, updateCartQuantity, clearCart, cartCount } =
    useAuth();
  const { navigateWithSplash } = useTransition();

  // ── Not signed in ──
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Sign in to view your cart
          </h2>
          <p className="text-gray-500 mb-8">
            Please sign in or create an account to add products to your cart and checkout.
          </p>
          <button
            onClick={() => navigateWithSplash('/auth', { from: '/cart', message: 'Please sign in to access your cart.' })}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign In / Sign Up
          </button>
          <Link
            to="/products"
            className="block mt-4 text-sm text-primary font-semibold hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart data ──
  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const cartOriginalTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.originalPrice || 0) * item.quantity,
    0
  );
  const cartSavings = cartOriginalTotal - cartTotal;

  // Recommended products (ones not already in the cart)
  const cartProductIds = cart.map((i) => i.productId);
  const recommended = products
    .filter((p) => !cartProductIds.includes(p.id) && p.inStock)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-primary via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <BackButton
            label="Back"
            className="mb-5 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
          />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl">
              🛒
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Shopping Cart</h1>
              <p className="text-teal-100 text-sm mt-0.5">
                {cartCount === 0
                  ? 'Your cart is empty'
                  : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cart content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── Items list ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
              {/* Header row */}
              <div className="px-6 sm:px-8 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-extrabold text-gray-900">
                  Cart Items ({cartCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map(({ productId, quantity, product }) => {
                  if (!product) return null;
                  const itemDiscount = Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  );
                  return (
                    <div
                      key={productId}
                      className="px-6 sm:px-8 py-5 flex gap-4 sm:gap-6 items-start hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Image */}
                      <button onClick={() => navigateWithSplash(`/product/${product.id}`)} className="flex-shrink-0 cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover border border-gray-100 hover:border-primary/30 transition-colors"
                        />
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <button
                              onClick={() => navigateWithSplash(`/product/${product.id}`)}
                              className="font-bold text-gray-800 text-sm sm:text-base hover:text-primary transition-colors line-clamp-2 text-left cursor-pointer"
                            >
                              {product.name}
                            </button>
                            <p className="text-xs text-gray-400 mt-0.5 capitalize">
                              {product.category.replace('-', ' ')}
                              {product.manufacturer && ` · ${product.manufacturer}`}
                            </p>
                          </div>

                          {/* Remove (desktop) */}
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex-shrink-0 mt-1"
                            title="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-extrabold text-gray-900">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                {itemDiscount}% off
                              </span>
                            </>
                          )}
                        </div>

                        {/* Bottom row: qty + remove (mobile) + subtotal */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateCartQuantity(productId, quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-sm"
                              >
                                −
                              </button>
                              <span className="w-9 h-8 flex items-center justify-center font-bold text-gray-800 text-sm border-x border-gray-200 bg-white">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(productId, quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-sm"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove (mobile) */}
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="sm:hidden text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>

                          {/* Subtotal */}
                          <span className="font-extrabold text-gray-900 text-base">
                            ₹{product.price * quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order Summary sidebar ── */}
            <div className="space-y-5 lg:sticky lg:top-24">
              {/* Summary card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-base font-extrabold text-gray-900">Order Summary</h2>
                </div>

                <div className="px-6 py-5 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-semibold text-gray-800">₹{cartOriginalTotal}</span>
                  </div>

                  {cartSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Discount
                      </span>
                      <span className="font-semibold">-₹{cartSavings}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-baseline">
                    <span className="font-extrabold text-gray-900 text-base">Total</span>
                    <div className="text-right">
                      <span className="font-extrabold text-gray-900 text-2xl">₹{cartTotal}</span>
                      {cartSavings > 0 && (
                        <p className="text-xs text-green-600 font-semibold mt-0.5">
                          You save ₹{cartSavings} on this order 🎉
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to="/checkout"
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Proceed to Checkout
                  </Link>

                  <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure checkout · SSL encrypted
                  </p>
                </div>
              </div>

              {/* Promo / benefits */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                {[
                  { icon: '🚚', label: 'Free delivery on all orders' },
                  { icon: '↩️', label: '7-day easy returns' },
                  { icon: '✅', label: '100% genuine products' },
                  { icon: '🔒', label: 'Secure payment gateway' },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-base">{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty cart ── */
          <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Browse our products and find
              something you love!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Start Shopping
            </Link>
          </div>
        )}

        {/* ── Recommended products ── */}
        {recommended.length > 0 && (
          <div className="mt-14">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-primary font-bold text-xs uppercase tracking-wider">
                  You might also like
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                  Recommended Products
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
