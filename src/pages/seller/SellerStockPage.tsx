import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { AlertTriangle, ImagePlus, Plus, Search } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { SellerProduct } from "../../types.ts";
import { currency } from "../../utils/format.ts";

const emptyForm = {
  name: "",
  price: 0,
  stock: 0,
  brand: "",
  category: "Printers",
  imageUrl: "",
};

export function SellerStockPage() {
  const {
    currentUser,
    sellerProducts,
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SellerProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<SellerProduct | null>(null);

  const myProducts = useMemo(
    () =>
      sellerProducts.filter((product) => product.sellerId === currentUser?.id),
    [currentUser?.id, sellerProducts],
  );

  const filteredProducts = useMemo(() => {
    return myProducts.filter((product) => {
      const searchable =
        `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock > 0 && product.stock <= 3) ||
        (stockFilter === "available" && product.stock > 3) ||
        (stockFilter === "empty" && product.stock === 0);

      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [category, myProducts, query, stockFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview("");
    setOpen(true);
  };

  const openEdit = (product: SellerProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl ?? "",
    });
    setImagePreview(product.imageUrl ?? "");
    setOpen(true);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, imageUrl: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editing) {
      updateSellerProduct({ ...editing, ...form });
    } else {
      addSellerProduct(form);
    }
    setOpen(false);
  };

  return (
    <AnimatedPage>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            My Stock Management
          </h2>
          <p className="text-sm text-slate-500">
            Add, edit, and track only your own stock items.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add My Product
        </button>
      </div>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search my stock"
              className="w-full border-none text-sm outline-none"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Printers">Printers</option>
            <option value="Accessories">Accessories</option>
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

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            My products
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {myProducts.length}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Low stock items
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {
              myProducts.filter(
                (product) => product.stock > 0 && product.stock <= 3,
              ).length
            }
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Inventory value
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {currency(
              myProducts.reduce(
                (sum, product) => sum + product.price * product.stock,
                0,
              ),
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-orange-100">
        <table className="min-w-[760px] bg-white text-sm sm:min-w-full">
          <thead className="bg-orange-50 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t border-orange-50">
                <td className="px-4 py-3">
                  <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-14 w-14 object-cover"
                    />
                    <span
                      className={`absolute left-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ${
                        product.stock === 0
                          ? "bg-rose-100 text-rose-700"
                          : product.stock <= 3
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out"
                        : product.stock <= 3
                          ? "Low"
                          : "OK"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {product.name}
                </td>
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{currency(product.price)}</td>
                <td
                  className={`px-4 py-3 font-semibold ${product.stock <= 3 ? "text-rose-600" : "text-slate-700"}`}
                >
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="rounded-lg border border-orange-200 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit My Product" : "Add My Product"}
      >
        <form className="grid gap-3" onSubmit={onSubmit}>
          <input
            className="rounded-xl border border-orange-200 px-3 py-2"
            placeholder="Product Name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-orange-200 px-3 py-2"
              placeholder="Brand"
              value={form.brand}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, brand: event.target.value }))
              }
              required
            />
            <select
              className="rounded-xl border border-orange-200 px-3 py-2"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              <option value="Printers">Printers</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-orange-700 shadow-sm">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Product Image
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  Upload an image file for your own stock record.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
                />
                {imagePreview ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-orange-100 bg-white">
                    <img
                      src={imagePreview}
                      alt="My product preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-orange-200 px-3 py-2"
              type="number"
              min={1}
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  price: Number(event.target.value),
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-orange-200 px-3 py-2"
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  stock: Number(event.target.value),
                }))
              }
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete My Product"
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-rose-600 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Are you sure you want to delete this item?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {deleteTarget?.name} will be removed from your stock list.
                  This action can not be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteTarget) {
                  deleteSellerProduct(deleteTarget.id);
                }
                setDeleteTarget(null);
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Yes, delete
            </button>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
