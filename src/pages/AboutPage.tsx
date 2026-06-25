import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-teal-600 to-emerald-700 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton label="Back" className="mb-6 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 animate-slide-up">
              About Heart Pharma
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              We are a trusted pharmacy dedicated to making quality healthcare accessible to everyone. 
              With years of experience, we deliver genuine medicines and health products right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-teal-100 animate-slide-up">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide affordable, genuine, and accessible healthcare products to every household. 
                We strive to be the most trusted pharmacy brand by maintaining the highest standards of 
                quality and customer service.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="text-4xl mb-4">🔭</div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become India's most loved pharmacy brand, known for reliability, innovation, and 
                compassion. We envision a future where quality healthcare is just a click away for 
                every person, regardless of their location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '50,000+', label: 'Happy Customers', icon: '😊' },
              { value: '10,000+', label: 'Products Available', icon: '💊' },
              { value: '500+', label: 'Cities Served', icon: '🏙️' },
              { value: '24/7', label: 'Customer Support', icon: '📞' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-6">
                Built with Care, Driven by Purpose
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Heart Pharma was founded with a simple yet powerful belief: everyone deserves access to 
                  genuine, affordable healthcare. What started as a small neighborhood pharmacy has grown 
                  into a trusted health partner for thousands of families across India.
                </p>
                <p>
                  Our team of licensed pharmacists, healthcare professionals, and dedicated support staff 
                  work tirelessly to ensure you receive the best products and guidance for your health needs. 
                  Every product is sourced directly from authorized manufacturers and stored under optimal conditions.
                </p>
                <p>
                  We're not just a pharmacy — we're your health partner. Whether you need a common cold 
                  remedy or specialized medical equipment, Heart Pharma is here to help with expert advice 
                  and genuine products at the best prices.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-teal-100 rounded-3xl -rotate-3" />
              <img
                src="https://images.pexels.com/photos/8657287/pexels-photo-8657287.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Heart Pharma team"
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              These values guide everything we do at Heart Pharma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💎',
                title: 'Authenticity',
                desc: '100% genuine products sourced directly from licensed manufacturers. No compromises on quality.',
              },
              {
                icon: '❤️',
                title: 'Compassion',
                desc: 'We treat every customer like family. Your health and well-being are our top priority.',
              },
              {
                icon: '🌟',
                title: 'Excellence',
                desc: 'We strive for excellence in every interaction, from product quality to customer service.',
              },
              {
                icon: '🤝',
                title: 'Trust',
                desc: 'Building lasting relationships through transparency, honesty, and consistent reliability.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                desc: 'Continuously improving our services and technology to serve you better.',
              },
              {
                icon: '🌍',
                title: 'Accessibility',
                desc: 'Making quality healthcare accessible and affordable for everyone, everywhere.',
              },
            ].map((value, i) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary via-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Experience Heart Pharma?
          </h2>
          <p className="text-lg text-teal-100 mb-8">
            Join over 50,000 families who trust us with their health needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Products
            </Link>
            <Link
              to="/auth"
              className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
