import { useEffect } from "react";
import { Trash2, User, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const DeleteMessageModal = ({ message, onConfirm, onCancel }) => {
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
          className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 opacity-20 blur-[100px]"
          style={{ backgroundColor: "#ef4444" }}
        />

        <div className="relative p-6 text-center sm:p-8">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-red-500/10 text-red-500 shadow-inner">
            <Trash2 size={32} />
          </div>

          <h3 className="text-2xl font-black tracking-tight text-primary">Delete?</h3>
          <p className="mt-3 text-[13px] font-medium leading-relaxed text-secondary">
             Select how you want to remove this message.
          </p>

          <div className="mt-8 grid gap-3">
            <button
              onClick={() => onConfirm("me")}
              className="group flex w-full items-center gap-4 rounded-2xl border border-primary bg-surface/50 p-4 text-left transition hover:bg-white hover:shadow-xl active:scale-[0.98]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary group-hover:bg-primary group-hover:text-black transition-all">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary group-hover:text-accent">Delete for me</p>
                <p className="text-[11px] text-gray-500">Only removes from your view</p>
              </div>
            </button>

            {isMine && !message.isDeleted && (
              <button
                onClick={() => onConfirm("everyone")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left transition hover:bg-red-500/10 hover:shadow-xl active:scale-[0.98]"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-500">Delete for everyone</p>
                  <p className="text-[11px] text-red-500/60">Removes for all participants</p>
                </div>
              </button>
            )}

            <button
              onClick={onCancel}
              className="mt-2 w-full rounded-2xl py-3 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 transition hover:text-primary"
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
