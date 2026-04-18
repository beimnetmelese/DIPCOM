import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Package, PhoneCall, Search } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import type { Product } from "../../types.ts";
import { currency } from "../../utils/format.ts";

export function ShopPage() {
  const { categories, products } = useAppContext();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))],
    [products],
  );

  const categoryChoices = useMemo(
    () => categories.filter((item) => item.id && item.name),
    [categories],
  );

  const shopProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const searchable =
        `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesCategory =
        category === "all" || product.categoryId === category;
      const matchesBrand = brand === "all" || product.brand === brand;
      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" && product.stock > 3) ||
        (availability === "low-stock" &&
          product.stock > 0 &&
          product.stock <= 3) ||
        (availability === "out-of-stock" && product.stock === 0);

      return (
        matchesQuery && matchesCategory && matchesBrand && matchesAvailability
      );
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [availability, brand, category, products, query, sortBy]);

  return (
    <AnimatedPage>
      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Shop
            </p>
            <h1 className="font-heading text-3xl font-bold text-slate-900">
              Browse the product catalog
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Search, filter, sort, and open any product to view order contact
              details.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
            <Package className="h-4 w-4" />
            {shopProducts.length} products
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-5">
          <label className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 xl:col-span-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, category, brand"
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
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Brands</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price low-high</option>
            <option value="price-desc">Price high-low</option>
          </select>

          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Availability</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shopProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-2xl border border-orange-100 bg-white transition hover:border-orange-300"
            >
              <div className="h-48 overflow-hidden bg-orange-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {product.brand}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-semibold text-slate-900">
                      {product.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stock <= 3 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {product.stock <= 3 ? "Low stock" : "In stock"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {product.category} · {product.stock} available
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xl font-bold text-orange-700">
                    {currency(product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Modal
        open={Boolean(selectedProduct)}
        title={
          selectedProduct ? `Order ${selectedProduct.name}` : "Order details"
        }
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct ? (
          <div className="grid gap-5 md:grid-cols-[180px,1fr]">
            <div className="overflow-hidden rounded-2xl bg-orange-50">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                For order inquiries and delivery confirmation
              </p>
              <div className="mt-4 space-y-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Phone Number
                    </p>
                    <p className="font-semibold text-slate-900">
                      +1 (555) 900-1001
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Address
                    </p>
                    <p className="font-semibold text-slate-900">
                      145 Commerce Street, NY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </AnimatedPage>
  );
}
