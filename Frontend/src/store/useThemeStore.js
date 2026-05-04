import { create } from "zustand";

export const useThemeStore = create((set) => ({
  themeColor: localStorage.getItem("chat-sphere-theme") || "#bef264",
  setThemeColor: (color) => {
    localStorage.setItem("chat-sphere-theme", color);
    set({ themeColor: color });
    document.documentElement.style.setProperty('--accent-color', color);
  },
}));
