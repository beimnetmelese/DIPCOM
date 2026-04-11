import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";

const services = [
  {
    title: "Printer Imports",
    icon: <Truck className="h-5 w-5" />,
    text: "We import printers and accessories with careful sourcing, inventory planning, and quality checks before items hit the shelf.",
  },
  {
    title: "Printer Repair",
    icon: <Wrench className="h-5 w-5" />,
    text: "We repair printers, replace damaged parts, and help restore devices to dependable working condition for customers and resellers.",
  },
  {
    title: "Training & Setup",
    icon: <GraduationCap className="h-5 w-5" />,
    text: "We give practical training on printer setup, maintenance, troubleshooting, and best practices for store and business teams.",
  },
];

const highlights = [
  "Trusted reseller operations",
  "Modern dashboard and shop experience",
  "Service, repair, and training support",
  "Inventory planning and stock visibility",
];

const steps = [
  {
    title: "Source and import",
    text: "We select reliable printer models and accessories for the market, balancing quality, availability, and value.",
  },
  {
    title: "Inspect and repair",
    text: "Devices are checked, repaired, and prepared for sale so customers get reliable equipment.",
  },
  {
    title: "Train and support",
    text: "We guide teams and customers on usage, maintenance, and operational efficiency.",
  },
];

const testimonials = [
  {
    name: "Alemu T.",
    role: "Retail Partner",
    text: "The inventory flow is clean, the products are organized, and the team is quick with support and repairs.",
  },
  {
    name: "Marta S.",
    role: "School Admin",
    text: "Training was practical and easy to follow. Our staff learned printer setup and maintenance very quickly.",
  },
  {
    name: "Daniel K.",
    role: "Office Manager",
    text: "Their service is professional and the printer repair work saved us time and money. Very dependable team.",
  },
];

export function HomePage() {
  return (
    <AnimatedPage>
      <section className="relative left-1/2 -mt-20 w-screen -translate-x-1/2 overflow-hidden border-y border-orange-100 bg-slate-950 shadow-soft">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&w=1800&q=80"
            alt="Warehouse office background"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/55 to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[1.15fr,0.85fr] lg:px-6 lg:pb-24 lg:pt-36">
          <div className="max-w-3xl text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.28)]">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              <PackageCheck className="h-4 w-4" /> Stock Management & Reseller
              System
            </p>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
              Import printers, repair devices, and train teams with a premium
              business platform.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              This public landing page introduces the full service story behind
              the system: printer imports, repairs, training, and a modern
              reseller experience that feels clean, professional, and
              client-ready.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Shop Products
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur"
                >
                  <CheckCircle2 className="h-4 w-4 text-orange-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              What we do
            </p>
            <div className="mt-4 space-y-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-orange-500/20 p-2 text-orange-200">
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-semibold text-white">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-white/80">
                        {service.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft"
          >
            <div className="inline-flex rounded-xl bg-orange-100 p-3 text-orange-700">
              {service.icon}
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {service.text}
            </p>
          </motion.article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <article className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            Service process
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
            Clear steps from sourcing to support
          </h2>
          <div className="mt-6 space-y-5">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 font-heading text-sm font-bold text-orange-700">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-soft">
          <div className="border-b border-orange-100 px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Why clients choose us
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              More than a shop, a service partner
            </h2>
          </div>
          <div className="grid gap-4 p-6 sm:p-8">
            {[
              "Reliable printer imports and inventory planning",
              "Fast repair and parts replacement workflow",
              "Practical training for teams and end users",
              "Clean dashboard experience for resellers",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-orange-50/70 p-4"
              >
                <div className="rounded-lg bg-white p-2 text-orange-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Testimonials
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              What customers say about DIPCOM Technologies
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
            <Star className="h-4 w-4 fill-current" /> Trusted by partners and
            schools
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5"
            >
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                “{item.text}”
              </p>
              <div className="mt-5 border-t border-orange-100 pt-4">
                <p className="font-heading text-base font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.role}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Ready to explore
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              Visit the shop for products or contact us for services
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open Shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}
