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
  Boxes,
  CheckCircle2,
  ClipboardList,
  Package,
  TrendingUp,
  WalletCards,
  XCircle,
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
  const { currentUser, products, reservations } = useAppContext();
  const myReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) => reservation.sellerId === currentUser?.id,
      ),
    [currentUser?.id, reservations],
  );

  const activeReservations = myReservations.filter(
    (reservation) => reservation.status === "active",
  );
  const deliveredReservations = myReservations.filter(
    (reservation) => reservation.status === "delivered",
  );
  const removedReservations = myReservations.filter(
    (reservation) => reservation.status === "removed",
  );

  const totalSpent = myReservations.reduce(
    (sum, item) => sum + item.finalTotal,
    0,
  );
  const discountedValue = myReservations.reduce(
    (sum, item) => sum + (item.baseTotal - item.finalTotal),
    0,
  );

  const totalUnits = myReservations.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const averageOrderValue =
    myReservations.length > 0 ? totalSpent / myReservations.length : 0;
  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 3,
  ).length;

  const monthlyTrend = useMemo(() => {
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

    const totals = monthKeys.map((key) =>
      myReservations
        .filter((reservation) => {
          const date = new Date(reservation.createdAt);
          const reservationKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          return reservationKey === key;
        })
        .reduce((sum, reservation) => sum + reservation.finalTotal, 0),
    );

    return { labels, totals };
  }, [myReservations]);

  const topReservedProducts = useMemo(() => {
    const grouped = new Map<string, number>();

    myReservations.forEach((reservation) => {
      const current = grouped.get(reservation.productName) ?? 0;
      grouped.set(reservation.productName, current + reservation.quantity);
    });

    return [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [myReservations]);

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
              Track your reservation performance with a complete visual
              dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Monitor statuses, monthly trends, product demand, and order value
              to make smarter stock decisions as a seller.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Available Products"
          value={String(products.filter((product) => product.stock > 0).length)}
          note="Ready to reserve"
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Active Queue"
          value={String(activeReservations.length)}
          note="Pending confirmation"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          title="Discount Captured"
          value={currency(discountedValue)}
          note={`Total spent ${currency(totalSpent)}`}
          icon={<WalletCards className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Order Value"
          value={currency(averageOrderValue)}
          note={`${totalUnits} total units reserved`}
          icon={<Boxes className="h-5 w-5" />}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Delivered
            </p>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {deliveredReservations.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Completed reservations</p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Removed
            </p>
            <XCircle className="h-5 w-5 text-rose-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {removedReservations.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Archived reservations</p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Low Stock Alerts
            </p>
            <Package className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {lowStockProducts}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Products need refill soon
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            6-month reservation value trend
          </p>
          <Line
            data={{
              labels: monthlyTrend.labels,
              datasets: [
                {
                  label: "Final reservation value",
                  data: monthlyTrend.totals,
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
            Reservation status split
          </p>
          <div className="mx-auto max-w-[330px]">
            <Doughnut
              data={{
                labels: ["Active", "Delivered", "Removed"],
                datasets: [
                  {
                    data: [
                      activeReservations.length,
                      deliveredReservations.length,
                      removedReservations.length,
                    ],
                    backgroundColor: ["#f59e0b", "#10b981", "#f43f5e"],
                    borderWidth: 0,
                  },
                ],
              }}
            />
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
        <p className="mb-4 text-sm font-semibold text-slate-700">
          Top reserved products by quantity
        </p>
        <Bar
          data={{
            labels: topReservedProducts.map((item) => item[0]),
            datasets: [
              {
                label: "Units reserved",
                data: topReservedProducts.map((item) => item[1]),
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
        {topReservedProducts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-slate-500">
            No reservation data yet. Reserve products to start seeing demand
            analytics.
          </p>
        ) : null}
      </article>
    </AnimatedPage>
  );
}
