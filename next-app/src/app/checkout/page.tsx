'use client';
// ============================================
// 2-Step Fast Checkout Page — Cake Connection
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter as useNavigate } from 'next/navigation';
import {
  Home,
  ChevronRight,
  CreditCard,
  Banknote,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  PartyPopper,
  Loader2,
  AlertCircle,
  MessageCircle,
  Calendar,
  Clock,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import CountryCodeSelect from '@/components/ui/CountryCodeSelect';
import { cn, formatPrice } from '@/utils';
import { useCartStore, useUIStore, useSiteStore } from '@/stores';

// ── Types ────────────────────────────────────

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  receiverName: string;
  senderWhatsApp: string;
  senderCountryCode: string;
  senderPhone: string; // New
  addressLine1: string;
  addressLine2: string;
  deliveryArea: string; // New
  city: string;
  state: string;
  pincode: string;
  saveAddress: boolean;
  paymentMethod: 'razorpay' | 'cod';
  specialInstructions: string;
  agreeTerms: boolean;
}

const VADODARA_AREAS = [
  { area: "Alkapuri", pincode: "390007" },
  { area: "Akota", pincode: "390020" },
  { area: "Gotri", pincode: "390021" },
  { area: "Vasna Road", pincode: "390015" },
  { area: "Subhanpura", pincode: "390023" },
  { area: "Manjalpur", pincode: "390011" },
  { area: "Karelibaug", pincode: "390018" },
  { area: "Fatehgunj", pincode: "390002" },
  { area: "Nizampura", pincode: "390002" },
  { area: "Harni Road", pincode: "390022" },
  { area: "Sama-Savli Road", pincode: "390024" },
  { area: "Atladara", pincode: "390012" },
  { area: "Gorwa", pincode: "390016" },
  { area: "Waghodia Road", pincode: "390019" },
  { area: "Tarsali", pincode: "390009" },
  { area: "Sayajigunj", pincode: "390005" },
  { area: "VIP Road", pincode: "390018" },
  { area: "Channi", pincode: "391740" },
  { area: "Bhayli", pincode: "391410" },
  { area: "Sevasi", pincode: "391101" }
];

// ── Animations ───────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
};

// ── Step Indicator ───────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Delivery Info' },
    { num: 2, label: 'Review & Pay' },
  ];
  return (
    <div className="flex items-center justify-center gap-0 sm:gap-2">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
              currentStep > step.num
                ? 'bg-emerald-500 text-white'
                : currentStep === step.num
                  ? 'bg-brand-rose text-white shadow-lg shadow-brand-rose/30'
                  : 'bg-surface-tertiary text-text-muted'
            )}>
              {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
            </div>
            <span className={cn(
              'text-sm font-medium',
              currentStep >= step.num ? 'text-text-primary' : 'text-text-muted'
            )}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              'w-12 sm:w-24 h-px mx-3 sm:mx-4 transition-colors',
              currentStep > step.num ? 'bg-emerald-500' : 'bg-border-secondary'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Input Component ──────────────────────────

function FormInput({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-brand-rose">*</span>}
      </label>
      <input
        {...props}
        className={cn(
          'w-full rounded-xl bg-surface-secondary border border-border-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50 transition-colors',
          props.className
        )}
      />
    </div>
  );
}

// ── Payment Option Card ──────────────────────

function PaymentOption({
  icon: Icon,
  title,
  description,
  extra,
  selected,
  onSelect,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  extra?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer',
        selected
          ? 'border-brand-rose bg-brand-rose/10 shadow-lg shadow-brand-rose/10'
          : 'border-border-secondary bg-surface-secondary hover:border-brand-rose/30'
      )}
    >
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 transition-colors',
        selected ? 'bg-brand-rose text-white' : 'bg-surface-tertiary text-text-muted'
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-text-primary text-sm">{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
        {extra && <p className="text-[10px] text-brand-rose-gold mt-1 font-medium">{extra}</p>}
      </div>
      <div className={cn(
        'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-colors',
        selected ? 'border-brand-rose bg-brand-rose' : 'border-text-muted/40'
      )}>
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>
    </button>
  );
}

// ── Success Modal ────────────────────────────

function OrderSuccessModal({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="max-w-md w-full rounded-3xl bg-surface-primary border border-border-secondary p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
        >
          <PartyPopper className="h-10 w-10 text-emerald-400" />
        </motion.div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Order Placed! 🎉
        </h2>
        <p className="text-text-secondary mb-4">
          Your order has been placed successfully. We'll start preparing it right away!
        </p>
        <div className="inline-block rounded-xl bg-surface-secondary border border-border-secondary px-4 py-2 mb-6">
          <p className="text-xs text-text-muted">Order Number</p>
          <p className="font-mono font-bold text-brand-rose text-lg">{orderNumber}</p>
        </div>
        <p className="text-xs text-text-muted mb-6">
          Redirecting to homepage in a few seconds...
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm hover:bg-brand-rose-dark transition-colors"
        >
          <Home className="h-4 w-4" />
          Go to Homepage
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const addToast = useUIStore((s) => s.addToast);

  const {
    pincodeCharges,
    festivalDates,
    closedDates,
    deliverySlots,
    fetchSettings
  } = useSiteStore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    receiverName: '',
    senderWhatsApp: '',
    senderCountryCode: '+91',
    senderPhone: '',
    addressLine1: '',
    addressLine2: '',
    deliveryArea: '',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '',
    saveAddress: true,
    paymentMethod: 'razorpay',
    specialInstructions: '',
    agreeTerms: false,
  });

  // Schedule selection local states
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [deliveryDate, setDeliveryDate] = useState(() => {
    return items[0]?.deliveryDate || getTomorrowString();
  });
  const [deliverySlot, setDeliverySlot] = useState(() => {
    return items[0]?.deliverySlot || '';
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const subtotal = getSubtotal();

  // Dynamic pincode shipping rate lookup
  const deliveryCharge = useMemo(() => {
    const cleanPincode = form.pincode.trim();
    if (cleanPincode.length === 6) {
      const match = pincodeCharges.find((p) => p.pincode === cleanPincode);
      if (match) {
        return match.charge;
      }
    }
    // Fallback standard delivery charge (Free above 999, else 49)
    return subtotal >= 999 ? 0 : 49;
  }, [form.pincode, pincodeCharges, subtotal]);

  const codCharge = form.paymentMethod === 'cod' ? 29 : 0;
  const finalTotal = subtotal + deliveryCharge + codCharge;

  // Compute allowed delivery slots (checks festival overrides)
  const availableSlots = useMemo(() => {
    if (!deliveryDate) return [];
    const festivalMatch = festivalDates.find((f) => f.date === deliveryDate);
    if (festivalMatch) {
      return festivalMatch.slots.map((label) => ({ label }));
    }
    return deliverySlots;
  }, [deliveryDate, festivalDates, deliverySlots]);

  // Sync / validate timeslots selection when date changes
  useEffect(() => {
    if (availableSlots.length > 0) {
      const isValid = availableSlots.some((s) => s.label === deliverySlot);
      if (!isValid) {
        setDeliverySlot(availableSlots[0].label);
      }
    } else {
      setDeliverySlot('');
    }
  }, [availableSlots, deliverySlot]);

  // Check if date is blocked (closed)
  const isDateClosed = useMemo(() => {
    if (!deliveryDate) return null;
    return closedDates.find((c) => c.date === deliveryDate) || null;
  }, [deliveryDate, closedDates]);

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate.push('/cart');
    }
  }, [items.length, navigate, orderSuccess]);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid email required';
    if (!form.receiverName.trim()) errors.receiverName = 'Required';
    if (!form.phone.trim() || form.phone.length < 10) errors.phone = 'Valid phone required';
    
    // Sender's WhatsApp number is required
    if (!form.senderWhatsApp.trim()) {
      errors.senderWhatsApp = 'Required';
    } else if (form.senderWhatsApp.trim().length < 10) {
      errors.senderWhatsApp = 'Valid phone required (10 digits)';
    }

    // Sender's Phone is optional
    if (form.senderPhone.trim() && form.senderPhone.trim().length < 10) {
      errors.senderPhone = 'Valid phone required (10 digits)';
    }

    if (!form.addressLine1.trim()) errors.addressLine1 = 'Required';
    if (!form.deliveryArea) errors.deliveryArea = 'Required';

    if (isDateClosed) {
      errors.deliveryDate = `Shop closed: ${isDateClosed.reason}`;
    }
    if (!deliveryDate) {
      errors.deliveryDate = 'Required';
    }
    if (!deliverySlot) {
      errors.deliverySlot = 'Required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        addToast({ type: 'error', message: 'Please fill all required fields correctly.' });
        return;
      }
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!form.agreeTerms) {
      addToast({ type: 'warning', message: 'Please agree to terms & conditions' });
      return;
    }
    setIsPlacing(true);
    
    try {
      const senderWhatsApp = form.senderWhatsApp.trim()
        ? `${form.senderCountryCode}${form.senderWhatsApp.trim()}`
        : '';

      // Format special instructions to include sender calling number & delivery area details for the admin
      const specialInstructionsText = [
        form.specialInstructions.trim(),
        form.senderPhone.trim() ? `Sender's Calling Number: ${form.senderPhone.trim()}` : '',
        form.deliveryArea ? `Delivery Area: ${form.deliveryArea}` : ''
      ].filter(Boolean).join('\n');

      const orderPayload = {
        customer_name: form.fullName, // Sender's Name
        customer_email: form.email,
        customer_phone: form.phone, // Receiver's Phone
        sender_whatsapp: senderWhatsApp,
        delivery_address: {
          fullName: form.receiverName, // Receiver's Name
          phone: form.phone, // Receiver's Phone
          addressLine1: form.addressLine1,
          addressLine2: form.deliveryArea, // Simplified: use deliveryArea directly for Address Line 2
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          senderName: form.fullName,
          senderWhatsApp: senderWhatsApp,
          senderPhone: form.senderPhone,
          deliveryArea: form.deliveryArea,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          image: i.image,
          weight: i.weight,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        delivery_charge: deliveryCharge,
        total: finalTotal,
        payment_method: form.paymentMethod,
        special_instructions: form.specialInstructions,
        delivery_date: deliveryDate,
        delivery_slot: deliverySlot,
      };

      // If Razorpay is selected, create order first then open Razorpay modal
      if (form.paymentMethod === 'razorpay') {
        // Step 1: Create order in database with payment_status: 'pending'
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        const orderResult = await orderResponse.json();

        if (!orderResult.success) {
          addToast({ type: 'error', message: orderResult.message || 'Failed to create order.' });
          setIsPlacing(false);
          return;
        }

        // Step 2: Create Razorpay order
        try {
          const paymentResponse = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Math.round(finalTotal * 100), // Amount in paise
              receipt: orderResult.data.order_number,
              notes: {
                order_number: orderResult.data.order_number,
                customer_name: form.fullName,
                customer_email: form.email,
              },
            }),
          });
          const paymentResult = await paymentResponse.json();

          if (paymentResult.success && paymentResult.data?.orderId) {
            // Step 3: Open Razorpay checkout modal
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
            
            if (typeof window !== 'undefined' && (window as any).Razorpay && razorpayKeyId) {
              const options = {
                key: razorpayKeyId,
                amount: Math.round(finalTotal * 100),
                currency: 'INR',
                name: 'Cake Connection',
                description: `Order #${orderResult.data.order_number}`,
                order_id: paymentResult.data.orderId,
                handler: async (response: any) => {
                  // Step 4: Verify payment
                  try {
                    const verifyResponse = await fetch('/api/payments/verify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        order_number: orderResult.data.order_number,
                      }),
                    });
                    const verifyResult = await verifyResponse.json();
                    if (verifyResult.success) {
                      setOrderSuccess(orderResult.data.order_number);
                      clearCart();
                      addToast({ type: 'success', message: 'Payment successful! Order placed.' });
                    } else {
                      addToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
                    }
                  } catch {
                    addToast({ type: 'error', message: 'Payment verification error. Please contact support.' });
                  }
                  setIsPlacing(false);
                },
                prefill: {
                  name: form.fullName,
                  email: form.email,
                  contact: form.phone,
                },
                theme: { color: '#D81B60' },
                modal: {
                  ondismiss: () => {
                    setIsPlacing(false);
                    addToast({ type: 'info', message: 'Payment cancelled. Your order is saved and you can retry.' });
                  },
                },
              };
              const rzp = new (window as any).Razorpay(options);
              rzp.open();
              return; // Don't set isPlacing to false here, Razorpay modal handles it
            }
          }
        } catch {
          // Razorpay not available yet (pre-AWS) — fall through to success with pending payment
          console.warn('Razorpay integration not available. Order created with pending payment.');
        }

        // Fallback: If Razorpay modal couldn't open, still show success (order created in DB)
        setOrderSuccess(orderResult.data.order_number);
        clearCart();
        addToast({ type: 'success', message: 'Order placed! Payment will be collected upon delivery setup.' });
      } else {
        // COD flow — simple order creation
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        const result = await response.json();
        if (result.success) {
          setOrderSuccess(result.data.order_number);
          clearCart();
          addToast({ type: 'success', message: 'Order placed successfully!' });
        } else {
          addToast({ type: 'error', message: result.message || 'Failed to place order.' });
        }
      }
    } catch (err) {
      console.error('Error placing order:', err);
      addToast({ type: 'error', message: 'Failed to place order. Connection error.' });
    } finally {
      setIsPlacing(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <Loader2 className="h-10 w-10 text-brand-rose animate-spin" />
      </div>
    );
  }

  if (orderSuccess) {
    return <OrderSuccessModal orderNumber={orderSuccess} onClose={() => navigate.push('/')} />;
  }

  return (
    <>
      <SEOHead title="Checkout" description="Complete your order." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Header */}
        <section className="relative overflow-hidden bg-surface-primary py-8 sm:py-10">
          <Container as="div" size="xl" className="relative">
            <motion.div variants={fadeUp}>
              <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm">
                <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-brand-rose transition-colors">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
                <Link href="/cart" className="text-text-muted hover:text-brand-rose transition-colors">Cart</Link>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
                <span className="text-text-accent font-medium">Checkout</span>
              </nav>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                Fast Checkout
              </h1>
              <StepIndicator currentStep={currentStep} />
            </motion.div>
          </Container>
        </section>

        {/* Main */}
        <section className="bg-surface-primary pb-24 lg:pb-16">
          <Container as="div" size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 pt-8">

              {/* Left: Steps */}
              <div>
                <AnimatePresence mode="wait">
                  {/* ═══════════════════════════════════════════
                       STEP 1: Delivery Info
                     ═══════════════════════════════════════════ */}
                  {currentStep === 1 && (
                    <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                      <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-brand-rose" />
                        Delivery Information
                      </h2>

                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-5 sm:p-6 space-y-4">
                        {/* Sender Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <FormInput label="Sender's Name" required placeholder="John Doe" value={form.fullName} onChange={(e) => updateField('fullName', (e.target as HTMLInputElement).value)} />
                            {formErrors.fullName && <p className="text-xs text-brand-red mt-1">{formErrors.fullName}</p>}
                          </div>
                          <div>
                            <FormInput label="Sender's Email Address" required placeholder="john@example.com" type="email" value={form.email} onChange={(e) => updateField('email', (e.target as HTMLInputElement).value)} />
                            {formErrors.email && <p className="text-xs text-brand-red mt-1">{formErrors.email}</p>}
                          </div>
                        </div>

                        {/* Sender WhatsApp & Calling Numbers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-secondary/50 pt-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                              Sender's WhatsApp Number <span className="text-brand-rose">*</span>
                            </label>
                            <div className="flex gap-2">
                              <CountryCodeSelect
                                value={form.senderCountryCode}
                                onChange={(code: string) => updateField('senderCountryCode', code)}
                              />
                              <div className="flex-1">
                                <input
                                  type="tel"
                                  value={form.senderWhatsApp}
                                  onChange={(e) => updateField('senderWhatsApp', e.target.value)}
                                  placeholder="98765 43210"
                                  className="w-full rounded-xl bg-surface-secondary border border-border-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50 transition-colors"
                                  id="sender-whatsapp-input"
                                />
                              </div>
                            </div>
                            {formErrors.senderWhatsApp && <p className="text-xs text-brand-red mt-1">{formErrors.senderWhatsApp}</p>}
                          </div>

                          <div>
                            <FormInput label="Sender's Calling Number (Optional)" placeholder="98765 43210" type="tel" value={form.senderPhone} onChange={(e) => updateField('senderPhone', (e.target as HTMLInputElement).value)} />
                            {formErrors.senderPhone && <p className="text-xs text-brand-red mt-1">{formErrors.senderPhone}</p>}
                          </div>
                        </div>

                        {/* Receiver Name & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-secondary/50 pt-4">
                          <div>
                            <FormInput label="Receiver's Name" required placeholder="Jane Doe" value={form.receiverName} onChange={(e) => updateField('receiverName', (e.target as HTMLInputElement).value)} />
                            {formErrors.receiverName && <p className="text-xs text-brand-red mt-1">{formErrors.receiverName}</p>}
                          </div>
                          <div>
                            <FormInput label="Receiver's Calling Number" required placeholder="98765 43210" type="tel" value={form.phone} onChange={(e) => updateField('phone', (e.target as HTMLInputElement).value)} />
                            {formErrors.phone && <p className="text-xs text-brand-red mt-1">{formErrors.phone}</p>}
                          </div>
                        </div>

                        {/* Delivery Area */}
                        <div className="border-t border-border-secondary/50 pt-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                              Delivery Area <span className="text-brand-rose">*</span>
                            </label>
                            <select
                              value={form.deliveryArea}
                              onChange={(e) => {
                                const selectedVal = e.target.value;
                                const areaObj = VADODARA_AREAS.find(a => a.area === selectedVal);
                                updateField('deliveryArea', selectedVal);
                                if (areaObj) {
                                  updateField('pincode', areaObj.pincode);
                                } else {
                                  updateField('pincode', '');
                                }
                              }}
                              className="w-full rounded-xl bg-surface-secondary border border-border-secondary px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-rose/50 transition-colors appearance-none pr-8 cursor-pointer"
                              style={{
                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23807A74' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                              }}
                            >
                              <option value="">Select Delivery Area</option>
                              {VADODARA_AREAS.map((a) => (
                                <option key={a.area} value={a.area}>
                                  {a.area} ({a.pincode})
                                </option>
                              ))}
                            </select>
                            {formErrors.deliveryArea && <p className="text-xs text-brand-red mt-1">{formErrors.deliveryArea}</p>}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="border-t border-border-secondary/50 pt-4">
                          <div>
                            <FormInput label="Delivery Address" required placeholder="Flat / House No, Building, Society, Street" value={form.addressLine1} onChange={(e) => updateField('addressLine1', (e.target as HTMLInputElement).value)} />
                            {formErrors.addressLine1 && <p className="text-xs text-brand-red mt-1">{formErrors.addressLine1}</p>}
                          </div>
                        </div>

                        {/* City & State (Fixed) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <FormInput label="City" disabled value="Vadodara" className="bg-surface-tertiary text-text-muted cursor-not-allowed opacity-80" />
                          </div>
                          <div>
                            <FormInput label="State" disabled value="Gujarat" className="bg-surface-tertiary text-text-muted cursor-not-allowed opacity-80" />
                          </div>
                        </div>

                        {/* Delivery Schedule Options (Disabled) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-secondary/50 pt-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                              <Calendar className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                              Delivery Date (Disabled)
                            </label>
                            <input
                              type="text"
                              disabled
                              value={deliveryDate}
                              className="w-full rounded-xl bg-surface-tertiary border border-border-secondary px-4 py-3 text-sm text-text-muted cursor-not-allowed opacity-80"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                              <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                              Time Slot (Disabled)
                            </label>
                            <input
                              type="text"
                              disabled
                              value={deliverySlot || "Standard Delivery"}
                              className="w-full rounded-xl bg-surface-tertiary border border-border-secondary px-4 py-3 text-sm text-text-muted cursor-not-allowed opacity-80"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                          <input type="checkbox" checked={form.saveAddress} onChange={(e) => updateField('saveAddress', e.target.checked)} className="accent-brand-rose" />
                          <span className="text-sm text-text-secondary">Save this address for future orders</span>
                        </label>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNextStep}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-rose px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-rose/25 hover:bg-brand-rose-dark transition-all cursor-pointer"
                      >
                        Continue to Review & Pay
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ═══════════════════════════════════════════
                       STEP 2: Review & Pay
                     ═══════════════════════════════════════════ */}
                  {currentStep === 2 && (
                    <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                      <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                        <Package className="h-5 w-5 text-brand-rose" />
                        Review & Pay
                      </h2>

                      {/* Address Summary Card */}
                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-brand-rose" /> Order & Delivery Summary
                          </h3>
                          <button onClick={() => setCurrentStep(1)} className="flex items-center gap-1 text-xs text-brand-rose hover:text-brand-rose-light transition-colors cursor-pointer">
                            <Edit3 className="h-3 w-3" /> Change
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Sender Details</p>
                            <p className="text-sm font-semibold text-text-primary">{form.fullName}</p>
                            <p className="text-xs text-text-secondary">Email: {form.email}</p>
                            <p className="text-xs text-text-secondary">WhatsApp: {form.senderCountryCode} {form.senderWhatsApp}</p>
                            {form.senderPhone && (
                              <p className="text-xs text-text-secondary">Calling: {form.senderPhone}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Delivery Details</p>
                            <p className="text-sm font-semibold text-text-primary">{form.receiverName}</p>
                            <p className="text-xs text-text-secondary">Phone: {form.phone}</p>
                            <p className="text-xs text-text-secondary">
                              Address: {form.addressLine1}
                              {form.addressLine2 && `, ${form.addressLine2}`}
                            </p>
                            <p className="text-xs text-text-secondary">
                              Area: {form.deliveryArea}, Vadodara, Gujarat — {form.pincode}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary pt-1">
                              <Calendar className="h-3.5 w-3.5 text-brand-rose" />
                              <span className="font-semibold">{deliveryDate}</span>
                              <span className="text-text-muted">•</span>
                              <Clock className="h-3.5 w-3.5 text-brand-rose" />
                              <span>{deliverySlot || 'Standard Delivery'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-5">
                        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-brand-rose" />
                          Order Items ({getItemCount()})
                        </h3>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-tertiary flex-shrink-0">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary font-medium truncate">{item.name}</p>
                                <p className="text-xs text-text-muted">{item.weight} × {item.quantity}</p>
                              </div>
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-5">
                        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-brand-rose" />
                          Payment Method
                        </h3>
                        <div className="space-y-3">
                          <PaymentOption
                            icon={CreditCard}
                            title="Pay Online (Razorpay)"
                            description="Credit/Debit Card, UPI, Netbanking, Wallets — all in one"
                            selected={form.paymentMethod === 'razorpay'}
                            onSelect={() => updateField('paymentMethod', 'razorpay')}
                          />
                          <PaymentOption
                            icon={Banknote}
                            title="Cash on Delivery"
                            description="Pay when your order arrives"
                            extra="+₹29 COD handling charge"
                            selected={form.paymentMethod === 'cod'}
                            onSelect={() => updateField('paymentMethod', 'cod')}
                          />
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-5">
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                          Special Instructions (optional)
                        </label>
                        <textarea
                          value={form.specialInstructions}
                          onChange={(e) => updateField('specialInstructions', e.target.value)}
                          placeholder="E.g., Add a candle, write 'Happy Birthday Priya' on the cake..."
                          rows={3}
                          className="w-full rounded-xl bg-surface-primary border border-border-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50 transition-colors resize-none"
                        />
                      </div>

                      {/* Price Breakdown (Mobile only — desktop has sidebar) */}
                      <div className="lg:hidden rounded-2xl bg-surface-secondary border border-border-secondary p-5 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Subtotal</span>
                          <span className="text-text-primary">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Delivery</span>
                          <span className={deliveryCharge === 0 ? 'text-emerald-400' : 'text-text-primary'}>
                            {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                          </span>
                        </div>
                        {codCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">COD Charge</span>
                            <span className="text-text-primary">{formatPrice(codCharge)}</span>
                          </div>
                        )}
                        <div className="h-px bg-border-secondary" />
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-text-primary">Total</span>
                          <span className="text-xl font-bold text-brand-rose">{formatPrice(finalTotal)}</span>
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreeTerms}
                          onChange={(e) => updateField('agreeTerms', e.target.checked)}
                          className="accent-brand-rose mt-0.5"
                        />
                        <span className="text-xs text-text-muted leading-relaxed">
                          I agree to the <span className="text-brand-rose">Terms & Conditions</span> and <span className="text-brand-rose">Privacy Policy</span>. I understand that my order will be delivered to the address provided above.
                        </span>
                      </label>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-secondary text-text-primary text-sm font-semibold border border-border-secondary hover:bg-surface-tertiary transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePlaceOrder}
                          disabled={isPlacing}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all cursor-pointer',
                            isPlacing
                              ? 'bg-brand-rose/60 cursor-not-allowed'
                              : 'bg-brand-rose shadow-brand-rose/25 hover:bg-brand-rose-dark'
                          )}
                        >
                          {isPlacing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {form.paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'} — {formatPrice(finalTotal)}
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Sticky Sidebar (Desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-28 glass rounded-2xl p-6 space-y-4">
                  <h2 className="font-display text-lg font-semibold text-text-primary">Order Summary</h2>

                  {/* Items mini list */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-primary truncate">{item.name}</p>
                          <p className="text-[10px] text-text-muted">{item.weight} × {item.quantity}</p>
                        </div>
                        <span className="text-xs font-medium text-text-primary">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border-secondary" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delivery</span>
                      <span className={deliveryCharge === 0 ? 'text-emerald-400' : 'text-text-primary'}>
                        {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                    {codCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">COD Charge</span>
                        <span className="text-text-primary">{formatPrice(codCharge)}</span>
                      </div>
                    )}
                    <div className="h-px bg-border-secondary" />
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-text-primary">Total</span>
                      <span className="text-xl font-bold text-brand-rose">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Address preview when on Step 1 */}
                  {currentStep >= 2 && form.fullName && (
                    <div className="rounded-xl bg-surface-secondary p-3 border border-border-secondary">
                      <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Delivery Info</p>
                      <p className="text-xs font-semibold text-text-primary">{form.receiverName}</p>
                      <p className="text-[10px] text-text-muted">Phone: {form.phone}</p>
                      <p className="text-[10px] text-text-muted truncate">{form.addressLine1}, {form.deliveryArea}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="h-4 w-4 text-brand-rose flex-shrink-0" />
                    <span className="text-[10px] text-text-muted">Your payment is 100% secure & encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-[400] lg:hidden border-t border-border-secondary bg-surface-primary/95 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-text-muted">Total</p>
              <p className="text-xl font-bold text-brand-rose">{formatPrice(finalTotal)}</p>
            </div>
            {currentStep === 1 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm cursor-pointer"
              >
                Review & Pay
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm cursor-pointer disabled:opacity-60"
              >
                {isPlacing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    {form.paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}


