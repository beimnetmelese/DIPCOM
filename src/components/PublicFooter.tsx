import { ArrowUpRight, Mail, MapPinned, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { companyLogo, companyName, contactPhone } from "../utils/branding.ts";

export function PublicFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto grid w-full gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr,0.8fr,0.8fr] lg:px-8 lg:py-14">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white/90 p-0.5">
              <img
                src={companyLogo}
                alt={`${companyName} logo`}
                className="h-full w-full object-contain"
              />
            </span>
            {companyName}
          </div>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
            Professional digital printing and office equipment solutions,
            including importing, maintenance, toner refilling, training, and
            consultation for organizations, businesses, institutions, and
            individuals.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            Quick Links
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <Link to="/shop" className="transition hover:text-white">
              Shop
            </Link>
            <Link to="/about" className="transition hover:text-white">
              About
            </Link>
            <Link to="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            Contact
          </h3>
          <div className="mt-4 grid gap-4 text-sm text-white/75">
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-0.5 h-4 w-4 text-orange-300" />
              <span>{contactPhone}</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-orange-300" />
              <span>support@dipcomtechnologies.com</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPinned className="mt-0.5 h-4 w-4 text-orange-300" />
              <span>Betechemari Ymichemeru Kutroch, Addis Ababa</span>
            </div>
            <a
              href="https://www.tiktok.com/@dipcomtechnologies"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-orange-300 transition hover:text-white"
            >
              TikTok page <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full flex-col gap-2 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {companyName}. All rights reserved.</p>
          <p>
            Reliable office technology solutions with a premium digital
            experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
