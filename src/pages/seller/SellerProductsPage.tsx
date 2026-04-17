import { useMemo, useState } from "react";
import { Filter, PhoneCall, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { Product, ProductFilters } from "../../types.ts";
import { currency } from "../../utils/format.ts";

const initialFilters: ProductFilters = {
  query: "",
  category: "all",
  brand: "all",
  minPrice: 0,
  maxPrice: 1000,
  availability: "all",
  sortBy: "newest",
};

export function SellerProductsPage() {
  const { products, reserveProduct, commissionPercent } = useAppContext();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [reserveTarget, setReserveTarget] = useState<Product | null>(null);
  const [reserveQuantityInput, setReserveQuantityInput] = useState("1");
  const [reserveError, setReserveError] = useState("");
  const [deliveryNotice, setDeliveryNotice] = useState<{
    productName: string;
    quantity: number;
  } | null>(null);

  const deliveryPhoneNumber = "+1 (555) 900-1001";

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))],
    [products],
  );

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const searchText =
        `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const matchQuery = searchText.includes(filters.query.toLowerCase());
      const matchCategory =
        filters.category === "all" || product.category === filters.category;
      const matchBrand =
        filters.brand === "all" || product.brand === filters.brand;
      const matchPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      const matchAvailability =
        filters.availability === "all" ||
        (filters.availability === "in-stock" && product.stock > 3) ||
        (filters.availability === "low-stock" &&
          product.stock > 0 &&
          product.stock <= 3) ||
        (filters.availability === "out-of-stock" && product.stock === 0);

      return (
        matchQuery &&
        matchCategory &&
        matchBrand &&
        matchPrice &&
        matchAvailability
      );
    });

    if (filters.sortBy === "price-asc") {
      return [...result].sort((a, b) => a.price - b.price);
    }

    if (filters.sortBy === "price-desc") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filters, products]);

  const inStockCount = products.filter((product) => product.stock > 0).length;
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 3,
  ).length;

  const openReserveModal = (product: Product) => {
    setReserveTarget(product);
    setReserveQuantityInput("1");
    setReserveError("");
  };

  const closeReserveModal = () => {
    setReserveTarget(null);
    setReserveError("");
  };

  const submitReservation = () => {
    if (!reserveTarget) {
      return;
    }

    const parsedQuantity = Number(reserveQuantityInput);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setReserveError("Quantity must be at least 1.");
      return;
    }

    if (parsedQuantity > reserveTarget.stock) {
      setReserveError("Quantity cannot be greater than available stock.");
      return;
    }

    const result = reserveProduct(reserveTarget.id, parsedQuantity);
    if (!result.ok) {
      setReserveError(result.message);
      return;
    }

    setDeliveryNotice({
      productName: reserveTarget.name,
      quantity: parsedQuantity,
    });
    closeReserveModal();
  };

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4" /> Seller products
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Browse products, filter fast, and reserve stock with a polished
              workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Use the controls below to search, sort, and manage product
              reservations.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Available products
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {inStockCount}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Low stock items
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {lowStockCount}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Discount rate
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {commissionPercent}%
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-orange-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="col-span-2 flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50/50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, query: event.target.value }))
              }
              placeholder="Search by name, category, brand"
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, category: event.target.value }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Printers">Printers</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select
            value={filters.brand}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, brand: event.target.value }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: Number(event.target.value),
              }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
            placeholder="Min price"
          />
          <input
            type="number"
            min={1}
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number(event.target.value),
              }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
            placeholder="Max price"
          />
          <select
            value={filters.availability}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                availability: event.target
                  .value as ProductFilters["availability"],
              }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
          >
            <option value="all">All Availability</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: event.target.value as ProductFilters["sortBy"],
              }))
            }
            className="rounded-2xl border border-orange-200 px-3 py-3 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price low-high</option>
            <option value="price-desc">Price high-low</option>
          </select>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
          <Filter className="h-4 w-4" /> Refine results for your seller view
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => {
          const finalPrice = product.price * (1 - commissionPercent / 100);
          const stockClass =
            product.stock <= 3 ? "text-rose-600" : "text-slate-600";

          return (
            <motion.article
              whileHover={{ y: -4 }}
              key={product.id}
              className="rounded-[1.75rem] border border-orange-100 bg-white p-4 shadow-soft"
            >
              <div className="mb-4 overflow-hidden rounded-2xl bg-orange-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-52 w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    {product.brand}
                  </p>
                  <h3 className="font-heading text-lg font-semibold text-slate-900">
                    {product.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stock <= 3 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {product.stock <= 3 ? "Low stock" : "In stock"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              <p className={`mt-1 text-sm font-semibold ${stockClass}`}>
                Stock: {product.stock}
              </p>
              <div className="mt-3">
                <p className="text-sm text-slate-500 line-through">
                  Base: {currency(product.price)}
                </p>
                <p className="font-heading text-xl font-bold text-orange-700">
                  Final: {currency(finalPrice)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openReserveModal(product)}
                disabled={product.stock === 0}
                className="mt-4 w-full rounded-2xl bg-slate-950 px-3 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Reserve Item
              </button>
            </motion.article>
          );
        })}
      </section>

      <Modal
        open={Boolean(reserveTarget)}
        title={reserveTarget ? `Reserve ${reserveTarget.name}` : "Reserve item"}
        onClose={closeReserveModal}
      >
        {reserveTarget ? (
          <div>
            <p className="text-sm text-slate-600">
              How many units do you want to reserve?
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              Available stock: {reserveTarget.stock}
            </p>
            <div className="mt-4 grid gap-2">
              <label
                htmlFor="reserve-quantity"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                Quantity
              </label>
              <input
                id="reserve-quantity"
                type="number"
                min={1}
                max={reserveTarget.stock}
                value={reserveQuantityInput}
                onChange={(event) => {
                  if (!reserveTarget) {
                    return;
                  }
                  setReserveError("");
                  const nextValue = event.target.value;

                  if (nextValue === "") {
                    setReserveQuantityInput("");
                    return;
                  }

                  const parsed = Number(nextValue);
                  if (Number.isNaN(parsed)) {
                    return;
                  }

                  if (parsed > reserveTarget.stock) {
                    setReserveQuantityInput(String(reserveTarget.stock));
                    return;
                  }

                  setReserveQuantityInput(nextValue);
                }}
                onFocus={(event) => event.currentTarget.select()}
                onBlur={() => {
                  if (!reserveTarget) {
                    return;
                  }
                  const parsed = Number(reserveQuantityInput);
                  if (!Number.isInteger(parsed) || parsed < 1) {
                    setReserveQuantityInput("1");
                    return;
                  }
                  if (parsed > reserveTarget.stock) {
                    setReserveQuantityInput(String(reserveTarget.stock));
                  }
                }}
                className="w-full rounded-2xl border border-orange-200 px-3 py-2 text-sm outline-none"
              />
            </div>
            {reserveError ? (
              <p className="mt-3 text-sm font-semibold text-rose-600">
                {reserveError}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={submitReservation}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reserve
              </button>
              <button
                type="button"
                onClick={closeReserveModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deliveryNotice)}
        title="Reserved"
        onClose={() => setDeliveryNotice(null)}
      >
        {deliveryNotice ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Reserved {deliveryNotice.quantity} item(s) of
              <span className="font-semibold text-slate-900">
                {` ${deliveryNotice.productName}`}
              </span>
              .
            </p>
            <p className="text-sm text-slate-700">
              Reserved successfully. Call this number to start the delivery.
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-slate-900">
              <PhoneCall className="h-4 w-4 text-orange-700" />
              {deliveryPhoneNumber}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setDeliveryNotice(null)}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </AnimatedPage>
  );
}
