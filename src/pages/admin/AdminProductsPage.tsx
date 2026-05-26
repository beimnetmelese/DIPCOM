import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { AlertTriangle, Download, ImagePlus, Search, Plus } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { Category, Product } from "../../types.ts";
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

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const conditionLabel = (value?: string) =>
  value === "used" ? "Used" : "Brand New";

export function AdminProductsPage() {
  const {
    currentUser,
    categories,
    products,
    addCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const isReadOnly = currentUser?.role === "staff";
  const canManageCategories =
    currentUser?.role === "admin" || currentUser?.role === "staff";

  const categoryChoices = useMemo(
    () => categories.filter((item) => item.id && item.name),
    [categories],
  );

  const actionTitle = useMemo(
    () => (editing ? "Edit Product" : "Add Product"),
    [editing],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchable =
        `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesCategory =
        category === "all" || product.categoryId === category;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock > 0 && product.stock <= 3) ||
        (stockFilter === "available" && product.stock > 3) ||
        (stockFilter === "empty" && product.stock === 0);

      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [category, products, query, stockFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      categoryId: categoryChoices[0]?.id ?? "",
    });
    setImagePreview("");
    setOpen(true);
  };

  const openEdit = (product: Product) => {
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

    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await addProduct(payload);
    }
    setOpen(false);
  };

  const handleCategoryCreate = async () => {
    const nextName = categoryName.trim();
    if (!nextName) {
      return;
    }

    await addCategory({ name: nextName });
    setCategoryName("");
  };

  const exportAsExcel = () => {
    const rows = filteredProducts
      .map(
        (product) =>
          `<Row><Cell><Data ss:Type="String">${escapeXml(product.name)}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(product.brand)}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(product.category)}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(conditionLabel(product.condition))}</Data></Cell><Cell><Data ss:Type="Number">${product.price}</Data></Cell><Cell><Data ss:Type="Number">${product.stock}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(product.createdAt)}</Data></Cell></Row>`,
      )
      .join("");

    const xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Worksheet ss:Name="Products">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">Name</Data></Cell>
        <Cell><Data ss:Type="String">Brand</Data></Cell>
        <Cell><Data ss:Type="String">Category</Data></Cell>
        <Cell><Data ss:Type="String">Condition</Data></Cell>
        <Cell><Data ss:Type="String">Price</Data></Cell>
        <Cell><Data ss:Type="String">Stock</Data></Cell>
        <Cell><Data ss:Type="String">Created At</Data></Cell>
      </Row>
      ${rows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateTag = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `products-${dateTag}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatedPage>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Products Management
          </h2>
          <p className="text-sm text-slate-500">
            {isReadOnly
              ? "Search and filter the product list."
              : "Search, filter, and manage inventory with product photos."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportAsExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            <Download className="h-4 w-4" /> Export Excel
          </button>
          {!isReadOnly ? (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          ) : null}
        </div>
      </div>

      <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-full border-none text-sm outline-none"
            />
          </label>
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

      {canManageCategories ? (
        <section className="mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Category manager
              </p>
              <p className="text-xs text-slate-500">
                Add new catalog categories for products and seller stock.
              </p>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2 sm:max-w-lg">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="New category name"
                className="min-w-0 flex-1 rounded-xl border border-orange-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleCategoryCreate}
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Add Category
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryChoices.map((item: Category) => (
              <span
                key={item.id}
                className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
              >
                {item.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "In stock",
            value: filteredProducts.filter((product) => product.stock > 3)
              .length,
            tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
            note: "Healthy inventory",
          },
          {
            label: "Low stock",
            value: filteredProducts.filter(
              (product) => product.stock > 0 && product.stock <= 3,
            ).length,
            tone: "bg-blue-50 text-blue-700 border-blue-100",
            note: "Needs replenishment",
          },
          {
            label: "Out of stock",
            value: filteredProducts.filter((product) => product.stock === 0)
              .length,
            tone: "bg-rose-50 text-rose-700 border-rose-100",
            note: "Unavailable right now",
          },
        ].map((status) => (
          <article
            key={status.label}
            className={`rounded-3xl border p-4 shadow-soft ${status.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
              {status.label}
            </p>
            <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
              {status.value}
            </p>
            <p className="mt-1 text-sm text-slate-600">{status.note}</p>
          </article>
        ))}
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
                <p
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${product.condition === "used" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {conditionLabel(product.condition)}
                </p>
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
            {!isReadOnly ? (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="flex-1 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(product)}
                  className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  Delete
                </button>
              </div>
            ) : null}
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
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              {!isReadOnly ? <th className="px-4 py-3">Actions</th> : null}
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
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${product.condition === "used" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {conditionLabel(product.condition)}
                  </span>
                </td>
                <td className="px-4 py-3">{currency(product.price)}</td>
                <td
                  className={`px-4 py-3 font-semibold ${product.stock <= 3 ? "text-rose-600" : "text-slate-700"}`}
                >
                  {product.stock}
                </td>
                {!isReadOnly ? (
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
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!isReadOnly && open}
        onClose={() => setOpen(false)}
        title={actionTitle}
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
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              required
            >
              <option value="">Select category</option>
              {categoryChoices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Condition
              <select
                value={(form as any).condition ?? "new"}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    condition: event.target.value,
                  }))
                }
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
              >
                <option value="new">Brand New</option>
                <option value="used">Used</option>
              </select>
            </label>
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
                  Upload an image file. It will be saved as the product photo in
                  the app.
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
                      alt="Product preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Price
              <input
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm normal-case tracking-normal"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 450"
                value={form.priceInput}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    priceInput: normalizeDecimalInput(event.target.value),
                  }))
                }
                required
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Stock
              <input
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm normal-case tracking-normal"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 12"
                value={form.stockInput}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    stockInput: normalizeIntegerInput(event.target.value),
                  }))
                }
                required
              />
            </label>
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
        open={!isReadOnly && Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-rose-600 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Are you sure you want to delete this product?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {deleteTarget?.name} will be removed from the inventory list.
                  This action can not be undone.
                </p>
              </div>
            </div>
          </div>

          {deleteTarget ? (
            <div className="rounded-2xl border border-orange-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Selected product
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-slate-900">
                {deleteTarget.name}
              </p>
              <p className="text-sm text-slate-500">
                {deleteTarget.brand} • {deleteTarget.category}
              </p>
            </div>
          ) : null}

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
                  deleteProduct(deleteTarget.id);
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
