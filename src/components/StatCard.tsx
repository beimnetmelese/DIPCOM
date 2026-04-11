import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
}

export function StatCard({ title, value, note, icon }: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
        <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
          {icon}
        </div>
      </div>
      <p className="mt-4 font-heading text-3xl font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </motion.article>
  );
}
