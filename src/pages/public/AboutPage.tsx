import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Truck, Wrench } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { companyLogo, companyName } from "../../utils/branding.ts";

const pillars = [
  {
    title: "Importing",
    icon: <Truck className="h-5 w-5" />,
    text: "Reliable importing services for digital printing and office equipment solutions.",
  },
  {
    title: "Maintenance",
    icon: <Wrench className="h-5 w-5" />,
    text: "Practical maintenance and support services that help organizations maintain efficient workflows.",
  },
  {
    title: "Training",
    icon: <Sparkles className="h-5 w-5" />,
    text: "Hands-on technical training, toner refilling, and professional consultation under one trusted brand.",
  },
];

const galleryPhotoModules = import.meta.glob("../../assets/IMG_*.PNG", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const galleryPhotos = Object.keys(galleryPhotoModules)
  .sort()
  .map((path) => galleryPhotoModules[path]);

export function AboutPage() {
  const { siteSettings } = useAppContext();

  return (
    <AnimatedPage>
      <section className="relative -mx-3 -mt-20 overflow-hidden border-y border-orange-100 bg-slate-950 shadow-soft sm:-mx-4 lg:-mx-6">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80"
            alt={`${companyName} team background`}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/55 to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[1.08fr,0.92fr] lg:px-6 lg:pb-24 lg:pt-36">
          <div className="max-w-2xl text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.28)]">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-white/90 p-0.5">
                <img
                  src={companyLogo}
                  alt={`${companyName} logo`}
                  className="h-full w-full object-contain"
                />
              </span>
              About {companyName}
            </p>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {siteSettings.aboutTitle}
            </h1>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-white/88 sm:text-lg">
              {siteSettings.aboutDescription}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-heading text-3xl font-bold text-white">
                  {siteSettings.yearsExperience}+
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Years of experience
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-heading text-3xl font-bold text-white">
                  {siteSettings.studentsTrained}+
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Teams trained
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Mission
              </p>
              <p className="mt-2 text-sm leading-7 text-white/85">
                To deliver quality office technology solutions, practical
                training, and dependable support that help organizations improve
                productivity and reduce operating costs.
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

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Why Choose Us
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
          Why Choose Us
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "18+ years of industry experience",
            "Skilled and experienced technical professionals",
            "Reliable maintenance and support services",
            "High-quality imported office equipment",
            "Affordable and efficient toner solutions",
            "Practical hands-on technical training",
            "Fast customer support and response",
            "Professional consultation services",
            "Long-term customer relationship approach",
            "Complete office technology solutions under one company",
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
      </section>

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Gallery
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              A few moments from our service and support work
            </h3>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            A visual snapshot of the space where equipment is prepared,
            maintained, trained on, and supported for our clients.
          </p>
        </div>

        <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {galleryPhotos.map((image, index) => {
            return (
              <motion.div
                key={image}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.15)] aspect-[4/3]"
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
                    Equipment support and preparation
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Our promise
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              Quality service, reliability, and support under one roof
            </h2>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
