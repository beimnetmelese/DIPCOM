import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Search,
  XCircle,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { currency, readableDate } from "../../utils/format.ts";

export function SellerReservationsPage() {
  const { currentUser, reservations } = useAppContext();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "delivered"
  >("all");

  const myReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) => reservation.sellerId === currentUser?.id,
      ),
    [currentUser?.id, reservations],
  );

  const pendingCount = myReservations.filter(
    (reservation) => reservation.status === "pending",
  ).length;
  const approvedCount = myReservations.filter(
    (reservation) => reservation.status === "approved",
  ).length;
  const rejectedCount = myReservations.filter(
    (reservation) => reservation.status === "rejected",
  ).length;
  const deliveredCount = myReservations.filter(
    (reservation) => reservation.status === "delivered",
  ).length;

  const filteredReservations = useMemo(
    () =>
      myReservations
        .filter((reservation) => {
          const searchable =
            `${reservation.productName} ${reservation.sellerName}`.toLowerCase();
          const matchesQuery = searchable.includes(query.toLowerCase());
          const matchesStatus =
            statusFilter === "all" || reservation.status === statusFilter;
          return matchesQuery && matchesStatus;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [myReservations, query, statusFilter],
  );

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Clock3 className="h-4 w-4" /> Seller reservations
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Track reservation progress from pending to delivered.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Search your reservation list, filter by status, and monitor your
              reservation outcomes clearly.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending"
          value={String(pendingCount)}
          note="New reservation request"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          title="Approved"
          value={String(approvedCount)}
          note="Ready for delivery"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Rejected"
          value={String(rejectedCount)}
          note="Declined reservations"
          icon={<XCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered"
          value={String(deliveredCount)}
          note="Completed reservations"
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              My Reservations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter your reservation list.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {filteredReservations.length} results
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50/60 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reservations by product"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
            { key: "delivered", label: "Delivered" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                setStatusFilter(
                  item.key as
                    | "all"
                    | "pending"
                    | "approved"
                    | "rejected"
                    | "delivered",
                )
              }
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                statusFilter === item.key
                  ? "bg-slate-950 text-white"
                  : "bg-orange-50 text-slate-700 hover:bg-orange-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {filteredReservations.map((reservation) => {
            const statusTone =
              reservation.status === "delivered"
                ? {
                    rail: "bg-emerald-500",
                    badge:
                      "bg-emerald-100/90 text-emerald-700 ring-1 ring-emerald-300/60",
                    glow: "from-emerald-100/60 via-white to-white",
                  }
                : reservation.status === "rejected"
                  ? {
                      rail: "bg-rose-500",
                      badge:
                        "bg-rose-100/90 text-rose-700 ring-1 ring-rose-300/60",
                      glow: "from-rose-100/60 via-white to-white",
                    }
                  : reservation.status === "approved"
                    ? {
                        rail: "bg-indigo-500",
                        badge:
                          "bg-indigo-100/90 text-indigo-700 ring-1 ring-indigo-300/60",
                        glow: "from-indigo-100/60 via-white to-white",
                      }
                    : reservation.status === "pending"
                      ? {
                          rail: "bg-amber-500",
                          badge:
                            "bg-amber-100/90 text-amber-700 ring-1 ring-amber-300/60",
                          glow: "from-amber-100/60 via-white to-white",
                        }
                      : {
                          rail: "bg-amber-500",
                          badge:
                            "bg-amber-100/90 text-amber-700 ring-1 ring-amber-300/60",
                          glow: "from-amber-100/60 via-white to-white",
                        };
            return (
              <article
                key={reservation.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-0 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${statusTone.glow} opacity-90`}
                />
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${statusTone.rail}`}
                />

                <div className="relative grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-5 sm:p-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                      <PackageCheck className="h-3.5 w-3.5" />
                      Reservation
                    </div>

                    <h3 className="mt-3 font-heading text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                      {reservation.productName}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                        Qty {reservation.quantity}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                        {readableDate(reservation.createdAt)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700/80">
                        ID {reservation.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusTone.badge}`}
                    >
                      {reservation.status}
                    </span>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Final Amount
                    </p>
                    <p className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                      {currency(reservation.finalTotal)}
                    </p>
                  </div>
                </div>

                {reservation.status === "rejected" &&
                reservation.rejectionReason ? (
                  <div className="relative border-t border-slate-200/70 bg-slate-50/80 px-5 py-4 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Rejection note
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {reservation.rejectionReason}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
          {filteredReservations.length === 0 ? (
            <p className="rounded-2xl border border-orange-100 bg-white p-4 text-sm text-slate-500">
              No reservations yet.
            </p>
          ) : null}
        </div>
      </section>
    </AnimatedPage>
  );
}
