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
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="app-panel relative w-full max-w-sm overflow-hidden rounded-[2rem]">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-28 w-32 -translate-x-1/2 opacity-10 blur-[80px]"
          style={{ backgroundColor: type === "danger" ? "#ef4444" : themeColor }}
        />

        <div className="relative p-6 text-center sm:p-8">
          <div className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-full ${type === "danger" ? "bg-red-500/10 text-red-400" : "text-black"}`} style={type !== "danger" ? { backgroundColor: themeColor } : {}}>
            {isLogout ? <LogOut size={24} /> : <Trash2 size={24} />}
          </div>

          <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-400">{description}</p>

          <div className="mt-6 grid gap-3">
            <button
              onClick={onConfirm}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.16em] transition active:scale-[0.99] ${type === "danger" ? "bg-red-600 text-white hover:bg-red-500" : "text-black hover:brightness-110"}`}
              style={type !== "danger" ? { backgroundColor: themeColor } : {}}
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.05]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
