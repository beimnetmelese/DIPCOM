import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

export function RegisterPage() {
  const { registerSeller } = useAppContext();
  const phonePrefix = "+251";
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    location: "",
    tinNumber: "",
    phoneNumber: "",
    password: "",
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const fullPhoneNumber = `${phonePrefix}${form.phoneNumber}`;
    try {
      const result = await registerSeller({
        ...form,
        phoneNumber: fullPhoneNumber,
      });
      if (result.ok) {
        setSubmitted(true);
        setForm({
          name: "",
          email: "",
          businessName: "",
          location: "",
          tinNumber: "",
          phoneNumber: "",
          password: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
            alt="Seller registration background"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-orange-900/55" />

          <div className="relative flex h-full min-h-[520px] flex-col justify-between p-7 text-white sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <Building2 className="h-4 w-4" /> Business onboarding
              </span>
              <h1 className="mt-5 max-w-xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Create a business profile for DIPCOM Technology Solutions.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                Register your business, submit your details, and wait for admin
                approval before you access the seller workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Verified business details",
                "Admin approval workflow",
                "Clean dashboard access",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <ShieldCheck className="h-5 w-5 text-orange-200" />
                  <p className="mt-3 text-sm font-medium text-white/90">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900">
                Seller Registration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Submit your business profile to request platform access.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="inline-flex items-center gap-2 font-semibold text-emerald-900">
                <BadgeCheck className="h-4 w-4" /> Pending Approval
              </p>
              <p className="mt-2 text-sm leading-7 text-emerald-800">
                Your registration has been submitted successfully and is now
                waiting for admin review.
              </p>
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Full Name
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <UserPlus className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email Address
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Business Name
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Business Name"
                  value={form.businessName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      businessName: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Location
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Fully qualified address"
                  value={form.location}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              TIN Number
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="TIN number"
                  value={form.tinNumber}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      tinNumber: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Phone Number
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="border-r border-slate-300 pr-3 text-sm font-semibold text-slate-700">
                  {phonePrefix}
                </span>
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="911224323"
                  type="tel"
                  value={form.phoneNumber}
                  inputMode="numeric"
                  pattern="[0-9]{9}"
                  maxLength={9}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9),
                    }))
                  }
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </section>
    </AnimatedPage>
  );
}
