import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { subscribeToEvents, unsubscribeFromEvents } = useChatStore();
  const { themeColor } = useThemeStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', themeColor);
    checkAuth();
  }, [checkAuth, themeColor]);

  useEffect(() => {
    if (authUser) {
      subscribeToEvents();
    }
    return () => unsubscribeFromEvents();
  }, [authUser, subscribeToEvents, unsubscribeFromEvents]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen bg-[#050505]">
      <div className="relative">
         <Loader className="size-12 animate-spin" style={{ color: themeColor }} />
         <div className="absolute inset-0 blur-3xl opacity-20" style={{ backgroundColor: themeColor }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] h-screen text-white selection:bg-[#bef264] selection:text-black font-sans overflow-hidden">
      
      <main className="h-full">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '1.2rem',
            padding: '1rem',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          },
        }}
      />
    </div>
  );
}

export default App;
