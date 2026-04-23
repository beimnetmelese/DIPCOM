import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Search,
  Truck,
  Warehouse,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { currency, readableDate } from "../../utils/format.ts";

export function AdminReservationsPage() {
  const {
    reservations,
    approveReservation,
    rejectReservation,
    confirmReservationDelivery,
  } = useAppContext();
  const [query, setQuery] = useState("");
  const [confirmation, setConfirmation] = useState<{
    reservationId: string;
    action: "approve" | "reject" | "deliver";
  } | null>(null);

  const activeReservations = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.status === "pending" ||
            reservation.status === "approved",
        )
        .filter((reservation) => {
          const searchable =
            `${reservation.sellerName} ${reservation.productName} ${reservation.quantity} ${reservation.status}`.toLowerCase();
          return searchable.includes(query.toLowerCase());
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [query, reservations],
  );

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "pending",
  ).length;
  const approvedCount = reservations.filter(
    (reservation) => reservation.status === "approved",
  ).length;
  const deliveredCount = reservations.filter(
    (reservation) => reservation.status === "delivered",
  ).length;

  const runAction = (
    reservationId: string,
    action: "approve" | "reject" | "deliver",
  ) => {
    if (action === "approve") {
      approveReservation(reservationId);
      return;
    }

    if (action === "reject") {
      rejectReservation(reservationId);
      return;
    }

    if (action === "deliver") {
      confirmReservationDelivery(reservationId);
    }
  };

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Truck className="h-4 w-4" /> Reservations queue
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Process reservation flow from pending to delivery with a premium
              workflow.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Move each reservation through pending, approved, then delivered.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Pending"
          value={String(pendingCount)}
          note="New reservation requests"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Approved"
          value={String(approvedCount)}
          note="Ready for delivery"
          icon={<Warehouse className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered"
          value={String(deliveredCount)}
          note="Completed reservations"
          icon={<ArrowRight className="h-5 w-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Reservations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Process each reservation through pending, approved, and delivered.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <LoaderCircle className="h-4 w-4" /> {activeReservations.length} in
            queue
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50/60 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reservations"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {activeReservations.map((reservation) => (
            <article
              key={reservation.id}
              className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {readableDate(reservation.createdAt)}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-slate-900">
                    {reservation.productName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Seller: {reservation.sellerName}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {reservation.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Qty
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-slate-900">
                    {reservation.quantity}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Final total
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-orange-700">
                    {currency(reservation.finalTotal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Base total
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-slate-900">
                    {currency(reservation.baseTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {reservation.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({
                          reservationId: reservation.id,
                          action: "approve",
                        })
                      }
                      className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      Approve reservation
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({
                          reservationId: reservation.id,
                          action: "reject",
                        })
                      }
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
                {reservation.status === "approved" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({
                          reservationId: reservation.id,
                          action: "deliver",
                        })
                      }
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Confirm delivery
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({
                          reservationId: reservation.id,
                          action: "reject",
                        })
                      }
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          ))}

          {activeReservations.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/50 p-8 text-center text-sm text-slate-500 lg:col-span-2">
              No queued reservations found.
            </div>
          ) : null}
        </div>
      </section>

      <Modal
        open={Boolean(confirmation)}
        onClose={() => setConfirmation(null)}
        title={
          confirmation?.action === "approve"
            ? "Approve Reservation"
            : confirmation?.action === "reject"
              ? "Reject Reservation"
              : "Confirm Delivery"
        }
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-orange-700 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {confirmation?.action === "approve"
                    ? "Approve this reservation now?"
                    : confirmation?.action === "reject"
                      ? "Reject this reservation?"
                      : "Are you sure you want to confirm delivery?"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {confirmation?.action === "approve"
                    ? "Status will change from pending to approved."
                    : confirmation?.action === "reject"
                      ? "Status will change to rejected and move to history."
                      : "Status will change from approved to delivered and move to history."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirmation) {
                  runAction(confirmation.reservationId, confirmation.action);
                }
                setConfirmation(null);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                confirmation?.action === "approve"
                  ? "bg-indigo-600"
                  : confirmation?.action === "reject"
                    ? "bg-rose-600"
                    : "bg-emerald-600"
              }`}
            >
              Yes, {confirmation?.action}
            </button>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
