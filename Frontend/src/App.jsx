import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      subscribeToEvents();
    }
    return () => unsubscribeFromEvents();
  }, [authUser, subscribeToEvents, unsubscribeFromEvents]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen bg-[#050505]">
      <Loader className="size-10 animate-spin text-[#bef264]" />
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#bef264] selection:text-black font-sans">
      <main>
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
          },
        }}
      />
    </div>
  );
}

export default App;
