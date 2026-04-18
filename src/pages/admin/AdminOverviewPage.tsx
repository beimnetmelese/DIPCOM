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
import { Boxes, DollarSign, Users } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  Tooltip,
  Legend,
);

export function AdminOverviewPage() {
  const { categories, products, sellers, reservations } = useAppContext();

  const totalStockValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0,
  );
  const salesTrend = [14200, 15600, 13900, 18900, 20100, 22600];

  const categoryLabels = categories.length
    ? categories.map((category) => category.name)
    : ["No categories yet"];
  const categoryData = categories.length
    ? categories.map((category) =>
        products
          .filter((product) => product.categoryId === category.id)
          .reduce((sum, product) => sum + product.stock, 0),
      )
    : [0];

  const brandCounts = [
    ...new Set(products.map((product) => product.brand)),
  ].slice(0, 6);
  const brandStocks = brandCounts.map((brand) =>
    products
      .filter((product) => product.brand === brand)
      .reduce((sum, product) => sum + product.stock, 0),
  );

  return (
    <AnimatedPage>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Products"
          value={String(products.length)}
          note="Inventory SKUs tracked"
          icon={<Boxes className="h-5 w-5" />}
        />
        <StatCard
          title="Stock Value"
          value={currency(totalStockValue)}
          note="Real-time inventory valuation"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Total Sellers"
          value={String(sellers.length)}
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
            {reservations.slice(0, 6).map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between rounded-xl bg-orange-50/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {reservation.productName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {reservation.sellerName}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-700">
                  {currency(reservation.finalTotal)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </AnimatedPage>
  );
}
