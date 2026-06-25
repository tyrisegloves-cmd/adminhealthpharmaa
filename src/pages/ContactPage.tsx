import { useState } from 'react';
import BackButton from '../components/BackButton';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-teal-600 to-emerald-700 py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton label="Back" className="mb-5 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 animate-slide-up">Contact Us</h1>
          <p className="text-teal-100 max-w-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            Have questions? We'd love to hear from you. Our team is always here to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {[
              {
                icon: '📍',
                title: 'Visit Us',
                lines: ['123 Health Avenue', 'Medical District', 'Mumbai 400001, India'],
              },
              {
                icon: '📞',
                title: 'Call Us',
                lines: ['+91 98765 43210', '+91 11234 56789', 'Mon-Sun: 8AM - 10PM'],
              },
              {
                icon: '✉️',
                title: 'Email Us',
                lines: ['care@heartpharma.in', 'support@heartpharma.in', 'orders@heartpharma.in'],
              },
              {
                icon: '💬',
                title: 'Live Chat',
                lines: ['Available 24/7', 'Average response: < 2 min', 'Click the chat icon below'],
              },
            ].map((info, i) => (
              <div
                key={info.title}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{info.title}</h3>
                    {info.lines.map((line) => (
                      <p key={line} className="text-sm text-gray-500">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-scale-in">✅</div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send us a Message</h2>
                  <p className="text-sm text-gray-500 mb-6">Fill out the form below and we'll respond promptly.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="order">Order Inquiry</option>
                          <option value="product">Product Information</option>
                          <option value="prescription">Prescription Upload</option>
                          <option value="returns">Returns & Refunds</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                q: 'How do I upload my prescription?',
                a: 'You can upload your prescription through our Contact page or send it via email to orders@heartpharma.in. Our pharmacists will verify and process your order.',
              },
              {
                q: 'What is your delivery time?',
                a: 'We offer same-day delivery within city limits and 2-3 business days for other locations. Express shipping is also available.',
              },
              {
                q: 'Are all products genuine?',
                a: 'Yes, 100% of our products are sourced directly from authorized manufacturers and distributors. We guarantee authenticity.',
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 7-day return policy for unopened products. Medicines cannot be returned due to safety regulations.',
              },
            ].map((faq, i) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <h3 className="font-bold text-gray-800 mb-2 flex items-start gap-2">
                  <span className="text-primary mt-0.5">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
