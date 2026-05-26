import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  LoaderCircle,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, currentUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      setMessage(result.message);

      if (result.ok) {
        if (result.role === "admin") {
          navigate("/admin");
          return;
        }

        if (result.role === "staff") {
          navigate("/staff/products");
          return;
        }

        if (result.role === "seller" && result.sellerStatus !== "approved") {
          navigate("/seller/pending");
          return;
        }

        navigate("/seller");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.02fr,0.98fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1524578271613-89a8c8d0b0d5?auto=format&fit=crop&w=1600&q=80"
            alt="Login page background"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-orange-900/45" />

          <div className="relative flex h-full min-h-[520px] flex-col justify-between p-7 text-white sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <Sparkles className="h-4 w-4" /> Secure access
              </span>
              <h1 className="mt-5 max-w-xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Sign in to manage inventory, sales, and seller tools.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                The dashboard is designed for admin and seller workflows with a
                clean, premium interface that feels fast and focused.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Admin dashboard access",
                "Seller workspace access",
                "Secure role-based login",
                "Clean and fast workflow",
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
              <BadgeCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Role-based access for admin, staff, and seller journeys.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email Address
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-300">
                <KeyRound className="h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {message ? (
            <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <p className="mt-4 text-sm text-slate-500">
            Need a seller account?{" "}
            <Link to="/register" className="font-semibold text-orange-700">
              Register here
            </Link>
          </p>
          {currentUser ? (
            <p className="mt-2 text-xs text-slate-500">
              Current role: {currentUser.role}
            </p>
          ) : null}
        </motion.div>
      </section>
    </AnimatedPage>
  );
}
