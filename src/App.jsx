import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  country: "",
  postalCode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const steps = [
  { label: "Contact", icon: User },
  { label: "Address", icon: MapPin },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: Package },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const order = useMemo(
    () => ({
      items: [
        {
          name: "Minimal Desk Lamp",
          detail: "Matte black · Warm LED",
          price: 89.99,
          quantity: 1,
        },
        {
          name: "Cable Organizer",
          detail: "Set of 3 · Stone gray",
          price: 24.99,
          quantity: 2,
        },
      ],
      shipping: 8.5,
      tax: 11.75,
    }),
    []
  );

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + order.shipping + order.tax;

  function updateField(name, value) {
    let nextValue = value;

    if (name === "cardNumber") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    if (name === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [name]: nextValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateStep(currentStep = step) {
    const nextErrors = {};

    if (currentStep === 0) {
      if (!form.fullName.trim()) {
        nextErrors.fullName = "Full name is required.";
      }

      if (!form.email.trim()) {
        nextErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        nextErrors.email = "Enter a valid email address.";
      }

      if (!form.phone.trim()) {
        nextErrors.phone = "Phone number is required.";
      } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
        nextErrors.phone = "Enter a valid phone number.";
      }
    }

    if (currentStep === 1) {
      if (!form.address.trim()) {
        nextErrors.address = "Street address is required.";
      }

      if (!form.city.trim()) {
        nextErrors.city = "City is required.";
      }

      if (!form.country.trim()) {
        nextErrors.country = "Country is required.";
      }

      if (!form.postalCode.trim()) {
        nextErrors.postalCode = "Postal code is required.";
      }
    }

    if (currentStep === 2) {
      const rawCard = form.cardNumber.replace(/\s/g, "");

      if (!form.cardName.trim()) {
        nextErrors.cardName = "Name on card is required.";
      }

      if (!rawCard) {
        nextErrors.cardNumber = "Card number is required.";
      } else if (!/^\d{13,16}$/.test(rawCard)) {
        nextErrors.cardNumber = "Enter a valid card number.";
      }

      if (!form.expiry.trim()) {
        nextErrors.expiry = "Expiry date is required.";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
        nextErrors.expiry = "Use MM/YY format.";
      }

      if (!form.cvv.trim()) {
        nextErrors.cvv = "CVV is required.";
      } else if (!/^\d{3,4}$/.test(form.cvv)) {
        nextErrors.cvv = "CVV must be 3 or 4 digits.";
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function previousStep() {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function submitPayment() {
    const contactValid = validateStep(0);
    const addressValid = validateStep(1);
    const paymentValid = validateStep(2);

    if (!contactValid) {
      setStep(0);
      return;
    }

    if (!addressValid) {
      setStep(1);
      return;
    }

    if (!paymentValid) {
      setStep(2);
      return;
    }

    setStatus("loading");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.25;
    setStatus(isSuccess ? "success" : "failure");
  }

  function restartCheckout() {
    setForm(initialForm);
    setErrors({});
    setStep(0);
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <ResultScreen
        type="success"
        title="Payment successful"
        message="Your order has been confirmed. A receipt has been sent to your email."
        buttonText="Start new checkout"
        onClick={restartCheckout}
      />
    );
  }

  if (status === "failure") {
    return (
      <ResultScreen
        type="failure"
        title="Payment failed"
        message="We could not process your payment. Please check your card details or try another card."
        buttonText="Try again"
        onClick={() => setStatus("idle")}
      />
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              <Sparkles size={16} />
              Frontend Checkout Flow
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Complete your order
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
              A clean, accessible, responsive checkout experience with form
              validation, loading feedback, and clear payment states.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur">
            <ShieldCheck className="shrink-0 text-emerald-600" size={22} />
            <span>
              <strong className="block text-gray-950">Secure mock checkout</strong>
              Demo only. No real payment is processed.
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <section className="rounded-[2rem] bg-white/90 p-5 shadow-xl shadow-indigo-950/5 ring-1 ring-gray-200 backdrop-blur md:p-8">
            <Stepper step={step} />

            <div className="mt-8">
              {step === 0 && (
                <ContactStep form={form} errors={errors} updateField={updateField} />
              )}

              {step === 1 && (
                <AddressStep form={form} errors={errors} updateField={updateField} />
              )}

              {step === 2 && (
                <PaymentStep form={form} errors={errors} updateField={updateField} />
              )}

              {step === 3 && <ReviewStep form={form} total={total} />}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={step === 0 || status === "loading"}
                className="rounded-2xl border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitPayment}
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </div>
          </section>

          <OrderSummary order={order} subtotal={subtotal} total={total} />
        </div>
      </div>
    </main>
  );
}

function Stepper({ step }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const active = index === step;
          const complete = index < step;

          return (
            <li key={item.label}>
              <div
                className={[
                  "flex items-center gap-3 rounded-2xl border p-3 transition",
                  active
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-9 w-9 place-items-center rounded-xl",
                    active
                      ? "bg-indigo-600 text-white"
                      : complete
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-500",
                  ].join(" ")}
                >
                  {complete ? <Check size={18} /> : <Icon size={18} />}
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide opacity-70">
                    Step {index + 1}
                  </span>
                  <span className="block font-bold">{item.label}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ContactStep({ form, errors, updateField }) {
  return (
    <StepShell
      eyebrow="Personal information"
      title="How can we contact you?"
      description="Enter your contact details so we can send order updates and your receipt."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Full name"
          name="fullName"
          value={form.fullName}
          error={errors.fullName}
          onChange={updateField}
          placeholder="Mohamad M"
          autoComplete="name"
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={updateField}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          label="Phone number"
          name="phone"
          value={form.phone}
          error={errors.phone}
          onChange={updateField}
          placeholder="+961 70 000 000"
          autoComplete="tel"
          className="md:col-span-2"
        />
      </div>
    </StepShell>
  );
}

function AddressStep({ form, errors, updateField }) {
  return (
    <StepShell
      eyebrow="Shipping address"
      title="Where should we deliver?"
      description="Use a complete address to avoid delivery delays."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Street address"
          name="address"
          value={form.address}
          error={errors.address}
          onChange={updateField}
          placeholder="123 Main Street"
          autoComplete="street-address"
          className="md:col-span-2"
        />
        <Input
          label="Apartment, suite, etc. optional"
          name="apartment"
          value={form.apartment}
          onChange={updateField}
          placeholder="Apartment 4B"
          autoComplete="address-line2"
          className="md:col-span-2"
        />
        <Input
          label="City"
          name="city"
          value={form.city}
          error={errors.city}
          onChange={updateField}
          placeholder="Beirut"
          autoComplete="address-level2"
        />
        <Input
          label="Country"
          name="country"
          value={form.country}
          error={errors.country}
          onChange={updateField}
          placeholder="Lebanon"
          autoComplete="country-name"
        />
        <Input
          label="Postal code"
          name="postalCode"
          value={form.postalCode}
          error={errors.postalCode}
          onChange={updateField}
          placeholder="1107"
          autoComplete="postal-code"
          className="md:col-span-2"
        />
      </div>
    </StepShell>
  );
}

function PaymentStep({ form, errors, updateField }) {
  return (
    <StepShell
      eyebrow="Payment details"
      title="Add your card information"
      description="Card fields are validated locally for this demo. No card data is sent anywhere."
    >
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-gray-950 to-indigo-900 p-6 text-white shadow-xl">
        <div className="mb-10 flex items-center justify-between">
          <span className="text-sm font-semibold text-white/70">Demo Card</span>
          <CreditCard size={30} />
        </div>
        <p className="mb-4 text-xl font-black tracking-[0.18em]">
          {form.cardNumber || "4242 4242 4242 4242"}
        </p>
        <div className="flex items-end justify-between text-sm">
          <span>
            <span className="block text-xs uppercase text-white/50">Card holder</span>
            <strong>{form.cardName || "YOUR NAME"}</strong>
          </span>
          <span>
            <span className="block text-xs uppercase text-white/50">Expires</span>
            <strong>{form.expiry || "MM/YY"}</strong>
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Name on card"
          name="cardName"
          value={form.cardName}
          error={errors.cardName}
          onChange={updateField}
          placeholder="Mohamad M"
          autoComplete="cc-name"
          className="md:col-span-2"
        />
        <Input
          label="Card number"
          name="cardNumber"
          value={form.cardNumber}
          error={errors.cardNumber}
          onChange={updateField}
          placeholder="4242 4242 4242 4242"
          autoComplete="cc-number"
          inputMode="numeric"
          className="md:col-span-2"
        />
        <Input
          label="Expiry date"
          name="expiry"
          value={form.expiry}
          error={errors.expiry}
          onChange={updateField}
          placeholder="MM/YY"
          autoComplete="cc-exp"
          inputMode="numeric"
        />
        <Input
          label="CVV"
          name="cvv"
          value={form.cvv}
          error={errors.cvv}
          onChange={updateField}
          placeholder="123"
          autoComplete="cc-csc"
          inputMode="numeric"
        />
      </div>
    </StepShell>
  );
}

function ReviewStep({ form, total }) {
  return (
    <StepShell
      eyebrow="Review order"
      title="Confirm your details"
      description="Check the information below before submitting the mock payment."
    >
      <div className="grid gap-4">
        <ReviewCard title="Contact">
          <p>{form.fullName}</p>
          <p>{form.email}</p>
          <p>{form.phone}</p>
        </ReviewCard>

        <ReviewCard title="Address">
          <p>{form.address}</p>
          {form.apartment && <p>{form.apartment}</p>}
          <p>
            {form.city}, {form.postalCode}
          </p>
          <p>{form.country}</p>
        </ReviewCard>

        <ReviewCard title="Payment">
          <p>{form.cardName}</p>
          <p>Card ending in {form.cardNumber.slice(-4)}</p>
          <p>Expires {form.expiry}</p>
        </ReviewCard>

        <div className="rounded-3xl bg-indigo-50 p-5 text-indigo-950 ring-1 ring-indigo-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total due today</span>
            <strong className="text-2xl">${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function StepShell({ eyebrow, title, description, children }) {
  return (
    <section>
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-black text-gray-950 md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl leading-7 text-gray-600">{description}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Input({
  label,
  name,
  value,
  error,
  onChange,
  className = "",
  type = "text",
  ...props
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        className={[
          "w-full rounded-2xl border bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400",
          error
            ? "border-red-300 ring-4 ring-red-100"
            : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100",
        ].join(" ")}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600"
        >
          <AlertCircle size={15} />
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewCard({ title, children }) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 font-black text-gray-950">{title}</h3>
      <div className="space-y-1 text-gray-600">{children}</div>
    </article>
  );
}

function OrderSummary({ order, subtotal, total }) {
  return (
    <aside className="h-fit rounded-[2rem] bg-gray-950 p-5 text-white shadow-2xl shadow-gray-950/20 lg:sticky lg:top-8 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Summary
          </p>
          <h2 className="mt-1 text-2xl font-black">Your cart</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
          <Package />
        </div>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.name}
            className="flex gap-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10"
          >
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-gray-950">
              <Package />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="mt-1 text-sm text-white/60">{item.detail}</p>
              <p className="mt-2 text-sm text-white/70">Qty {item.quantity}</p>
            </div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        ))}
      </div>

      <div className="my-6 h-px bg-white/10" />

      <dl className="space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <SummaryRow label="Shipping" value={`$${order.shipping.toFixed(2)}`} />
        <SummaryRow label="Estimated tax" value={`$${order.tax.toFixed(2)}`} />
      </dl>

      <div className="my-6 h-px bg-white/10" />

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Total</span>
        <strong className="text-3xl">${total.toFixed(2)}</strong>
      </div>

      <div className="mt-6 rounded-3xl bg-emerald-400/10 p-4 text-sm text-emerald-100 ring-1 ring-emerald-300/20">
        <div className="mb-1 flex items-center gap-2 font-bold">
          <Lock size={16} />
          Protected checkout
        </div>
        <p className="leading-6 text-emerald-50/80">
          This is a frontend mock. In production, card data should be handled by a
          PCI-compliant provider.
        </p>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-white/70">
      <dt>{label}</dt>
      <dd className="font-semibold text-white">{value}</dd>
    </div>
  );
}

function ResultScreen({ type, title, message, buttonText, onClick }) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-indigo-950/10 ring-1 ring-gray-200">
        <div
          className={[
            "mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full",
            isSuccess
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600",
          ].join(" ")}
        >
          <Icon size={44} />
        </div>

        <p
          className={[
            "mb-2 text-sm font-black uppercase tracking-[0.2em]",
            isSuccess ? "text-emerald-600" : "text-red-600",
          ].join(" ")}
        >
          {isSuccess ? "Confirmed" : "Action needed"}
        </p>

        <h1 className="text-3xl font-black text-gray-950">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm leading-7 text-gray-600">{message}</p>

        <button
          type="button"
          onClick={onClick}
          className="mt-8 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          {buttonText}
        </button>
      </section>
    </main>
  );
}
