import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Search,
  ShieldX,
  Users,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

export function AdminSellersPage() {
  const { sellers, approveSeller, rejectSeller } = useAppContext();
  const [query, setQuery] = useState("");
  const [confirmation, setConfirmation] = useState<{
    sellerId: string;
    action: "approve" | "reject" | "remove";
  } | null>(null);

  const filteredSellers = useMemo(() => {
    return [...sellers]
      .filter((seller) =>
        `${seller.name} ${seller.businessName} ${seller.email}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        const order = { pending: 0, approved: 1, rejected: 2 } as const;
        const statusDiff = order[a.status] - order[b.status];
        if (statusDiff !== 0) {
          return statusDiff;
        }

        return a.businessName.localeCompare(b.businessName);
      });
  }, [query, sellers]);

  const pendingCount = sellers.filter(
    (seller) => seller.status === "pending",
  ).length;
  const approvedCount = sellers.filter(
    (seller) => seller.status === "approved",
  ).length;
  const rejectedCount = sellers.filter(
    (seller) => seller.status === "rejected",
  ).length;

  const activeCount = sellers.filter(
    (seller) => seller.status !== "rejected",
  ).length;

  const runAction = (
    sellerId: string,
    action: "approve" | "reject" | "remove",
  ) => {
    if (action === "approve") {
      approveSeller(sellerId);
      return;
    }

    rejectSeller(sellerId);
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
          title="Total Sellers"
          value={String(activeCount)}
          note="Non-rejected seller accounts"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Seller Approval Queue
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search seller accounts by name, business, or email.
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

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {filteredSellers.map((seller) => (
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
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    seller.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : seller.status === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {seller.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {seller.status === "pending" ? (
                  <>
                    <button
                      type="button"
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
                    onClick={() =>
                      setConfirmation({ sellerId: seller.id, action: "remove" })
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Remove
                  </button>
                )}
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
                            ? "This seller will be rejected and moved out of the active queue."
                            : "This seller will be removed from the approved list."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmation(null)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        runAction(seller.id, confirmation.action);
                        setConfirmation(null);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                        confirmation.action === "approve"
                          ? "bg-emerald-600"
                          : confirmation.action === "reject"
                            ? "bg-rose-600"
                            : "bg-slate-900"
                      }`}
                    >
                      Yes, {confirmation.action}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}
