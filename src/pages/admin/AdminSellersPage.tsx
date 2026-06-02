import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  ShieldX,
  Users,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import type { SellerStatus } from "../../types.ts";

export function AdminSellersPage() {
  const {
    sellers,
    approveSeller,
    rejectSeller,
    removeSeller,
    reactivateSeller,
    updateSellerDiscount,
  } = useAppContext();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [discountInputs, setDiscountInputs] = useState<Record<string, string>>(
    {},
  );
  const [savingSellerId, setSavingSellerId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    sellerId: string;
    action: "approve" | "reject" | "remove";
  } | null>(null);
  const [removalReason, setRemovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  const normalizeIntegerInput = (value: string) =>
    value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

  useEffect(() => {
    setDiscountInputs(
      Object.fromEntries(
        sellers.map((seller) => [
          seller.id,
          String(seller.sellerDiscountPercent ?? 0),
        ]),
      ),
    );
  }, [sellers]);

  const activeSellers = useMemo(() => {
    return [...sellers]
      .filter((seller) => !seller.removed)
      .filter((seller) => {
        const searchable =
          `${seller.name} ${seller.businessName} ${seller.email} ${seller.phoneNumber} ${seller.location ?? ""} ${seller.tinNumber ?? ""}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      })
      .filter(
        (seller) => statusFilter === "all" || seller.status === statusFilter,
      )
      .sort((a, b) => {
        const order: Record<SellerStatus, number> = {
          pending: 0,
          approved: 1,
          rejected: 2,
          removed: 3,
        };
        const statusDiff = order[a.status] - order[b.status];
        if (statusDiff !== 0) return statusDiff;
        return a.businessName.localeCompare(b.businessName);
      });
  }, [query, sellers, statusFilter]);

  const removedSellers = useMemo(() => {
    return [...sellers]
      .filter((seller) => seller.removed)
      .filter((seller) => {
        const searchable =
          `${seller.name} ${seller.businessName} ${seller.email} ${seller.phoneNumber} ${seller.location ?? ""} ${seller.tinNumber ?? ""} ${seller.removalReason ?? ""}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      })
      .sort((a, b) => a.businessName.localeCompare(b.businessName));
  }, [query, sellers]);

  const pendingCount = activeSellers.filter(
    (seller) => seller.status === "pending",
  ).length;
  const approvedCount = activeSellers.filter(
    (seller) => seller.status === "approved",
  ).length;
  const rejectedCount = activeSellers.filter(
    (seller) => seller.status === "rejected",
  ).length;
  const removedCount = removedSellers.length;
  const activeCount = activeSellers.length;

  const runAction = async (
    sellerId: string,
    action: "approve" | "reject" | "remove",
  ) => {
    if (action === "approve") {
      await approveSeller(sellerId);
      return true;
    }

    if (action === "reject") {
      const note = rejectionReason.trim();
      if (!note) return false;
      await rejectSeller(sellerId, note);
      return true;
    }

    if (action === "remove") {
      const note = removalReason.trim();
      if (!note) return false;
      await removeSeller(sellerId, note);
      return true;
    }

    return true;
  };

  const saveSellerDiscount = async (sellerId: string) => {
    const rawValue = discountInputs[sellerId] ?? "0";
    const parsed = Number(rawValue || 0);
    const clamped = Math.min(50, Math.max(0, parsed));

    setSavingSellerId(sellerId);
    try {
      await updateSellerDiscount(sellerId, clamped);
    } finally {
      setSavingSellerId(null);
    }
  };

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <BadgeCheck className="h-4 w-4" /> Admin sellers
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Review seller applications with a cleaner approval workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Search sellers by name, inspect their business details, and manage
              approval status from one polished admin page.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Approval"
          value={String(pendingCount)}
          note="Applications waiting review"
          icon={<Clock3 className="h-5 w-5" />}
        />
        <StatCard
          title="Approved Sellers"
          value={String(approvedCount)}
          note="Active and verified accounts"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Rejected Sellers"
          value={String(rejectedCount)}
          note="Declined applications"
          icon={<ShieldX className="h-5 w-5" />}
        />
        <StatCard
          title="Removed Sellers"
          value={String(removedCount)}
          note="Accounts marked as removed"
          icon={<ShieldX className="h-5 w-5" />}
        />
        <StatCard
          title="Total Active"
          value={String(activeCount)}
          note="Sellers not marked removed"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Active Seller Queue
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search active seller accounts by name, business, email, location,
              or TIN.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <Users className="h-4 w-4" /> {sellers.length} accounts
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50/60 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search seller by name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="all">All active statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
            Showing {activeSellers.length} sellers
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {activeSellers.map((seller) => (
            <article
              key={seller.id}
              className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl font-semibold text-slate-900">
                    {seller.businessName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {seller.name} · {seller.email}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {seller.phoneNumber}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {seller.location}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    TIN: {seller.tinNumber}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${seller.status === "approved" ? "bg-emerald-100 text-emerald-700" : seller.status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {seller.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {seller.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      disabled={Boolean(confirmation) || isConfirmingAction}
                      onClick={() =>
                        setConfirmation({
                          sellerId: seller.id,
                          action: "approve",
                        })
                      }
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(confirmation) || isConfirmingAction}
                      onClick={() =>
                        setConfirmation({
                          sellerId: seller.id,
                          action: "reject",
                        })
                      }
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={Boolean(confirmation) || isConfirmingAction}
                    onClick={() => {
                      setRemovalReason("");
                      setConfirmation({
                        sellerId: seller.id,
                        action: "remove",
                      });
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              {seller.status === "rejected" && seller.rejectionReason ? (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Rejection reason
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {seller.rejectionReason}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-end">
                <label className="text-sm font-semibold text-slate-700">
                  Seller discount (%)
                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      discountInputs[seller.id] ??
                      String(seller.sellerDiscountPercent ?? 0)
                    }
                    onChange={(event) => {
                      const next = normalizeIntegerInput(event.target.value);
                      const capped = Number(next || 0) > 50 ? "50" : next;
                      setDiscountInputs((prev) => ({
                        ...prev,
                        [seller.id]: capped,
                      }));
                    }}
                    className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void saveSellerDiscount(seller.id)}
                  disabled={savingSellerId === seller.id}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingSellerId === seller.id ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />{" "}
                      Saving...
                    </span>
                  ) : (
                    "Save discount"
                  )}
                </button>
              </div>

              {confirmation?.sellerId === seller.id ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
                      <LoaderCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">
                        Confirm action for {seller.businessName}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {confirmation.action === "approve"
                          ? "This seller will be approved and can log in immediately."
                          : confirmation.action === "reject"
                            ? "This seller will be rejected, moved out of the active queue, and the note will be saved."
                            : "This seller will be removed from the approved list."}
                      </p>
                      {confirmation.action === "reject" ? (
                        <textarea
                          value={rejectionReason}
                          onChange={(event) =>
                            setRejectionReason(event.target.value)
                          }
                          placeholder="Enter the reason for rejecting this seller"
                          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                          rows={3}
                        />
                      ) : null}
                      {confirmation.action === "remove" ? (
                        <textarea
                          value={removalReason}
                          onChange={(event) =>
                            setRemovalReason(event.target.value)
                          }
                          placeholder="Enter the reason for removing this seller"
                          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                          rows={3}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmation(null)}
                      disabled={isConfirmingAction}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isConfirmingAction}
                      onClick={async () => {
                        if (!confirmation) return;
                        setIsConfirmingAction(true);
                        try {
                          const completed = await runAction(
                            seller.id,
                            confirmation.action,
                          );
                          if (completed) {
                            setConfirmation(null);
                            setRemovalReason("");
                            setRejectionReason("");
                          }
                        } finally {
                          setIsConfirmingAction(false);
                        }
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${confirmation.action === "approve" ? "bg-emerald-600" : confirmation.action === "reject" ? "bg-rose-600" : "bg-slate-900"}`}
                    >
                      {isConfirmingAction ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                          Working...
                        </span>
                      ) : (
                        <>Yes, {confirmation.action}</>
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-rose-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Removed Sellers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              These sellers are hidden from the active queue, but their status
              and removal reason stay visible here.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            <ShieldX className="h-4 w-4" /> {removedSellers.length} removed
          </span>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {removedSellers.length > 0 ? (
            removedSellers.map((seller) => (
              <article
                key={seller.id}
                className="rounded-[1.75rem] border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-xl font-semibold text-slate-900">
                      {seller.businessName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {seller.name} · {seller.email}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {seller.phoneNumber}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {seller.location}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      TIN: {seller.tinNumber}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Removal reason:{" "}
                      {seller.removalReason || "No reason provided"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Removed at:{" "}
                      {seller.removedAt
                        ? new Date(seller.removedAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    removed
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void reactivateSeller(seller.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <RefreshCw className="h-4 w-4" /> Reactivate seller
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-6 text-sm text-slate-600 xl:col-span-2">
              No removed sellers yet.
            </div>
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}
