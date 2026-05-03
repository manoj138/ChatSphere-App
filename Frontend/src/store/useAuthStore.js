import { create } from "zustand";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
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
            toast.error(error.response.data.message || "An error occurred");
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
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        // आधी फ्रंटएंडवर युजर क्लियर करा
        set({ authUser: null }); 
        
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Logout API error:", error);
        } finally {
            // शेवटी पेज रिफ्रेश करा
            window.location.replace("/login");
        }
    },
}));
