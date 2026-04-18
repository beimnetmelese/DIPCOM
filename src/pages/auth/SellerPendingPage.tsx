import { Clock3, MailCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

export function SellerPendingPage() {
  const { currentUser, logout } = useAppContext();

  return (
    <AnimatedPage>
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
          <Clock3 className="h-4 w-4" /> Approval Pending
        </div>

        <h1 className="mt-5 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
          Your seller account is pending approval
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Thanks for registering
          {currentUser?.name ? `, ${currentUser.name}` : ""}. An admin will
          review your account soon. You can log in now, but seller dashboard
          actions will be available only after approval.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
            <MailCheck className="h-5 w-5 text-orange-600" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              What happens next
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Once approved, you can access products, reservations, and stock
              tools in your seller dashboard.
            </p>
          </article>
          <article className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
            <ShieldAlert className="h-5 w-5 text-orange-600" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Need support?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              If approval takes too long, contact the platform admin for manual
              review.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </section>
    </AnimatedPage>
  );
}
