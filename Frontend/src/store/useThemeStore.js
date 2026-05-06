import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  themeColor: localStorage.getItem("chat-sphere-theme") || "#bef264",
  isLightMode: localStorage.getItem("chat-sphere-mode") === "light",
  soundEnabled: localStorage.getItem("chat-sphere-sound") !== "false",
  notificationsEnabled: localStorage.getItem("chat-sphere-notifications") !== "false",
  
  setThemeColor: (color) => {
    localStorage.setItem("chat-sphere-theme", color);
    set({ themeColor: color });
    document.documentElement.style.setProperty('--accent-color', color);
  },

  toggleThemeMode: () => {
    const newMode = !get().isLightMode;
    localStorage.setItem("chat-sphere-mode", newMode ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", newMode ? "light" : "dark");
    set({ isLightMode: newMode });
  },

  toggleSound: () => {
    const newVal = !get().soundEnabled;
    localStorage.setItem("chat-sphere-sound", newVal.toString());
    set({ soundEnabled: newVal });
  },

  toggleNotifications: () => {
    const newVal = !get().notificationsEnabled;
    localStorage.setItem("chat-sphere-notifications", newVal.toString());
    set({ notificationsEnabled: newVal });
  },

  initTheme: () => {
    const color = localStorage.getItem("chat-sphere-theme") || "#bef264";
    const isLight = localStorage.getItem("chat-sphere-mode") === "light";
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  }
}));
