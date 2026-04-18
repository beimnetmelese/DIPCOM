import { FormEvent, useEffect, useMemo, useState } from "react";
import { BadgeCheck, ShieldAlert, ShieldUser, Trash2 } from "lucide-react";
import { AnimatedPage } from "../../components/AnimatedPage.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

const normalizeIntegerInput = (value: string) =>
  value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

export function AdminSettingsPage() {
  const {
    commissionPercent,
    setCommissionPercent,
    adminAccounts,
    registerAdmin,
    deleteAdminAccount,
  } = useAppContext();
  const [valueInput, setValueInput] = useState(String(commissionPercent));
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    roleType: "staff" as "admin" | "staff",
    password: "",
  });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setValueInput(String(commissionPercent));
  }, [commissionPercent]);

  const totalAdmins = adminAccounts.length;
  const adminRoles = useMemo(
    () => [...new Set(adminAccounts.map((admin) => admin.role))],
    [adminAccounts],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(valueInput || 0);
    const clamped = Math.min(50, Math.max(0, parsed));
    await setCommissionPercent(clamped);
  };

  const onAdminSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await registerAdmin(adminForm);
    setAdminForm({ name: "", email: "", roleType: "staff", password: "" });
  };

  return (
    <AnimatedPage>
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-slate-950 shadow-soft">
        <div className="relative px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-orange-900/35" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <BadgeCheck className="h-4 w-4" /> Platform settings
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Control discounts and register new admin accounts.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Keep the platform organized by adjusting discount settings and
              managing the admin team in one place.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Total admins
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {totalAdmins}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Registered platform admins
          </p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin roles
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {adminRoles.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Different admin access levels
          </p>
        </article>
        <article className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Discount
          </p>
          <p className="mt-3 font-heading text-3xl font-bold text-slate-900">
            {commissionPercent}%
          </p>
          <p className="mt-1 text-sm text-slate-500">Current discount rate</p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Platform Settings
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Control reseller discount logic globally.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-slate-700">
              Discount Percentage
              <input
                className="mt-1 w-full rounded-2xl border border-orange-200 px-3 py-3 outline-none"
                type="number"
                min={0}
                max={50}
                value={valueInput}
                onChange={(event) => {
                  const next = normalizeIntegerInput(event.target.value);
                  const capped = Number(next || 0) > 50 ? "50" : next;
                  setValueInput(capped);
                }}
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Save Setting
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              <ShieldUser className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Register Admins
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add new internal team members who can manage the platform.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={onAdminSubmit}>
            <input
              className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
              placeholder="Admin name"
              value={adminForm.name}
              onChange={(event) =>
                setAdminForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
              placeholder="Admin email"
              type="email"
              value={adminForm.email}
              onChange={(event) =>
                setAdminForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <select
              className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
              value={adminForm.roleType}
              onChange={(event) =>
                setAdminForm((prev) => ({
                  ...prev,
                  roleType: event.target.value as "admin" | "staff",
                }))
              }
              required
            >
              <option value="staff">Staff Member</option>
              <option value="admin">Admin</option>
            </select>
            <input
              className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
              placeholder="Password"
              type="password"
              minLength={6}
              value={adminForm.password}
              onChange={(event) =>
                setAdminForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              required
            />
            <button
              type="submit"
              className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Register Admin
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            {adminAccounts.map((admin) => (
              <article
                key={admin.id}
                className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg font-semibold text-slate-900">
                      {admin.name}
                    </p>
                    <p className="text-sm text-slate-500">{admin.email}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm">
                    {admin.role}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Joined {admin.joinedAt}
                </p>

                <div className="mt-4">
                  {pendingDeleteId === admin.id ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                        <ShieldAlert className="h-4 w-4" /> Confirm delete
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Remove {admin.name} from admin accounts?
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteAdminAccount(admin.id);
                            setPendingDeleteId(null);
                          }}
                          className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Yes, delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(admin.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" /> Delete admin
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}
