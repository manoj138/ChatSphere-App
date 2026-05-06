import { useEffect } from "react";
import { Trash2, User, Users } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

const DeleteMessageModal = ({ message, onConfirm, onCancel }) => {
  const { themeColor } = useThemeStore();
  const { authUser } = useAuthStore();
  const isMine = (message?.senderId?._id || message?.senderId) === authUser?._id;

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="app-panel relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-primary shadow-2xl">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-28 w-32 -translate-x-1/2 opacity-10 blur-[80px]"
          style={{ backgroundColor: "#ef4444" }}
        />

        <div className="relative p-6 text-center sm:p-8">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 shadow-inner">
            <Trash2 size={28} />
          </div>

          <h3 className="text-xl font-black tracking-tight text-primary">Delete Message?</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-secondary">
             Select how you want to remove this message.
          </p>

          <div className="mt-8 grid gap-3">
            <button
              onClick={() => onConfirm("me")}
              className="group flex w-full items-center gap-4 rounded-2xl border border-primary bg-surface/50 p-4 text-left transition hover:bg-secondary/10 active:scale-[0.98]"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-primary group-hover:text-black transition-colors">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Delete for me</p>
                <p className="text-[11px] text-gray-500">Only removes from your view</p>
              </div>
            </button>

            {isMine && !message.isDeleted && (
              <button
                onClick={() => onConfirm("everyone")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left transition hover:bg-red-500/10 active:scale-[0.98]"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-500">Delete for everyone</p>
                  <p className="text-[11px] text-red-500/60">Removes for all participants</p>
                </div>
              </button>
            )}

            <button
              onClick={onCancel}
              className="mt-2 w-full rounded-2xl py-3 text-xs font-black uppercase tracking-[0.2em] text-gray-500 transition hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
