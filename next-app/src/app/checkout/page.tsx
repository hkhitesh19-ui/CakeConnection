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
import { cn, formatPrice, formatTimeSlotDisplay, SYSTEM_DELIVERY_INSTRUCTIONS } from '@/utils';
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
  // Steps: Cart (always done), Details (step 1), Payment (step 2)
  const steps = [
    { num: 0, label: 'Cart', icon: '🛒' },
    { num: 1, label: 'Details' },
    { num: 2, label: 'Payment' },
  ];
  return (
    <nav aria-label="Order progress" className="flex items-center justify-center gap-0 max-w-xs mx-auto sm:max-w-sm">
      {steps.map((step, idx) => {
        const isDone = step.num === 0 || currentStep > step.num;
        const isActive = currentStep === step.num;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                isDone
                  ? 'bg-brand-rose text-white shadow-md'
                  : isActive
                    ? 'bg-brand-rose text-white shadow-lg shadow-brand-rose/30'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
              )}>
                {isDone && step.num !== currentStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  step.icon || (step.num + 1)
                )}
              </div>
              <span className={cn(
                'mt-1 text-[11px] font-medium whitespace-nowrap',
                isDone || isActive ? 'text-brand-rose font-bold' : 'text-gray-400'
              )}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                'w-10 sm:w-14 h-0.5 mx-2 mb-4 transition-colors',
                isDone ? 'bg-brand-rose' : 'bg-gray-200'
              )} />
            )}
          </div>
        );
      })}
    </nav>
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

interface OrderSuccessData {
  orderNumber: string;
  deliveryDate: string;
  deliverySlot: string;
  senderWhatsApp?: string;
  total?: number;
}

function OrderSuccessModal({ data, onClose }: { data: OrderSuccessData; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanWhatsAppSlot = data.deliverySlot || 'Standard Delivery (No Fix Time)';
  const whatsappMessage = encodeURIComponent(
    `Hello Cake Connection! 🎂\nI have placed Order #${data.orderNumber}${data.total ? ` (Total: ₹${data.total})` : ''}.\n` +
    `📅 Delivery Date: ${data.deliveryDate}\n⏰ Time Slot: ${cleanWhatsAppSlot}\n\n` +
    `Please share the cake pickup photo and delivery updates on this WhatsApp.`
  );

  const whatsappUrl = `https://wa.me/917203824012?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="max-w-lg w-full rounded-3xl bg-surface-primary border border-border-secondary p-6 sm:p-7 text-center shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 14 }}
          className="mx-auto mb-3.5 w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
        >
          <PartyPopper className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
          Order Placed! 🎉
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm mb-4">
          Your order has been confirmed and is being prepared with artisan craftsmanship.
        </p>

        {/* Order Details Pill */}
        <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-3.5 mb-4 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Order Number:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-brand-rose text-sm">#{data.orderNumber}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] bg-brand-rose/10 text-brand-rose px-2 py-0.5 rounded font-medium hover:bg-brand-rose/20 transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border-secondary/40 pt-1.5">
            <span className="text-text-muted">Delivery Schedule:</span>
            <span className="font-semibold text-text-primary text-right">{data.deliveryDate} • {cleanWhatsAppSlot}</span>
          </div>
          {data.total ? (
            <div className="flex items-center justify-between border-t border-border-secondary/40 pt-1.5">
              <span className="text-text-muted">Total Amount:</span>
              <span className="font-bold text-emerald-600 text-sm">₹{data.total}</span>
            </div>
          ) : null}
        </div>

        {/* Important Delivery & Surprise Policy Box */}
        <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-3.5 sm:p-4 mb-5 text-left text-xs">
          <h4 className="font-bold text-rose-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📌 Important Delivery & Surprise Instructions:</span>
          </h4>
          <ul className="space-y-1.5 text-gray-700 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>Pickup Photo:</strong> Sender will get pickup-time product photo on WhatsApp.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>Delivery Update:</strong> Immediate WhatsApp update sent once delivery is complete.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>Weather Delay:</strong> Weather or external transit delay updates will be sent on WhatsApp.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>Surprise Policy:</strong> Sender's name is NOT shared with receiver until delivery is done.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>Doorstep Rule:</strong> Once rider reaches address, sender's name is shared per company rule.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand-rose font-bold shrink-0">•</span>
              <span><strong>No Calls Preferred:</strong> We prefer WhatsApp message with Order Number & Delivery Date (+91 72038 24012).</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            Connect on WhatsApp (+91 72038 24012)
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border-secondary bg-surface-secondary text-text-primary text-xs font-semibold hover:bg-surface-tertiary transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            Return to Homepage
          </button>
        </div>
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
  const [orderSuccessData, setOrderSuccessData] = useState<OrderSuccessData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    receiverName: '',
    senderWhatsApp: '',
    senderCountryCode: '',
    senderPhone: '',
    addressLine1: '',
    addressLine2: '',
    deliveryArea: '',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '',
    saveAddress: true,
    paymentMethod: 'razorpay',
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
    return items[0]?.deliverySlot ? formatTimeSlotDisplay(items[0].deliverySlot) : '';
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
    if (festivalMatch && festivalMatch.slots && festivalMatch.slots.length > 0) {
      return festivalMatch.slots.map((label) => ({ label: formatTimeSlotDisplay(label) }));
    }
    const baseSlots = deliverySlots && deliverySlots.length > 0 ? deliverySlots : [
      { label: '10:00 AM - 01:00 PM (No Fix Time)', cutoffHour: 8 },
      { label: '12:00 PM - 03:00 PM (No Fix Time)', cutoffHour: 11 },
      { label: '03:00 PM - 06:00 PM (No Fix Time)', cutoffHour: 14 },
      { label: '06:00 PM - 09:00 PM (No Fix Time)', cutoffHour: 17 },
    ];
    return baseSlots.map((s) => ({ ...s, label: formatTimeSlotDisplay(s.label) }));
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
    if (items.length === 0 && !orderSuccessData) {
      navigate.push('/cart');
    }
  }, [items.length, navigate, orderSuccessData]);

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
    } else if (!form.senderCountryCode) {
      errors.senderWhatsApp = 'Please select a Country Code';
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
      alert('Please check the "I agree to the Terms & Conditions" box before placing the order.');
      return;
    }
    setIsPlacing(true);
    
    try {
      const senderWhatsApp = form.senderWhatsApp.trim()
        ? `${form.senderCountryCode}${form.senderWhatsApp.trim()}`
        : '';

      const finalDeliverySlot = formatTimeSlotDisplay(deliverySlot || availableSlots[0]?.label || 'Standard Delivery');

      // Notes for delivery area / phone if needed
      const orderNotes = [
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
          customMessage: i.customMessage || '',
          slug: i.slug || '',
          category: i.category || 'cakes',
        })),
        subtotal,
        delivery_charge: deliveryCharge,
        total: finalTotal,
        payment_method: form.paymentMethod,
        special_instructions: orderNotes || null,
        delivery_date: deliveryDate,
        delivery_slot: finalDeliverySlot,
      };

      const dispatchInvoice = async (orderNumber: string) => {
        try {
          const orderDetails = {
            id: orderNumber,
            customer: {
              name: orderPayload.customer_name,
              email: orderPayload.customer_email,
              phone: orderPayload.customer_phone,
              address: `${orderPayload.delivery_address.addressLine1}, ${orderPayload.delivery_address.deliveryArea || ''}, ${orderPayload.delivery_address.city}, ${orderPayload.delivery_address.state} - ${orderPayload.delivery_address.pincode}`
            },
            sender: {
              name: form.fullName,
              email: form.email,
              phone: form.senderPhone || form.phone,
              whatsapp: senderWhatsApp,
            },
            receiver: {
              name: form.receiverName,
              phone: form.phone,
              addressLine1: form.addressLine1,
              addressLine2: form.addressLine2,
              deliveryArea: form.deliveryArea,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            },
            deliveryDate: deliveryDate,
            deliverySlot: finalDeliverySlot,
            paymentMethod: form.paymentMethod,
            paymentStatus: form.paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Paid Online (Verified)',
            subtotal,
            deliveryCharge,
            codCharge,
            totalAmount: finalTotal,
            products: orderPayload.items.map((item: any) => ({
              name: item.name,
              variantName: item.weight || 'Default',
              quantity: item.quantity,
              price: item.price,
              image: item.image,
              customMessage: item.customMessage || '',
              slug: item.slug || '',
              category: item.category || 'cakes',
              productId: item.productId,
            })),
          };

          await fetch('/api/order/send-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
          });
        } catch (err) {
          console.error('Failed to send invoice:', err);
        }
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
          alert('Failed to create order: ' + (orderResult.message || 'Unknown error'));
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
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
            
            // Check if key is a placeholder or missing
            if (!razorpayKeyId || razorpayKeyId.includes('YOUR_RAZORPAY')) {
              console.warn('Razorpay keys not configured. Simulating successful payment for testing.');
              addToast({ type: 'info', message: 'Test Mode: Simulating Razorpay Payment...' });
              
              // Simulate API delay
              await new Promise((resolve) => setTimeout(resolve, 1500));
              
              // Directly call verify endpoint (mock)
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: paymentResult.data.orderId,
                  razorpay_payment_id: 'pay_mock_' + Date.now(),
                  razorpay_signature: 'mock_signature',
                  order_number: orderResult.data.order_number,
                }),
              });
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success) {
                const successData: OrderSuccessData = {
                  orderNumber: orderResult.data.order_number,
                  deliveryDate,
                  deliverySlot: finalDeliverySlot,
                  senderWhatsApp,
                  total: finalTotal,
                };
                setOrderSuccessData(successData);
                clearCart();
                dispatchInvoice(orderResult.data.order_number);
                addToast({ type: 'success', message: 'Test Payment successful! Order placed.' });
              } else {
                addToast({ type: 'error', message: 'Payment verification failed.' });
              }
              setIsPlacing(false);
              return;
            }

            // Step 3: Load Razorpay script dynamically
            if (typeof window !== 'undefined') {
              const res = await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
              });

              if (!res || !(window as any).Razorpay) {
                addToast({ type: 'error', message: 'Failed to load payment gateway. Please try again.' });
                setIsPlacing(false);
                return;
              }

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
                      const successData: OrderSuccessData = {
                        orderNumber: orderResult.data.order_number,
                        deliveryDate,
                        deliverySlot: finalDeliverySlot,
                        senderWhatsApp,
                        total: finalTotal,
                      };
                      setOrderSuccessData(successData);
                      clearCart();
                      dispatchInvoice(orderResult.data.order_number);
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
        } catch (error) {
          console.warn('Razorpay integration failed:', error);
          alert('Failed to initialize payment gateway.');
          setIsPlacing(false);
          return;
        }
      } else {
        // COD flow — simple order creation
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        const result = await response.json();
        if (result.success) {
          const successData: OrderSuccessData = {
            orderNumber: result.data.order_number,
            deliveryDate,
            deliverySlot: finalDeliverySlot,
            senderWhatsApp,
            total: finalTotal,
          };
          setOrderSuccessData(successData);
          clearCart();
          dispatchInvoice(result.data.order_number);
          addToast({ type: 'success', message: 'Order placed successfully!' });
        } else {
          addToast({ type: 'error', message: result.message || 'Failed to place order.' });
          alert('Failed to place order: ' + (result.message || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Error placing order:', err);
      addToast({ type: 'error', message: 'Failed to place order. Connection error.' });
      alert('Error placing order. Please try again.');
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

  if (orderSuccessData) {
    return <OrderSuccessModal data={orderSuccessData} onClose={() => navigate.push('/')} />;
  }

  return (
    <>
      <SEOHead title="Checkout" description="Complete your order." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Header */}
        <section className="relative overflow-hidden bg-white border-b border-gray-150 py-3 sm:py-4">
          <Container as="div" size="xl" className="relative">
            <motion.div variants={fadeUp}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Link href="/" className="hover:text-brand-rose transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                  <Link href="/cart" className="hover:text-brand-rose transition-colors">Cart</Link>
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                  <span className="text-brand-rose font-medium">Checkout</span>
                </nav>
              </div>
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

                      <div className="rounded-2xl bg-surface-secondary border border-border-secondary p-3.5 sm:p-4 space-y-3">
                        {/* Sender Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border-secondary/30 pt-3">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border-secondary/30 pt-3">
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
                        <div className="border-t border-border-secondary/30 pt-3">
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
                        <div className="border-t border-border-secondary/30 pt-3">
                          <div>
                            <FormInput label="Delivery Address" required placeholder="Flat / House No, Building, Society, Street" value={form.addressLine1} onChange={(e) => updateField('addressLine1', (e.target as HTMLInputElement).value)} />
                            {formErrors.addressLine1 && <p className="text-xs text-brand-red mt-1">{formErrors.addressLine1}</p>}
                          </div>
                        </div>

                        {/* City & State (Fixed) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                              value={deliverySlot ? formatTimeSlotDisplay(deliverySlot) : "Standard Delivery (No Fix Time)"}
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
                              <span>{deliverySlot ? formatTimeSlotDisplay(deliverySlot) : 'Standard Delivery (No Fix Time)'}</span>
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
                          className="accent-brand-rose mt-1 w-5 h-5"
                        />
                        <span className="text-lg font-medium text-text-primary leading-relaxed">
                          I agree to the <span className="text-brand-rose font-bold">Terms & Conditions</span> and <span className="text-brand-rose font-bold">Privacy Policy</span>. I understand that my order will be delivered to the address provided above.
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


