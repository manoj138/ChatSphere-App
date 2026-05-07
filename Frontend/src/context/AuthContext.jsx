import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const disconnectSocket = useCallback(() => {
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    }
  }, [socket]);

  const connectSocket = useCallback((user) => {
    if (!user || (socket && socket.connected)) return;

    const newSocket = io(BASE_URL, {
      auth: { userId: user._id }
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.connect();
    setSocket(newSocket);
  }, [socket]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setAuthUser(res.data.data);
      connectSocket(res.data.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.log("Error in checkAuth:", error);
      }
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [connectSocket]);

  const signup = useCallback(async (data, navigate) => {
    setIsSigningUp(true);
    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
    } finally {
      setIsSigningUp(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setAuthUser(res.data.data);
      toast.success("Logged in successfully");
      connectSocket(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
    } finally {
      setIsLoggingIn(false);
    }
  }, [connectSocket]);

  const logout = useCallback(async () => {
    setAuthUser(null);
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
      disconnectSocket();
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      window.location.replace("/login");
    }
  }, [disconnectSocket]);

  const updateProfile = useCallback(async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setAuthUser(res.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        isCheckingAuth,
        socket,
        onlineUsers,
        signup,
        login,
        logout,
        updateProfile,
        checkAuth,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
