import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import {
  AlertTriangle,
  Boxes,
  ChartColumn,
  CircleDollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import { currency } from "../../utils/format.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

export function SellerOverviewPage() {
  const { currentUser, sellerProducts } = useAppContext();

  const myProducts = useMemo(
    () =>
      sellerProducts.filter((product) => product.sellerId === currentUser?.id),
    [currentUser?.id, sellerProducts],
  );

  const totalUnits = myProducts.reduce((sum, item) => sum + item.stock, 0);
  const inventoryValue = myProducts.reduce(
    (sum, item) => sum + item.price * item.stock,
    0,
  );
  const averageUnitValue = totalUnits > 0 ? inventoryValue / totalUnits : 0;
  const lowStockProducts = myProducts.filter(
    (product) => product.stock > 0 && product.stock <= 3,
  ).length;
  const outOfStockProducts = myProducts.filter(
    (product) => product.stock === 0,
  ).length;

  const monthlyAddedTrend = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
    const now = new Date();
    const labels: string[] = [];
    const monthKeys: string[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const point = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthFormatter.format(point));
      monthKeys.push(
        `${point.getFullYear()}-${String(point.getMonth() + 1).padStart(2, "0")}`,
      );
    }

    const counts = monthKeys.map(
      (key) =>
        myProducts.filter((product) => {
          const date = new Date(product.createdAt);
          const productKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          return productKey === key;
        }).length,
    );

    return { labels, counts };
  }, [myProducts]);

  const topStockedProducts = useMemo(() => {
    const grouped = new Map<string, number>();

    myProducts.forEach((product) => {
      const current = grouped.get(product.name) ?? 0;
      grouped.set(product.name, current + product.stock);
    });

    return [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [myProducts]);

  const categorySplit = useMemo(() => {
    const grouped = new Map<string, number>();

    myProducts.forEach((product) => {
      const current = grouped.get(product.category) ?? 0;
      grouped.set(product.category, current + 1);
    });

    return [...grouped.entries()];
  }, [myProducts]);

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <TrendingUp className="h-4 w-4" /> Seller dashboard
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Track your stock performance with a complete visual inventory
              dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Monitor inventory value, stock health, monthly additions, and
              category distribution for your own stock list.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Products"
          value={String(myProducts.length)}
          note="Items in your stock list"
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Total Units"
          value={String(totalUnits)}
          note="All units currently in stock"
          icon={<Boxes className="h-5 w-5" />}
        />
        <StatCard
          title="Inventory Value"
          value={currency(inventoryValue)}
          note="Estimated based on unit prices"
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Unit Value"
          value={currency(averageUnitValue)}
          note="Average value per stocked unit"
          icon={<ChartColumn className="h-5 w-5" />}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Healthy Stock
            </p>
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {myProducts.filter((product) => product.stock > 3).length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Well-stocked products</p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Low Stock Alerts
            </p>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {lowStockProducts}
          </p>
          <p className="mt-1 text-sm text-slate-500">Need refill soon</p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Out Of Stock
            </p>
            <Package className="h-5 w-5 text-rose-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {outOfStockProducts}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Immediate restock required
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            6-month product additions trend
          </p>
          <Line
            data={{
              labels: monthlyAddedTrend.labels,
              datasets: [
                {
                  label: "Products added",
                  data: monthlyAddedTrend.counts,
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.18)",
                  fill: true,
                  tension: 0.35,
                  pointRadius: 4,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </article>

        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Category split in my stock
          </p>
          <div className="mx-auto max-w-[330px]">
            <Doughnut
              data={{
                labels: categorySplit.map((item) => item[0]),
                datasets: [
                  {
                    data: categorySplit.map((item) => item[1]),
                    backgroundColor: [
                      "#f59e0b",
                      "#10b981",
                      "#f43f5e",
                      "#3b82f6",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
            />
          </div>
          {categorySplit.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-slate-500">
              No product categories yet. Add products in your stock page.
            </p>
          ) : null}
        </article>
      </div>

      <article className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
        <p className="mb-4 text-sm font-semibold text-slate-700">
          Top stocked products by quantity
        </p>
        <Bar
          data={{
            labels: topStockedProducts.map((item) => item[0]),
            datasets: [
              {
                label: "Units in stock",
                data: topStockedProducts.map((item) => item[1]),
                backgroundColor: [
                  "#fb923c",
                  "#f97316",
                  "#ea580c",
                  "#fdba74",
                  "#c2410c",
                ],
                borderRadius: 10,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
        {topStockedProducts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-slate-500">
            No stock data yet. Add products to start seeing inventory analytics.
          </p>
        ) : null}
      </article>
    </AnimatedPage>
  );
}
