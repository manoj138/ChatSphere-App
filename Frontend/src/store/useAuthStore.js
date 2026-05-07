import { create } from "zustand";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data.data });
            get().connectSocket();
        } catch (error) {
            if (error.response?.status !== 401) {
                console.log("Error in checkAuth:", error);
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data, navigate) => {
        set({ isSigningUp: true });
        try {
            await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully. Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Server connection failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Server connection failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ authUser: null }); 
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Logout API error:", error);
        } finally {
            window.location.replace("/login");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updateProfile:", error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(BASE_URL, {
            auth: { userId: authUser._id }
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        newSocket.connect();
        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    }
}));
