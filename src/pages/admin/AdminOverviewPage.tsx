import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Boxes, DollarSign, Users } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { StatCard } from "../../components/StatCard.tsx";
import { apiRequest } from "../../utils/api.ts";
import { currency } from "../../utils/format.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

export function AdminOverviewPage() {
  const [summary, setSummary] = useState<{ totalProducts: number; stockValue: number; totalSellers: number; brands: Array<{ brand: string; units: number }>; categories: Array<{ id: string; name: string; units: number | null }>; recentReservations: Array<{ id: string; product_name: string; seller_name: string; final_total: number }> }>({ totalProducts: 0, stockValue: 0, totalSellers: 0, brands: [], categories: [], recentReservations: [] });
  useEffect(() => { void apiRequest<typeof summary>("/site/dashboard-summary/").then(setSummary).catch(console.error); }, []);
  const salesTrend = [14200, 15600, 13900, 18900, 20100, 22600];

  const categoryLabels = summary.categories.length
    ? summary.categories.map((category) => category.name)
    : ["No categories yet"];
  const categoryData = summary.categories.length
    ? summary.categories.map((category) => category.units ?? 0)
    : [0];

  const brandCounts = summary.brands.map((brand) => brand.brand);
  const brandStocks = summary.brands.map((brand) => brand.units ?? 0);

  return (
    <AnimatedPage>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Products"
          value={String(summary.totalProducts)}
          note="Inventory SKUs tracked"
          icon={<Boxes className="h-5 w-5" />}
        />
        <StatCard
          title="Stock Value"
          value={currency(summary.stockValue)}
          note="Real-time inventory valuation"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Total Sellers"
          value={String(summary.totalSellers)}
          note="Approved + pending accounts"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Sales trends
          </p>
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Sales",
                  data: salesTrend,
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
          />
        </article>

        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Stock distribution by brand
          </p>
          <Bar
            data={{
              labels: brandCounts,
              datasets: [
                {
                  label: "Units",
                  data: brandStocks,
                  backgroundColor: [
                    "#fb923c",
                    "#f97316",
                    "#ea580c",
                    "#fdba74",
                    "#c2410c",
                    "#9a3412",
                  ],
                  borderRadius: 8,
                },
              ],
            }}
          />
        </article>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Product categories
          </p>
          <Pie
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryData,
                  backgroundColor: [
                    "#f97316",
                    "#fdba74",
                    "#fb923c",
                    "#ea580c",
                    "#fdba74",
                    "#c2410c",
                  ],
                  borderWidth: 2,
                  borderColor: "#fff",
                },
              ],
            }}
          />
        </article>

        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-slate-700">
            Recent Reservations
          </p>
          <div className="mt-3 space-y-2">
            {summary.recentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between rounded-xl bg-orange-50/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {reservation.product_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {reservation.seller_name}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-700">
                  {currency(reservation.final_total)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </AnimatedPage>
  );
}
