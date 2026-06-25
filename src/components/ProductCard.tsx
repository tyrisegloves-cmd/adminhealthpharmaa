import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useTransition } from '../context/TransitionContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const { isLoggedIn, addToCart } = useAuth();
  const { navigateWithSplash } = useTransition();
  const navigate = useNavigate();

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateWithSplash(`/product/${product.id}`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    if (!isLoggedIn) {
      navigateWithSplash('/auth', {
        from: `/product/${product.id}`,
        message: 'Please sign in to add items to your cart.',
      });
      return;
    }

    addToCart(product.id, 1);
    navigate('/cart');
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={handleViewProduct}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-lg text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={handleViewProduct}
            className="bg-white text-primary font-semibold px-6 py-2 rounded-full text-sm shadow-xl hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">
          {product.category.replace('-', ' ')}
        </span>

        {/* Name */}
        <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-lg font-extrabold text-gray-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleBuyNow}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
              product.inStock
                ? 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
