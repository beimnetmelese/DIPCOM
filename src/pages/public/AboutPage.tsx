import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  MapPinned,
  PackageCheck,
  Sparkles,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";

const stats = [
  { value: "18+", label: "Years of experience" },
  { value: "200+", label: "Students trained" },
  { value: "Printers", label: "Imported and supplied" },
  { value: "Repairs", label: "Handled with care" },
];

const pillars = [
  {
    title: "Importing printers",
    icon: <Truck className="h-5 w-5" />,
    text: "DIPCOM Technologies has long experience importing printers and accessories, selecting dependable products and preparing them for market.",
  },
  {
    title: "Printer repairs",
    icon: <Wrench className="h-5 w-5" />,
    text: "The team repairs printers, replaces damaged parts, and helps customers restore devices to reliable working condition.",
  },
  {
    title: "Training programs",
    icon: <GraduationCap className="h-5 w-5" />,
    text: "They provide hands-on training for printer setup, maintenance, and practical troubleshooting for teams and learners.",
  },
];

const galleryPhotos = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582582429416-f365cae7a7cd?auto=format&fit=crop&w=900&q=80",
];

export function AboutPage() {
  return (
    <AnimatedPage>
      <section className="relative -mx-3 -mt-20 overflow-hidden border-y border-orange-100 bg-slate-950 shadow-soft sm:-mx-4 lg:-mx-6">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80"
            alt="DIPCOM Technologies team background"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/55 to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[1.08fr,0.92fr] lg:px-6 lg:pb-24 lg:pt-36">
          <div className="max-w-2xl text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.28)]">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              <PackageCheck className="h-4 w-4" /> About DIPCOM Technologies
            </p>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              18 years of trusted printer importing, repair, and training
              expertise.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/88 sm:text-lg">
              DIPCOM Technologies is a seasoned service provider with more than
              18 years of experience in printer importing, printer repair, and
              practical training. They also support schools and learning
              environments, with more than 200 students benefiting from their
              training and technology support.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                <Award className="h-4 w-4 text-orange-300" /> 18+ years
                experience
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                <Users className="h-4 w-4 text-orange-300" /> 200+ students
                trained
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                <Sparkles className="h-4 w-4 text-orange-300" /> Premium service
                quality
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <p className="font-heading text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Mission
              </p>
              <p className="mt-2 text-sm leading-7 text-white/85">
                To provide reliable printer solutions, strong technical support,
                and practical training that helps businesses and schools run
                smoothly.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.article
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft"
          >
            <div className="inline-flex rounded-xl bg-orange-100 p-3 text-orange-700">
              {pillar.icon}
            </div>
            <h2 className="mt-4 font-heading text-xl font-semibold text-slate-900">
              {pillar.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {pillar.text}
            </p>
          </motion.article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.92fr,1.08fr]">
        <article className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            Who we serve
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
            Schools, resellers, offices, and growing businesses
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "Schools that need printer support and technical training",
              "Resellers who want a steady source of reliable printers",
              "Offices that need quick repair and maintenance support",
              "Customers looking for guidance on setup and troubleshooting",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-orange-50/70 p-4"
              >
                <div className="rounded-lg bg-white p-2 text-orange-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-orange-100 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Gallery
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                  A few moments from our workshop and support work
                </h3>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-600">
                A visual snapshot of the space where printers are checked,
                repaired, prepared, and supported for customers and schools.
              </p>
            </div>

            <div className="mt-5 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-6">
              {galleryPhotos.map((image, index) => {
                const layoutClass =
                  index === 0
                    ? "md:col-span-3 md:row-span-2"
                    : index === 1
                      ? "md:col-span-3"
                      : index === 2
                        ? "md:col-span-2"
                        : index === 3
                          ? "md:col-span-2 md:row-span-2"
                          : index === 4
                            ? "md:col-span-2"
                            : "md:col-span-4";

                return (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.15)] ${layoutClass}`}
                  >
                    <img
                      src={image}
                      alt={`DIPCOM gallery ${index + 1}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                        Workshop {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/92">
                        Printer support and preparation
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Our promise
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              Experience, reliability, and support under one roof
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
            <MapPinned className="h-4 w-4" /> Addis Ababa, Ethiopia
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
