import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgePercent, MessageCircle, Package, Search, Send } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { Seo } from "../../components/Seo.tsx";
import { Modal } from "../../components/Modal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { useInfiniteApiList } from "../../hooks/useInfiniteApiList.ts";
import type { Product, SellerProduct } from "../../types.ts";
import { contactPhone } from "../../utils/branding.ts";
import { currency } from "../../utils/format.ts";

type ApiShopItem = Record<string, unknown> & { source: "admin" | "seller" };
const mapShopItem = (item: ApiShopItem): Product | SellerProduct =>
  item.source === "seller"
    ? item as unknown as SellerProduct
    : item as unknown as Product;

export function ShopPage() {
  const { categories, products, publicSellerProducts } = useAppContext();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [hotDeals, setHotDeals] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState<Product | SellerProduct | null>(null);

  const brands = useMemo(
    () => [...new Set([...products, ...publicSellerProducts].map((product) => product.brand))],
    [products, publicSellerProducts],
  );

  const categoryChoices = useMemo(
    () => categories.filter((item) => item.id && item.name),
    [categories],
  );

  const { items: shopProducts, isLoading, hasMore, sentinelRef } = useInfiniteApiList<ApiShopItem, Product | SellerProduct>(
    "/catalog/shop-items/",
    { q: query, categoryId: category === "all" ? undefined : category, brand: brand === "all" ? undefined : brand, stock: availability === "all" ? undefined : availability, hotDeal: hotDeals === "all" ? undefined : hotDeals, ordering: sortBy === "price-asc" ? "price" : sortBy === "price-desc" ? "-price" : "-created_at" },
    mapShopItem,
  );

  const conditionLabel = (value?: string) =>
    value === "used" ? "Used" : "Brand New";

  return (
    <AnimatedPage>
      <Seo title="Shop Office Equipment | DIPCOM Technologies" description="Browse DIPCOM Technologies products, including digital printing equipment, office machines, consumables, and approved seller listings." />
      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Shop
            </p>
            <h1 className="font-heading text-3xl font-bold text-slate-900">
              Browse office equipment and consumables
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Search, filter, sort, and open any product to view order and
              service contact details.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
            <Package className="h-4 w-4" />
            {shopProducts.length} products
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-6">
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
            value={hotDeals}
            onChange={(event) => setHotDeals(event.target.value)}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm"
          >
            <option value="all">All Deals</option>
            <option value="hot">Hot Deals</option>
            <option value="regular">Regular Items</option>
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
              <div className="relative h-48 overflow-hidden bg-orange-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.hotDeal ? (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                    <BadgePercent className="h-3.5 w-3.5" />
                    Hot Deal
                  </span>
                ) : null}
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
                {product.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p> : null}
                {'sellerId' in product ? (
                  <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    Seller post
                  </p>
                ) : null}
                <p
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${product.condition === "used" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {conditionLabel(product.condition)}
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
        <div ref={sentinelRef} className="py-6 text-center text-sm text-slate-500">
          {isLoading ? "Loading products..." : hasMore ? "Scroll to load more products" : shopProducts.length ? "All matching products loaded" : "No products match the current search or filters."}
        </div>
      </section>

      <Modal
        open={Boolean(selectedProduct)}
        title={
          selectedProduct ? `Order ${selectedProduct.name}` : "Order details"
        }
        onClose={() => setSelectedProduct(null)}
        contentClassName="max-w-5xl"
      >
        {selectedProduct ? (
          <div className="grid gap-5 md:grid-cols-[280px,1fr]">
            <div className="overflow-hidden rounded-2xl bg-orange-50">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">
                  Product details and order contact information
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900">
                  {selectedProduct.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedProduct.brand} · {selectedProduct.category}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Price
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {currency(selectedProduct.price)}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Stock
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedProduct.stock} available
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Condition
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {conditionLabel(selectedProduct.condition)}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Source
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {"sellerId" in selectedProduct ? "Seller post" : "Admin product"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Phone Number
                  </p>
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                    {"sellerId" in selectedProduct ? "Seller contact" : "Admin contact"}
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {"sellerId" in selectedProduct && selectedProduct.sellerPhoneNumber
                    ? selectedProduct.sellerPhoneNumber
                    : contactPhone}
                </p>
              </div>

              {"sellerId" in selectedProduct ? (
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Seller details
                  </p>
                  <div className="mt-2 grid gap-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">Name:</span>{" "}
                      {selectedProduct.sellerName ?? "Seller"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Business:</span>{" "}
                      {selectedProduct.sellerBusinessName ?? selectedProduct.sellerName ?? "Seller"}
                    </p>
                  </div>
                </div>
              ) : null}

              {!("sellerId" in selectedProduct) ? (
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Order through social media
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Contact DIPCOM directly on WhatsApp or Telegram about this product.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/message/TQLBUMUI54Q7M1"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                    <a
                      href="https://t.me/DIPCOM22"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      <Send className="h-4 w-4" /> Telegram
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {selectedProduct.description ? <><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Description</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{selectedProduct.description}</p><div className="my-4 border-t border-slate-200" /></> : null}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Product details
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-900">Brand:</span>{" "}
                    {selectedProduct.brand}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Category:</span>{" "}
                    {selectedProduct.category}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Status:</span>{" "}
                    {selectedProduct.stock > 3
                      ? "In stock"
                      : selectedProduct.stock > 0
                        ? "Low stock"
                        : "Out of stock"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Hot Deal:</span>{" "}
                    {selectedProduct.hotDeal ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </AnimatedPage>
  );
}
