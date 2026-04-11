import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useAppContext } from "../context/AppContext.tsx";

export function ToastContainer() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(94vw,380px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto rounded-2xl border border-orange-100 bg-white p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {toast.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                ) : toast.type === "warning" ? (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                ) : (
                  <Info className="mt-0.5 h-5 w-5 text-sky-500" />
                )}
                <div>
                  <p className="font-heading text-sm font-semibold text-slate-900">
                    {toast.title}
                  </p>
                  <p className="text-xs text-slate-600">{toast.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
