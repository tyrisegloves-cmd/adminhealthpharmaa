import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import BackButton from '../components/BackButton';
import HeartLogo from '../components/HeartLogo';
import { db, type AdminOrder } from '../data/db';

type Step = 'review' | 'payment' | 'processing' | 'receipt';
type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';

function generateOrderId() {
  const d = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${rand}`;
}

export default function CheckoutPage() {
  const { user, isLoggedIn, cart, clearCart } = useAuth();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>('review');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [orderId] = useState(generateOrderId);
  const [orderDate] = useState(new Date());
  const [processingProgress, setProcessingProgress] = useState(0);

  // Build cart items
  const cartItems = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
        .filter((item) => item.product),
    [cart]
  );

  const cartTotal = cartItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const cartOriginal = cartItems.reduce((s, i) => s + (i.product?.originalPrice || 0) * i.quantity, 0);
  const cartSavings = cartOriginal - cartTotal;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Redirect if empty cart or not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate('/auth', { state: { from: '/checkout', message: 'Sign in to checkout.' } });
    else if (cart.length === 0 && step !== 'receipt') navigate('/cart');
  }, [isLoggedIn, cart, step, navigate]);

  // Processing animation
  useEffect(() => {
    if (step !== 'processing') return;
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    const done = setTimeout(() => {
      // Save order to db
      const newOrder: AdminOrder = {
        id: orderId,
        customerId: user.email, // Use email as unique identifier or guest
        customerName: user.name,
        customerEmail: user.email,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.product?.name || '',
          quantity: item.quantity,
          price: item.product?.price || 0,
        })),
        total: cartTotal,
        status: 'pending',
        date: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        address: '123 Health Avenue, Apt 4B, Medical District, Mumbai 400001',
      };
      const currentOrders = db.getOrders();
      db.saveOrders([newOrder, ...currentOrders]);

      clearCart();
      setStep('receipt');
    }, 3200);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [step, clearCart]);

  const handlePay = () => {
    if (!paymentMethod) return;
    setStep('processing');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isLoggedIn || !user) return null;

  const paymentLabel: Record<PaymentMethod, string> = {
    cod: 'Cash on Delivery',
    upi: 'UPI Payment',
    card: 'Credit / Debit Card',
    netbanking: 'Net Banking',
  };

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'review', label: 'Review', num: 1 },
    { key: 'payment', label: 'Payment', num: 2 },
    { key: 'receipt', label: 'Receipt', num: 3 },
  ];
  const stepIndex = step === 'processing' ? 1 : steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {step !== 'receipt' && step !== 'processing' && (
            <BackButton label="Back" className="mb-5 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />
          )}
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/15 flex items-center justify-center text-3xl">
              {step === 'receipt' ? '✅' : step === 'processing' ? '⏳' : '💳'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {step === 'receipt' ? 'Order Confirmed!' : step === 'processing' ? 'Processing…' : 'Checkout'}
              </h1>
              <p className="text-teal-100 text-sm mt-0.5">
                {step === 'receipt'
                  ? `Order ${orderId}`
                  : step === 'processing'
                  ? 'Please wait while we process your payment'
                  : 'Review your order and complete payment'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper (hide during processing) */}
        {step !== 'processing' && (
          <div className="mb-8 flex items-center justify-center">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < stepIndex
                        ? 'bg-primary text-white'
                        : i === stepIndex
                        ? 'bg-primary text-white shadow-lg ring-4 ring-primary/10'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${i <= stepIndex ? 'text-primary' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-16 sm:w-24 mx-2 mb-5">
                    <div className="h-0.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: i < stepIndex ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══ STEP 1 — REVIEW ═══ */}
        {step === 'review' && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 animate-fade-in">
            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-extrabold text-gray-900">Order Summary ({cartCount} items)</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map(({ productId, quantity, product }) => {
                  if (!product) return null;
                  return (
                    <div key={productId} className="px-6 py-4 flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <span className="font-extrabold text-gray-900 text-sm">₹{product.price * quantity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cartOriginal}</span></div>
                {cartSavings > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{cartSavings}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-semibold">FREE</span></div>
                <div className="flex justify-between pt-2 border-t border-dashed border-gray-200"><span className="font-extrabold text-gray-900">Total</span><span className="font-extrabold text-gray-900 text-lg">₹{cartTotal}</span></div>
              </div>
            </div>

            {/* Delivery info + next */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Delivery To</h3>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🏠</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">123 Health Avenue, Apt 4B, Medical District, Mumbai 400001</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep('payment')}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm"
              >
                Continue to Payment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 — PAYMENT ═══ */}
        {step === 'payment' && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 animate-fade-in">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-extrabold text-gray-900">Choose Payment Method</h2>
                </div>
                <div className="p-4 space-y-3">
                  {/* COD */}
                  {([
                    { id: 'cod' as PaymentMethod, icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { id: 'upi' as PaymentMethod, icon: '📱', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm, etc.' },
                    { id: 'card' as PaymentMethod, icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'netbanking' as PaymentMethod, icon: '🏦', label: 'Net Banking', desc: 'All major banks supported' },
                  ]).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === m.id
                          ? 'border-primary bg-teal-50 shadow-md'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === m.id ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === m.id && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment details form */}
              {paymentMethod === 'card' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-slide-up">
                  <h3 className="font-bold text-gray-800 text-sm">Card Details</h3>
                  <input type="text" placeholder="Card Number" value={cardForm.number} onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" value={cardForm.expiry} onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                    <input type="text" placeholder="CVV" value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <input type="text" placeholder="Cardholder Name" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                </div>
              )}
              {paymentMethod === 'upi' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-slide-up">
                  <h3 className="font-bold text-gray-800 text-sm">UPI ID</h3>
                  <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                  <div className="flex gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <span key={app} className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 font-semibold">{app}</span>
                    ))}
                  </div>
                </div>
              )}
              {paymentMethod === 'netbanking' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-slide-up">
                  <h3 className="font-bold text-gray-800 text-sm">Select Bank</h3>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
                    <option value="">Choose your bank</option>
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Yes Bank'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Right summary */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 text-sm">
                <h3 className="font-extrabold text-gray-900">Order Total</h3>
                <div className="flex justify-between text-gray-600"><span>Items ({cartCount})</span><span>₹{cartOriginal}</span></div>
                {cartSavings > 0 && <div className="flex justify-between text-green-600"><span>Savings</span><span>-₹{cartSavings}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-green-600 font-semibold">FREE</span></div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                  <span className="font-extrabold text-gray-900 text-base">Total</span>
                  <span className="font-extrabold text-gray-900 text-xl">₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={!paymentMethod}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {paymentMethod === 'cod' ? (
                  <>Place Order (Cash on Delivery)</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Pay ₹{cartTotal}
                  </>
                )}
              </button>
              <button onClick={() => setStep('review')} className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-2">← Back to Review</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — PROCESSING ═══ */}
        {step === 'processing' && (
          <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-50 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Processing Your Payment</h2>
            <p className="text-gray-500 text-sm mb-6">Please do not close this page…</p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
              <div className="bg-primary h-full rounded-full transition-all ease-linear" style={{ width: `${processingProgress}%`, transitionDuration: '60ms' }} />
            </div>
            <p className="text-xs text-gray-400 mt-3">{processingProgress}%</p>
          </div>
        )}

        {/* ═══ STEP 4 — RECEIPT ═══ */}
        {step === 'receipt' && (
          <div className="animate-fade-in">
            {/* Printable receipt */}
            <div ref={receiptRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto" id="receipt-printable">
              {/* Receipt header */}
              <div className="receipt-header bg-gradient-to-r from-primary via-teal-600 to-emerald-600 px-8 py-6 text-center">
                <HeartLogo size="lg" className="mx-auto mb-1 receipt-emoji" />
                <h2 className="text-xl font-extrabold text-white receipt-brand-name">Heart Pharma</h2>
                <p className="text-teal-100 text-xs receipt-brand-sub">Your Health, Our Heartbeat · heartpharma.in</p>
                <p className="text-teal-200/70 text-[10px] mt-1 receipt-brand-sub">123 Health Avenue, Medical District, Mumbai 400001 · +91 98765 43210</p>
              </div>

              {/* Receipt body */}
              <div className="p-6 sm:p-8 receipt-body">
                {/* Success banner */}
                <div className="receipt-success bg-green-50 rounded-xl p-4 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 receipt-success-icon">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">Payment Successful!</p>
                    <p className="text-xs text-green-600">Your order has been placed and is being prepared.</p>
                  </div>
                </div>

                {/* Receipt title */}
                <div className="text-center mb-5 receipt-title-block hidden">
                  <h3 className="text-lg font-extrabold text-gray-900">ORDER RECEIPT</h3>
                  <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-1" />
                </div>

                {/* Order meta grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm receipt-meta">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Order ID</span>
                    <p className="font-extrabold text-gray-900 text-sm">{orderId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date &amp; Time</span>
                    <p className="font-bold text-gray-800 text-sm">
                      {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}
                      {orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Payment</span>
                    <p className="font-bold text-gray-800 text-sm">{paymentMethod ? paymentLabel[paymentMethod] : '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Status</span>
                    <p className="font-bold text-green-600 text-sm">✓ Confirmed</p>
                  </div>
                </div>

                {/* Customer & delivery */}
                <div className="receipt-customer bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Customer</span>
                      <p className="font-bold text-gray-800 mt-0.5">{user?.name}</p>
                      <p className="text-gray-500 text-xs">{user?.email}</p>
                      <p className="text-gray-500 text-xs">{user?.phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Deliver To</span>
                      <p className="font-bold text-gray-800 mt-0.5">Home</p>
                      <p className="text-gray-500 text-xs">123 Health Avenue, Apt 4B,</p>
                      <p className="text-gray-500 text-xs">Medical District, Mumbai 400001</p>
                    </div>
                  </div>
                </div>

                {/* Items table */}
                <table className="w-full text-sm mb-6 receipt-table">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[5%]">#</th>
                      <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="text-center py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[10%]">Qty</th>
                      <th className="text-right py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[18%]">Unit Price</th>
                      <th className="text-right py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[18%]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(({ productId, quantity, product }, idx) => {
                      if (!product) return null;
                      return (
                        <tr key={productId} className="border-b border-gray-100">
                          <td className="py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                          <td className="py-2.5 pr-2">
                            <div className="flex items-center gap-2">
                              <img src={product.image} alt="" className="w-8 h-8 rounded object-cover receipt-img" />
                              <div>
                                <span className="font-semibold text-gray-800 text-xs sm:text-sm block">{product.name}</span>
                                <span className="text-[10px] text-gray-400 capitalize">{product.category.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 text-center text-gray-700 font-medium">{quantity}</td>
                          <td className="py-2.5 text-right text-gray-600">₹{product.price.toFixed(2)}</td>
                          <td className="py-2.5 text-right font-bold text-gray-900">₹{(product.price * quantity).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="receipt-totals border-t-2 border-gray-300 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                    <span>₹{cartOriginal.toFixed(2)}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{cartSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (incl.)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between pt-2.5 mt-1.5 border-t-2 border-gray-900">
                    <span className="font-extrabold text-gray-900 text-base">GRAND TOTAL</span>
                    <span className="font-extrabold text-gray-900 text-xl">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  {cartSavings > 0 && (
                    <p className="text-xs text-green-600 text-right font-semibold">You saved ₹{cartSavings.toFixed(2)} on this order!</p>
                  )}
                </div>

                {/* Terms / notes */}
                <div className="receipt-notes mt-6 pt-4 border-t border-gray-200 text-[10px] text-gray-400 space-y-1">
                  <p><strong>Note:</strong> This is a computer-generated receipt and does not require a signature.</p>
                  <p>Returns accepted within 7 days of delivery for unopened products. Medicines are non-returnable.</p>
                  <p>For grievances, write to: care@heartpharma.in | Helpline: +91 98765 43210 (Mon-Sun 8AM-10PM)</p>
                </div>

                {/* Footer branding */}
                <div className="receipt-footer mt-5 pt-4 border-t border-dashed border-gray-200 text-center">
                  <p className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5">Thank you for shopping with Heart Pharma! <HeartLogo size="xs" /></p>
                  <p className="text-[10px] text-gray-400 mt-0.5">heartpharma.in · Licensed Pharmacy · GST: 27AABCH1234A1Z5</p>
                </div>
              </div>
            </div>

            {/* Action buttons (hidden on print) */}
            <div className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold px-8 py-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm"
              >
                Continue Shopping
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                View My Orders →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ═══ COMPREHENSIVE PRINT STYLES ═══ */}
      <style>{`
        @media print {
          /* ── Reset everything ── */
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
            transition: none !important;
            animation: none !important;
          }

          /* ── Page setup ── */
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }

          html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* ── Hide everything except the receipt ── */
          body > * {
            display: none !important;
          }
          body > *:has(#receipt-printable),
          body > * * {
            display: revert !important;
          }

          /* Ensure root containers are visible */
          #root, #root > *, #root > * > *, #root > * > * > * {
            display: block !important;
            visibility: visible !important;
          }

          header, footer, nav,
          .no-print,
          .sticky,
          [class*="shadow-primary"],
          button:not(.print-keep),
          a[class*="rounded-xl"] {
            display: none !important;
          }

          /* ── Receipt container ── */
          #receipt-printable {
            position: relative !important;
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
            page-break-inside: avoid;
          }

          /* ── Receipt header — clean black & white ── */
          #receipt-printable .receipt-header {
            background: white !important;
            background-image: none !important;
            padding: 0 0 12pt 0 !important;
            border-bottom: 2pt solid #111 !important;
            margin-bottom: 12pt !important;
          }
          #receipt-printable .receipt-header .receipt-emoji {
            display: none !important;
          }
          #receipt-printable .receipt-header .receipt-brand-name {
            color: #111 !important;
            font-size: 18pt !important;
          }
          #receipt-printable .receipt-header .receipt-brand-sub {
            color: #555 !important;
          }

          /* ── Body content ── */
          #receipt-printable .receipt-body {
            padding: 0 !important;
          }

          /* Success banner — thin bordered */
          #receipt-printable .receipt-success {
            background: white !important;
            border: 1pt solid #16a34a !important;
            border-radius: 4pt !important;
            padding: 8pt 12pt !important;
          }
          #receipt-printable .receipt-success .receipt-success-icon {
            background: white !important;
            border: 1pt solid #16a34a !important;
          }

          /* Title block visible in print */
          #receipt-printable .receipt-title-block {
            display: block !important;
          }

          /* Meta grid */
          #receipt-printable .receipt-meta {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }

          /* Customer block */
          #receipt-printable .receipt-customer {
            background: #f9f9f9 !important;
            border: 1pt solid #ddd !important;
            border-radius: 4pt !important;
          }
          #receipt-printable .receipt-customer .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }

          /* ── Table ── */
          #receipt-printable .receipt-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 10pt !important;
          }
          #receipt-printable .receipt-table th {
            background: #f3f3f3 !important;
            padding: 6pt 4pt !important;
            font-size: 7pt !important;
            border-bottom: 1.5pt solid #333 !important;
          }
          #receipt-printable .receipt-table td {
            padding: 5pt 4pt !important;
            border-bottom: 0.5pt solid #e0e0e0 !important;
          }
          /* Hide thumbnails in print */
          #receipt-printable .receipt-img {
            display: none !important;
          }

          /* ── Totals ── */
          #receipt-printable .receipt-totals {
            border-top: 1.5pt solid #333 !important;
            font-size: 10pt !important;
          }

          /* ── Notes ── */
          #receipt-printable .receipt-notes {
            font-size: 7pt !important;
            color: #777 !important;
            border-top: 0.5pt solid #ddd !important;
          }

          /* ── Footer ── */
          #receipt-printable .receipt-footer {
            border-top: 1pt dashed #ccc !important;
          }
          #receipt-printable .receipt-footer p {
            color: #333 !important;
          }

          /* ── Force black text on all key elements ── */
          #receipt-printable h2,
          #receipt-printable h3,
          #receipt-printable p,
          #receipt-printable span,
          #receipt-printable td,
          #receipt-printable th {
            color: inherit !important;
          }
          #receipt-printable .font-extrabold,
          #receipt-printable .font-bold {
            color: #111 !important;
          }
          #receipt-printable .text-green-600,
          #receipt-printable .text-green-800 {
            color: #16a34a !important;
          }
        }
      `}</style>
    </div>
  );
}
