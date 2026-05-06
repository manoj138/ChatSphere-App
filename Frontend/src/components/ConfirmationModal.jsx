import { useEffect } from "react";
import { LogOut, Trash2 } from "lucide-react";

import { useThemeStore } from "../store/useThemeStore";

const ConfirmationModal = ({ title, description, onConfirm, onCancel, type = "danger" }) => {
  const { themeColor } = useThemeStore();
  const isLogout = title.toLowerCase().includes("logout") || title.toLowerCase().includes("disconnect");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-500"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="app-panel relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
        {/* Abstract Wavy Shapes (Mint Aesthetic) */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-400/10 blur-3xl" />
        
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-32 w-40 -translate-x-1/2 opacity-20 blur-[100px]"
          style={{ backgroundColor: type === "danger" ? "#ef4444" : themeColor }}
        />

        <div className="relative p-6 text-center sm:p-10">
          <div className={`mx-auto mb-6 flex size-20 items-center justify-center rounded-[2rem] shadow-xl ${type === "danger" ? "bg-red-500/10 text-red-500" : "text-white"}`} style={type !== "danger" ? { backgroundColor: themeColor } : {}}>
            {isLogout ? <LogOut size={32} /> : <Trash2 size={32} />}
          </div>

          <h3 className="text-2xl font-black tracking-tight text-primary">{title}</h3>
          <p className="mt-4 text-[13px] font-medium leading-relaxed text-secondary px-2">{description}</p>

          <div className="mt-10 grid gap-3">
            <button
              onClick={onConfirm}
              className={`w-full rounded-2xl px-4 py-4 text-[13px] font-black uppercase tracking-[0.2em] shadow-lg transition active:scale-[0.98] ${type === "danger" ? "bg-red-600 text-white hover:bg-red-500" : "text-black hover:brightness-110"}`}
              style={type !== "danger" ? { backgroundColor: themeColor } : {}}
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="w-full rounded-2xl border border-primary bg-surface/50 px-4 py-4 text-[13px] font-bold text-secondary transition hover:bg-white hover:text-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
