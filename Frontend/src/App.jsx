import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
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
         <Loader className="size-12 animate-spin text-[#bef264]" style={{ color: themeColor }} />
         <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: themeColor }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#bef264] selection:text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1rem',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        }}
      />
    </div>
  );
}

export default App;
