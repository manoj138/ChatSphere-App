import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColorState] = useState(localStorage.getItem("chat-sphere-theme") || "#bef264");
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem("chat-sphere-mode") === "light");
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem("chat-sphere-sound") !== "false");
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem("chat-sphere-notifications") !== "false");

  const setThemeColor = useCallback((color) => {
    localStorage.setItem("chat-sphere-theme", color);
    setThemeColorState(color);
    document.documentElement.style.setProperty('--accent-color', color);
  }, []);

  const toggleThemeMode = useCallback(() => {
    setIsLightMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("chat-sphere-mode", newMode ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", newMode ? "light" : "dark");
      return newMode;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newVal = !prev;
      localStorage.setItem("chat-sphere-sound", newVal.toString());
      return newVal;
    });
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => {
      const newVal = !prev;
      localStorage.setItem("chat-sphere-notifications", newVal.toString());
      return newVal;
    });
  }, []);

  const initTheme = useCallback(() => {
    const color = localStorage.getItem("chat-sphere-theme") || "#bef264";
    const isLight = localStorage.getItem("chat-sphere-mode") === "light";
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  }, []);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        isLightMode,
        soundEnabled,
        notificationsEnabled,
        setThemeColor,
        toggleThemeMode,
        toggleSound,
        toggleNotifications,
        initTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
