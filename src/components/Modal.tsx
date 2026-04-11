import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center overflow-y-auto bg-slate-900/45 px-3 py-3 sm:items-center sm:px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className="max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-soft sm:max-h-[calc(100vh-4rem)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold text-slate-900">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
