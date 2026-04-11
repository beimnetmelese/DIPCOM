import {
  ExternalLink,
  MapPinned,
  PhoneCall,
  Sparkles,
  Clock3,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";

export function ContactPage() {
  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-soft">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 px-6 py-12 text-white sm:px-8 sm:py-16">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-amber-200 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
              <Sparkles className="h-4 w-4" /> Contact Us
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Beautifully connected support for your business.
            </h1>
            <p className="mt-4 max-w-2xl text-white/90">
              Visit us, call us, or use the map below to find our office near
              the CBE Temenja Yaj branch in Addis Ababa.
            </p>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.92fr,1.08fr]">
          <article className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 shadow-soft">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Reach us directly
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We are available for platform questions, demo requests, and
              reseller onboarding.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Phone
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      +1 (555) 900-1001
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                    <MapPinned className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Address
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      Next to CBE Temenja Yaj branch, Kirkos sub city woreda 11,
                      Addis Ababa
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Hours
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      Monday - Saturday, 8:30 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      TikTok
                    </p>
                    <a
                      href="https://www.tiktok.com/@dipcomtechnologies"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-base font-semibold text-slate-900 transition hover:text-orange-700"
                    >
                      tiktok.com/@dipcomtechnologies
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Location
                </p>
                <h2 className="font-heading text-xl font-semibold text-slate-900">
                  Find us on the map
                </h2>
              </div>
            </div>
            <div className="aspect-[16/12] w-full bg-orange-50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.728265867298!2d38.75657401086354!3d8.99713269102569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8584482eab63%3A0x2c55bad0b8eff98a!2sDipcom%20Technology%20Solutions!5e0!3m2!1sen!2set!4v1775917748282!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DIPCOM Technologies location"
                className="h-full min-h-[420px] w-full"
              />
            </div>
          </article>
        </div>
      </section>
    </AnimatedPage>
  );
}
