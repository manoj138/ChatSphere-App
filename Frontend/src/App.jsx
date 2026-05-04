import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const { subscribeToEvents, unsubscribeFromEvents } = useChatStore();
  const { themeColor, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      import("./lib/firebase").then(({ requestForToken, onMessageListener }) => {
        requestForToken();
        onMessageListener().then((payload) => {
          console.log("Foreground message received:", payload);
          toast(
            (t) => (
              <div className="flex flex-col gap-1">
                <span className="font-black text-[10px] uppercase tracking-widest text-accent">
                  {payload.notification.title}
                </span>
                <span className="text-[11px] opacity-70">
                  {payload.notification.body}
                </span>
              </div>
            ),
            { icon: "📡" }
          );
        }).catch(err => console.log('failed: ', err));
      });
      if (socket) subscribeToEvents();
    }
    return () => unsubscribeFromEvents();
  }, [authUser, socket, subscribeToEvents, unsubscribeFromEvents]);

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
