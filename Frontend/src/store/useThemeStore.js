import { create } from "zustand";

export const useThemeStore = create((set) => ({
  themeColor: localStorage.getItem("chat-sphere-theme") || "#bef264",
  isLightMode: localStorage.getItem("chat-sphere-mode") === "light",
  
  setThemeColor: (color) => {
    localStorage.setItem("chat-sphere-theme", color);
    set({ themeColor: color });
    document.documentElement.style.setProperty('--accent-color', color);
  },

  toggleThemeMode: () => {
    const newMode = !useThemeStore.getState().isLightMode;
    localStorage.setItem("chat-sphere-mode", newMode ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", newMode ? "light" : "dark");
    set({ isLightMode: newMode });
  },

  initTheme: () => {
    const color = localStorage.getItem("chat-sphere-theme") || "#bef264";
    const isLight = localStorage.getItem("chat-sphere-mode") === "light";
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  }
}));
