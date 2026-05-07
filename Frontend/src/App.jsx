import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { useAuth } from "./context/AuthContext";
import { useChat } from "./context/ChatContext";
import { useTheme } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import LoadingScreen from "./components/LoadingScreen";

function App() {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuth();
  const { subscribeToEvents, unsubscribeFromEvents, selectedUser } = useChat();
  const { themeColor, initTheme } = useTheme();
  const { pathname } = useLocation();
  const isHomeRoute = pathname === "/";

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", themeColor);
  }, [themeColor]);

  useEffect(() => {
    // redundant checkAuth removed

  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      import("./lib/firebase").then(({ requestForToken, onMessageListener }) => {
        requestForToken();
        onMessageListener()
          .then((payload) => {
            console.log("Foreground message received:", payload);
            
            // Extract data from payload (since we send data-only messages)
            const title = payload.data?.title || "New Signal";
            const body = payload.data?.body || "Check your grid for updates.";
            const senderId = payload.data?.senderId;

            // Don't show toast if we are already chatting with this person

            if (senderId && selectedUser?._id === senderId) return;

            toast(
              () => (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent sm:text-[11px]">
                    {title}
                  </span>
                  <span className="text-[11px] opacity-70 normal-case">{body}</span>
                </div>
              ),
              { icon: "🔔" }
            );
          })
          .catch((err) => console.log("failed: ", err));
      });

      if (socket) subscribeToEvents();
    }

    return () => unsubscribeFromEvents();
  }, [authUser, socket, subscribeToEvents, unsubscribeFromEvents, selectedUser]);

  if (isCheckingAuth && !authUser) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-primary font-sans text-primary selection:bg-accent selection:text-black ${isHomeRoute ? "overflow-hidden" : "overflow-y-auto"}`}>
      <main className={isHomeRoute ? "h-[100dvh]" : "min-h-screen"}>
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
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "1.2rem",
            padding: "1rem",
            fontSize: "11px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          },
        }}
      />
    </div>
  );
}

export default App;
