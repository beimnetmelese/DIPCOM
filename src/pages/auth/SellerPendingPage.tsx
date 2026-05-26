import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  LoaderCircle,
  Mail,
  MailCheck,
  Phone,
  PhoneCall,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { contactPhone } from "../../utils/branding.ts";

export function SellerPendingPage() {
  const { currentUser, logout, resubmitRejectedSeller } = useAppContext();
  const status = currentUser?.sellerStatus ?? "pending";
  const isRejected = status === "rejected";
  const isRemoved = status === "removed";
  const isPending = status === "pending";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResubmitSuccess, setShowResubmitSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    location: "",
    tinNumber: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!isRejected || !currentUser) {
      return;
    }

    setForm({
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      businessName: currentUser.businessName ?? "",
      location: currentUser.location ?? "",
      tinNumber: currentUser.tinNumber ?? "",
      phoneNumber: currentUser.phoneNumber ?? "",
    });
  }, [currentUser, isRejected]);

  const statusTitle = isRemoved
    ? "Your seller account is banned"
    : isRejected
      ? "Your seller account was rejected"
      : "Your seller account is pending approval";
  const reason = isRemoved
    ? currentUser?.removalReason
    : currentUser?.rejectionReason;
  const supportMessage = isRemoved
    ? `If this is a mistake, call this number: ${contactPhone}`
    : "If you need a review or clarification, contact the platform admin for support.";
  const statusMessage = isPending
    ? "An admin will review your account soon. Seller dashboard actions are only available after approval."
    : isRejected
      ? "Your seller account was reviewed and rejected by an admin. Seller dashboard actions are not available while the account is rejected."
      : "Your seller account is banned and inactive. Seller dashboard actions are not available while the account is banned.";

  const handleResubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isRejected) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resubmitRejectedSeller(form);
      if (!result.ok) {
        return;
      }
      setShowResubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
          <Clock3 className="h-4 w-4" /> {isRemoved ? "banned" : status}
        </div>

        <h1 className="mt-5 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
          {statusTitle}
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Thanks for registering
          {currentUser?.name ? `, ${currentUser.name}` : ""}. An admin will
          review your account soon. {statusMessage}
        </p>

        {reason ? (
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {isRemoved ? "Ban reason" : "Rejection reason"}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{reason}</p>
          </div>
        ) : null}

        {isPending ? (
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
              <p className="mt-1 text-sm text-slate-600">{supportMessage}</p>
            </article>
          </div>
        ) : isRejected ? (
          <form
            onSubmit={handleResubmit}
            className="mt-6 grid gap-4 rounded-3xl border border-rose-100 bg-rose-50/40 p-5 sm:p-6"
          >
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                <UserPlus className="h-4 w-4" /> Edit and resubmit
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Update your seller details and submit them again. The admin will
                review your profile after resubmission.
              </p>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Full Name
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <UserPlus className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-rose-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  value={form.phoneNumber}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Resubmitting...
                </>
              ) : (
                <>
                  Submit for Review <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {isRemoved ? "Ban support" : "Rejection support"}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {supportMessage}
            </p>
            {isRemoved ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-orange-100">
                <PhoneCall className="h-4 w-4 text-orange-600" />
                {contactPhone}
              </p>
            ) : null}
          </div>
        )}

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

      <Modal
        open={showResubmitSuccess}
        onClose={() => setShowResubmitSuccess(false)}
        title="Form Submitted"
      >
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-slate-700">
            Your form has been submitted successfully. Please wait until the
            admin reviews your account.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowResubmitSuccess(false)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
