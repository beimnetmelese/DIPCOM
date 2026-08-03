import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Search,
  ShieldX,
  Sparkles,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { ApiSellerProduct, mapSellerProduct, useAppContext } from "../../context/AppContext.tsx";
import { useInfiniteApiList } from "../../hooks/useInfiniteApiList.ts";
import { SellerProduct } from "../../types.ts";
import { currency } from "../../utils/format.ts";

const statusLabel = (value?: string) => {
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";
  return "Pending";
};

export function AdminSellerPostsPage() {
  const {
    approveSellerProduct,
    rejectSellerProduct,
  } = useAppContext();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState<SellerProduct | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [savingActionId, setSavingActionId] = useState<string | null>(null);

  const pendingList = useInfiniteApiList<ApiSellerProduct, SellerProduct>("/catalog/seller-products/", { status: "pending" }, mapSellerProduct);
  const reviewedList = useInfiniteApiList<ApiSellerProduct, SellerProduct>(
    "/catalog/seller-products/",
    { q: query, status: statusFilter === "all" ? "reviewed" : statusFilter, availability: availabilityFilter === "all" ? undefined : availabilityFilter },
    mapSellerProduct,
  );
  const pendingPosts = pendingList.items;
  const reviewedPosts = reviewedList.items;

  const approve = async (post: SellerProduct) => {
    setSavingActionId(post.id);
    try {
      await approveSellerProduct(post.id);
      await pendingList.refresh();
      await reviewedList.refresh();
    } finally {
      setSavingActionId(null);
    }
  };

  const openReject = (post: SellerProduct) => {
    setRejectTarget(post);
    setRejectNote(post.moderationNote ?? "");
  };

  const submitReject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rejectTarget || !rejectNote.trim()) {
      return;
    }

    setSavingActionId(rejectTarget.id);
    try {
      await rejectSellerProduct(rejectTarget.id, rejectNote.trim());
      await pendingList.refresh();
      await reviewedList.refresh();
      setRejectTarget(null);
      setRejectNote("");
    } finally {
      setSavingActionId(null);
    }
  };

  return (
    <AnimatedPage>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Seller Post Approvals
          </h2>
          <p className="text-sm text-slate-500">
            Pending posts stay at the top. Reviewed posts are listed below.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
          <Sparkles className="h-4 w-4" /> {pendingPosts.length + reviewedPosts.length} loaded
        </div>
      </div>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Pending review queue
            </p>
            <p className="text-xs text-slate-500">
              Pending seller posts stay here until you approve or reject them.
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {pendingPosts.length} pending
          </span>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No pending seller posts right now.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {pendingPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-soft"
              >
                <div className="h-48 overflow-hidden bg-orange-50">
                  <img
                    src={post.imageUrl}
                    alt={post.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {post.sellerBusinessName || post.sellerName || post.sellerId}
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-semibold text-slate-900">
                        {post.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {post.category} · {post.brand} · {post.stock} units
                  </p>
                  {post.description ? <p className="text-sm leading-6 text-slate-700">{post.description}</p> : null}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                      Seller post
                    </span>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">
                      {currency(post.price)}
                    </span>
                  </div>
                  {post.moderationNote ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                        Existing note
                      </p>
                      <p className="mt-1 leading-6">{post.moderationNote}</p>
                    </div>
                  ) : null}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => void approve(post)}
                      disabled={savingActionId === post.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {savingActionId === post.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => openReject(post)}
                      disabled={savingActionId === post.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                    >
                      <ShieldX className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div ref={pendingList.sentinelRef} className="py-4 text-center text-sm text-slate-500">
          {pendingList.isLoading ? "Loading pending posts..." : pendingList.hasMore ? "Scroll to load more pending posts" : pendingPosts.length ? "All pending posts loaded" : null}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search seller posts"
              className="w-full border-none text-sm outline-none"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All availability</option>
            <option value="available">Visible</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Reviewed posts
            </p>
            <p className="text-xs text-slate-500">
              Pending posts are excluded from this list.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {reviewedPosts.length} listed
          </span>
        </div>

        {reviewedPosts.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No approved or rejected seller posts match the current filters.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-3xl border border-orange-100">
            <table className="min-w-[980px] bg-white text-sm sm:min-w-full">
              <thead className="bg-orange-50 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviewedPosts.map((post) => (
                  <tr key={post.id} className="border-t border-orange-50 align-top">
                    <td className="px-4 py-3">
                      <div className="h-14 w-14 overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                        <img
                          src={post.imageUrl}
                          alt={post.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {post.sellerBusinessName || post.sellerName || post.sellerId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{post.name}</p>
                      <p className="text-xs text-slate-500">
                        {post.category} · {post.brand} · {currency(post.price)}
                      </p>
                      {post.description ? <p className="mt-1 max-w-md text-xs text-slate-600">{post.description}</p> : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${post.moderationStatus === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {statusLabel(post.moderationStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${post.isAvailable ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {post.isAvailable ? "Visible" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {post.moderationNote || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {post.moderationStatus === "rejected" ? (
                        <button
                          type="button"
                          onClick={() => void approve(post)}
                          disabled={savingActionId === post.id}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openReject(post)}
                          disabled={savingActionId === post.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
                        >
                          <ShieldX className="h-4 w-4" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div ref={reviewedList.sentinelRef} className="py-4 text-center text-sm text-slate-500">
          {reviewedList.isLoading ? "Loading reviewed posts..." : reviewedList.hasMore ? "Scroll to load more reviewed posts" : reviewedPosts.length ? "All reviewed posts loaded" : null}
        </div>
      </section>

      <Modal
        open={Boolean(rejectTarget)}
        title={rejectTarget ? `Reject ${rejectTarget.name}` : "Reject post"}
        onClose={() => setRejectTarget(null)}
      >
        <form onSubmit={submitReject} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Note for the seller
            <textarea
              value={rejectNote}
              onChange={(event) => setRejectNote(event.target.value)}
              rows={5}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
              placeholder="Explain why this post was rejected."
              required
            />
          </label>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rejectNote.trim() || Boolean(savingActionId)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingActionId ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : null}
              Save note
            </button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
}
