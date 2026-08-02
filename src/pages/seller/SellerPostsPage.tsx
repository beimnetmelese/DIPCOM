import { ChangeEvent, FormEvent, useState } from "react";
import {
  LoaderCircle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { ApiSellerProduct, mapSellerProduct } from "../../context/AppContext.tsx";
import { useInfiniteApiList } from "../../hooks/useInfiniteApiList.ts";
import { SellerProduct } from "../../types.ts";
import { currency } from "../../utils/format.ts";

const emptyForm = {
  name: "",
  priceInput: "",
  stockInput: "",
  brand: "",
  categoryId: "",
  imageFile: null as File | null,
  condition: "new",
};

const normalizeIntegerInput = (value: string) =>
  value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

const normalizeDecimalInput = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const firstDotIndex = cleaned.indexOf(".");
  const normalized =
    firstDotIndex === -1
      ? cleaned
      : `${cleaned.slice(0, firstDotIndex + 1)}${cleaned
          .slice(firstDotIndex + 1)
          .replace(/\./g, "")}`;

  if (normalized.startsWith(".")) {
    return `0${normalized}`;
  }

  if (normalized.includes(".")) {
    const [intPart, decimalPart] = normalized.split(".");
    const safeInt = intPart.replace(/^0+(?=\d)/, "");
    return `${safeInt}.${decimalPart}`;
  }

  return normalized.replace(/^0+(?=\d)/, "");
};

const moderationLabel = (value?: string) => {
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";
  return "Pending";
};

export function SellerPostsPage() {
  const {
    categories,
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    markSellerProductAvailable,
    markSellerProductUnavailable,
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SellerProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<SellerProduct | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const categoryChoices = categories.filter((item) => item.id && item.name);
  const { items: filteredProducts, isLoading, hasMore, refresh, sentinelRef } = useInfiniteApiList<ApiSellerProduct, SellerProduct>(
    "/catalog/seller-products/",
    { q: query, status: statusFilter === "all" ? undefined : statusFilter, categoryId: category === "all" ? undefined : category, stock: stockFilter === "all" ? undefined : stockFilter },
    mapSellerProduct,
  );

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      categoryId: categoryChoices[0]?.id ?? "",
    });
    setImagePreview("");
    setOpen(true);
  };

  const openEdit = (product: SellerProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      priceInput: String(product.price),
      stockInput: String(product.stock),
      brand: product.brand,
      categoryId: product.categoryId,
      condition: (product as any).condition ?? "new",
      imageFile: null,
    });
    setImagePreview(product.imageUrl ?? "");
    setOpen(true);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setForm((prev) => ({ ...prev, imageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(form.priceInput);
    const parsedStock = Number(form.stockInput);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return;
    }

    const selectedCategory = categoryChoices.find(
      (item) => item.id === form.categoryId,
    );

    if (!selectedCategory) {
      return;
    }

    const payload = {
      name: form.name,
      price: parsedPrice,
      stock: parsedStock,
      brand: form.brand,
      condition: (form as any).condition ?? "new",
      categoryId: form.categoryId,
      imageFile: form.imageFile,
      category: selectedCategory.name,
    };

    setIsSavingProduct(true);
    try {
      if (editing) {
        await updateSellerProduct(editing.id, payload);
      } else {
        await addSellerProduct(payload);
      }
      await refresh();
      setOpen(false);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const toggleAvailability = async (product: SellerProduct) => {
    if (product.isAvailable) {
      await markSellerProductUnavailable(product.id);
      await refresh();
      return;
    }

    await markSellerProductAvailable(product.id);
    await refresh();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoadingId(deleteTarget.id);
    try {
      await deleteSellerProduct(deleteTarget.id);
      await refresh();
      setDeleteTarget(null);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const totalCount = filteredProducts.length;
  const pendingCount = filteredProducts.filter(
    (product) => product.moderationStatus === "pending",
  ).length;
  const rejectedCount = filteredProducts.filter(
    (product) => product.moderationStatus === "rejected",
  ).length;
  const unavailableCount = filteredProducts.filter(
    (product) => !product.isAvailable,
  ).length;

  return (
    <AnimatedPage>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            My Posts
          </h2>
          <p className="text-sm text-slate-500">
            Create a post, hide it when needed, and watch its approval status.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Post Product
        </button>
      </div>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search my posts"
              className="w-full border-none text-sm outline-none"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {categoryChoices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Stock</option>
            <option value="available">Available</option>
            <option value="low">Low stock</option>
            <option value="empty">Out of stock</option>
          </select>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            My posts
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {totalCount}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pending review
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Rejected
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {rejectedCount}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Hidden posts
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {unavailableCount}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:hidden">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-orange-100 bg-white p-4 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-16 w-16 rounded-xl border border-orange-100 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {product.name}
                </p>
                <p className="text-sm text-slate-500">{product.brand}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                  {product.category}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className={`rounded-full px-2 py-1 ${product.moderationStatus === "approved" ? "bg-emerald-100 text-emerald-700" : product.moderationStatus === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {moderationLabel(product.moderationStatus)}
                  </span>
                  <span className={`rounded-full px-2 py-1 ${product.isAvailable ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                {product.moderationStatus === "rejected" && product.moderationNote ? (
                  <p className="mt-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-xs text-slate-600">
                    {product.moderationNote}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-orange-50 px-3 py-2">
                <p className="text-xs text-slate-500">Price</p>
                <p className="font-semibold text-slate-900">
                  {currency(product.price)}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 px-3 py-2">
                <p className="text-xs text-slate-500">Stock</p>
                <p className="font-semibold text-slate-900">{product.stock}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {product.moderationStatus === "rejected" ? (
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="flex-1 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700"
                >
                  Edit
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setDeleteTarget(product)}
                className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"
              >
                Delete
              </button>
              {product.moderationStatus === "rejected" ? null : (
                <button
                  type="button"
                  onClick={() => void toggleAvailability(product)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  {product.isAvailable ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-3xl border border-orange-100 md:block">
        <table className="min-w-[760px] bg-white text-sm sm:min-w-full">
          <thead className="bg-orange-50 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t border-orange-50">
                <td className="px-4 py-3">
                  <div className="overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-14 w-14 object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{product.name}</td>
                <td className="px-4 py-3 text-slate-700">{product.brand}</td>
                <td className="px-4 py-3 text-slate-700">{product.category}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${product.moderationStatus === "approved" ? "bg-emerald-100 text-emerald-700" : product.moderationStatus === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {moderationLabel(product.moderationStatus)}
                  </span>
                  {product.moderationStatus === "rejected" && product.moderationNote ? (
                    <p className="mt-2 max-w-[22rem] text-xs text-slate-500">{product.moderationNote}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${product.isAvailable ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                    {product.isAvailable ? "Available" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {currency(product.price)}
                </td>
                <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {product.moderationStatus === "rejected" ? (
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-700"
                      >
                        Edit
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700"
                    >
                      Delete
                    </button>
                    {product.moderationStatus === "rejected" ? null : (
                      <button
                        type="button"
                        onClick={() => void toggleAvailability(product)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {product.isAvailable ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={sentinelRef} className="py-5 text-center text-sm text-slate-500">
        {isLoading ? <span className="inline-flex items-center gap-2"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading posts...</span> : hasMore ? "Scroll to load more posts" : filteredProducts.length > 0 ? "All posts loaded" : "No posts match the current filters."}
      </div>

      <Modal
        open={open}
        title={editing ? "Edit rejected post" : "Post product"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Product Name
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Price
              <input
                value={form.priceInput}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    priceInput: normalizeDecimalInput(event.target.value),
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Stock
              <input
                value={form.stockInput}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    stockInput: normalizeIntegerInput(event.target.value),
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Brand
              <input
                value={form.brand}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brand: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Category
              <select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
                required
              >
                <option value="">Select category</option>
                {categoryChoices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Condition
            <select
              value={(form as any).condition ?? "new"}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  condition: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
            >
              <option value="new">Brand New</option>
              <option value="used">Used</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Image
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 px-4 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm"
              />
            </div>
          </label>

          {imagePreview ? (
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-44 w-full object-cover"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSavingProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSavingProduct ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            {editing ? "Resubmit Product" : "Post Product"}
          </button>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete ${deleteTarget.name}` : "Delete post"}
        onClose={() => setDeleteTarget(null)}
      >
        <div className="grid gap-4">
          <p className="text-sm text-slate-600">
            This will remove the post from your list and from the public shop if it was approved.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={Boolean(deleteLoadingId)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {deleteLoadingId ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
