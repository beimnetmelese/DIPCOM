import { useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  CheckCircle2,
  Clock3,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { currency, readableDate } from "../../utils/format.ts";

const timeRanges = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "Month" },
  { key: "365d", label: "Year" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" },
] as const;

function isDateInRange(
  dateString: string,
  range: (typeof timeRanges)[number]["key"],
  fromDate?: string,
  toDate?: string,
) {
  const referenceDate = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  if (range === "all") {
    return true;
  }

  if (range === "today") {
    return referenceDate >= startOfToday && referenceDate <= endOfToday;
  }

  if (range === "custom") {
    if (!fromDate && !toDate) {
      return true;
    }

    const from = fromDate
      ? new Date(`${fromDate}T00:00:00.000`)
      : new Date("1970-01-01T00:00:00.000");
    const to = toDate
      ? new Date(`${toDate}T23:59:59.999`)
      : new Date("9999-12-31T23:59:59.999");

    return referenceDate >= from && referenceDate <= to;
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 365;
  const startDate = new Date(startOfToday);
  startDate.setDate(startDate.getDate() - (days - 1));

  return referenceDate >= startDate && referenceDate <= endOfToday;
}

export function AdminReservationHistoryPage() {
  const { reservations } = useAppContext();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "delivered" | "rejected"
  >("all");
  const [historyTimeRange, setHistoryTimeRange] =
    useState<(typeof timeRanges)[number]["key"]>("30d");
  const [summaryTimeRange, setSummaryTimeRange] =
    useState<(typeof timeRanges)[number]["key"]>("30d");
  const [historyFromDate, setHistoryFromDate] = useState("");
  const [historyToDate, setHistoryToDate] = useState("");
  const [summaryFromDate, setSummaryFromDate] = useState("");
  const [summaryToDate, setSummaryToDate] = useState("");

  const summaryTimeRangeLabel =
    timeRanges.find((item) => item.key === summaryTimeRange)?.label ?? "Month";

  const filteredHistory = useMemo(() => {
    return reservations
      .filter(
        (reservation) =>
          reservation.status === "rejected" ||
          reservation.status === "delivered",
      )
      .filter((reservation) => {
        const referenceDate =
          reservation.deliveredAt ??
          reservation.rejectedAt ??
          reservation.createdAt;
        const matchesTimeRange = isDateInRange(
          referenceDate,
          historyTimeRange,
          historyFromDate,
          historyToDate,
        );

        const searchable =
          `${reservation.sellerName} ${reservation.productName} ${reservation.status}`.toLowerCase();
        const matchesQuery = searchable.includes(query.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || reservation.status === statusFilter;

        return matchesTimeRange && matchesQuery && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.deliveredAt ?? b.rejectedAt ?? b.createdAt).getTime() -
          new Date(a.deliveredAt ?? a.rejectedAt ?? a.createdAt).getTime(),
      );
  }, [
    historyFromDate,
    historyTimeRange,
    historyToDate,
    query,
    reservations,
    statusFilter,
  ]);

  const summaryHistory = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.status === "rejected" ||
            reservation.status === "delivered",
        )
        .filter((reservation) => {
          const referenceDate =
            reservation.deliveredAt ??
            reservation.rejectedAt ??
            reservation.createdAt;
          return isDateInRange(
            referenceDate,
            summaryTimeRange,
            summaryFromDate,
            summaryToDate,
          );
        }),
    [reservations, summaryFromDate, summaryTimeRange, summaryToDate],
  );

  const deliveredCount = reservations.filter(
    (reservation) => reservation.status === "delivered",
  ).length;
  const rejectedCount = reservations.filter(
    (reservation) => reservation.status === "rejected",
  ).length;
  const historyCount = filteredHistory.length;

  const totalUnits = summaryHistory.reduce(
    (sum, reservation) => sum + reservation.quantity,
    0,
  );
  const totalValue = summaryHistory.reduce(
    (sum, reservation) => sum + reservation.finalTotal,
    0,
  );

  const sellerSummaries = useMemo(() => {
    const grouped = new Map<
      string,
      {
        sellerName: string;
        reservations: number;
        units: number;
        value: number;
      }
    >();

    summaryHistory.forEach((reservation) => {
      const current = grouped.get(reservation.sellerId) ?? {
        sellerName: reservation.sellerName,
        reservations: 0,
        units: 0,
        value: 0,
      };

      current.reservations += 1;
      current.units += reservation.quantity;
      current.value += reservation.finalTotal;
      grouped.set(reservation.sellerId, current);
    });

    return [...grouped.values()].sort((a, b) => b.value - a.value);
  }, [summaryHistory]);

  const topSeller = sellerSummaries[0];

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Archive className="h-4 w-4" /> Reservation history
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Delivered and rejected reservations in one clean history view.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Track completed and rejected workflow outcomes.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Rejected"
          value={String(rejectedCount)}
          note="Declined reservations"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered"
          value={String(deliveredCount)}
          note="Completed reservations"
          icon={<Trash2 className="h-5 w-5" />}
        />
        <StatCard
          title="History Records"
          value={String(historyCount)}
          note="All archived reservation entries"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          title="Top Seller"
          value={topSeller?.sellerName ?? "-"}
          note={
            topSeller
              ? `${topSeller.reservations} reservations in ${summaryTimeRangeLabel}`
              : "No records in this range"
          }
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search delivered or rejected reservations by seller or product.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <Archive className="h-4 w-4" /> {historyCount} archived
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {timeRanges.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setHistoryTimeRange(item.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                historyTimeRange === item.key
                  ? "bg-slate-950 text-white"
                  : "bg-orange-50 text-slate-700 hover:bg-orange-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {historyTimeRange === "custom" ? (
          <div className="mt-3 grid gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-3 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              From
              <input
                type="date"
                value={historyFromDate}
                onChange={(event) => setHistoryFromDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-orange-300"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              To
              <input
                type="date"
                value={historyToDate}
                onChange={(event) => setHistoryToDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-orange-300"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "delivered", label: "Delivered" },
            { key: "rejected", label: "Rejected" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                setStatusFilter(item.key as "all" | "delivered" | "rejected")
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

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50/60 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search history"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filteredHistory.map((reservation) => {
            const statusClass =
              reservation.status === "delivered"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-rose-100 text-rose-700";

            return (
              <article
                key={reservation.id}
                className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {readableDate(
                        reservation.deliveredAt ??
                          reservation.rejectedAt ??
                          reservation.createdAt,
                      )}
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-slate-900">
                      {reservation.productName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Seller: {reservation.sellerName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                  >
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
                      Status note
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {reservation.status === "rejected"
                        ? "Rejected and archived"
                        : "Delivered and completed"}
                    </p>
                  </div>
                </div>

                {reservation.status === "rejected" ? (
                  <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                      Rejection reason
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {reservation.rejectionReason ||
                        "No rejection reason was provided."}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}

          {filteredHistory.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/50 p-8 text-center text-sm text-slate-500 lg:col-span-2">
              No history records found.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Seller summary for {summaryTimeRangeLabel}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              See which sellers reserved the most items in the selected period.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <BarChart3 className="h-4 w-4" /> {totalUnits} units /{" "}
            {currency(totalValue)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {timeRanges.map((item) => (
            <button
              key={`summary-${item.key}`}
              type="button"
              onClick={() => setSummaryTimeRange(item.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                summaryTimeRange === item.key
                  ? "bg-slate-950 text-white"
                  : "bg-orange-50 text-slate-700 hover:bg-orange-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {summaryTimeRange === "custom" ? (
          <div className="mt-3 grid gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-3 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              From
              <input
                type="date"
                value={summaryFromDate}
                onChange={(event) => setSummaryFromDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-orange-300"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              To
              <input
                type="date"
                value={summaryToDate}
                onChange={(event) => setSummaryToDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-orange-300"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {sellerSummaries.map((seller) => (
            <article
              key={seller.sellerName}
              className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Seller
              </p>
              <h3 className="mt-2 font-heading text-xl font-semibold text-slate-900">
                {seller.sellerName}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Orders
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
                    {seller.reservations}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Units
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
                    {seller.units}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Value
                  </p>
                  <p className="mt-1 text-sm font-bold text-orange-700">
                    {currency(seller.value)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {sellerSummaries.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/50 p-8 text-center text-sm text-slate-500 xl:col-span-3">
              No seller summary available for this range.
            </div>
          ) : null}
        </div>
      </section>
    </AnimatedPage>
  );
}
