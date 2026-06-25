import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeartLogo from '../components/HeartLogo';
import { products, categories } from '../data/products';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.badge).slice(0, 4);
  const popularProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Open Now — Free Delivery Available
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Your Health,<br />
                Our{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Heartbeat</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-300/30 rounded-full" />
                </span>
                {' '}<HeartLogo size="lg" animate className="inline-block align-middle -mt-2" />
              </h1>

              <p className="text-lg sm:text-xl text-teal-100 mb-8 max-w-xl leading-relaxed">
                Get genuine medicines, vitamins, health devices, and personal care products delivered right to your door. Trusted by over 50,000+ families.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Shop Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                {[
                  { icon: '✅', text: 'Licensed Pharmacy' },
                  { icon: '🚚', text: 'Free Delivery' },
                  { icon: '🔒', text: 'Secure Payments' },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 text-teal-100">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block animate-scale-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
                <img
                  src="https://images.pexels.com/photos/8657359/pexels-photo-8657359.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Pharmacist helping customer"
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">50,000+</p>
                      <p className="text-xs text-gray-500">Happy Customers</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-2xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
                      💊
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">10,000+</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full">
            <path d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.5C672 45.7 768 56.3 864 58.8C960 61.3 1056 55.7 1152 48.5C1248 41.3 1344 32.7 1392 28.3L1440 24V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Browse our wide range of healthcare products organized for your convenience.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.filter((c) => c.id !== 'all').map((cat, i) => (
              <Link
                key={cat.id}
                to="/products"
                className="group bg-gradient-to-br from-white to-gray-50 hover:from-teal-50 hover:to-white border border-gray-100 hover:border-primary/30 rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Featured</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Top Picks for You
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
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Why Choose Heart Pharma?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              We go above and beyond to ensure your health and wellness needs are met with excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🔬',
                title: '100% Genuine',
                desc: 'All products sourced directly from authorized manufacturers with verified authenticity.',
                color: 'from-blue-50 to-blue-100/50',
              },
              {
                icon: '🚀',
                title: 'Fast Delivery',
                desc: 'Same-day delivery within city limits. Express shipping available nationwide.',
                color: 'from-amber-50 to-amber-100/50',
              },
              {
                icon: '👨‍⚕️',
                title: 'Expert Guidance',
                desc: 'Licensed pharmacists available 24/7 for consultations and medication advice.',
                color: 'from-green-50 to-green-100/50',
              },
              {
                icon: '💰',
                title: 'Best Prices',
                desc: 'Competitive pricing with up to 40% off on select products. Price match guarantee.',
                color: 'from-purple-50 to-purple-100/50',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL PRODUCTS PREVIEW ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Our Products</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Popular Products
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
            >
              See All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-gradient-to-r from-primary via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Need a Prescription Filled?
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Upload your prescription and get medicines delivered. Our expert pharmacists will verify and process your order with care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              📋 Upload Prescription
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              📞 Talk to Pharmacist
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">Real reviews from real customers who trust Heart Pharma.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                avatar: '👩',
                rating: 5,
                text: 'Heart Pharma has been my go-to pharmacy for over 2 years. Always genuine medicines and the delivery is super fast! Love the discounts too.',
                date: '2 days ago',
              },
              {
                name: 'Rajesh Kumar',
                avatar: '👨',
                rating: 5,
                text: 'Excellent service! I ordered a BP monitor and it arrived the same day. The pharmacist even called to explain how to use it properly. Highly recommended!',
                date: '1 week ago',
              },
              {
                name: 'Anita Patel',
                avatar: '👩‍🦱',
                rating: 4,
                text: 'Great variety of health products at competitive prices. The app is easy to use and I appreciate the prescription upload feature. Very convenient!',
                date: '2 weeks ago',
              },
            ].map((review, i) => (
              <div
                key={review.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={`text-sm ${j < review.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <span className="text-2xl">{review.avatar}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-14 bg-teal-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Stay Updated on Health & Offers
          </h2>
          <p className="text-gray-500 mb-8">
            Subscribe to our newsletter for health tips, exclusive discounts, and new product alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
