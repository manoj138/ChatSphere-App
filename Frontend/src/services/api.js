import axios from "axios";

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return window.location.hostname === "localhost" 
        ? "http://localhost:3001" 
        : "https://chatsphere-app-wala.onrender.com";
};

export const axiosInstance = axios.create({
    baseURL: `${getBaseUrl()}/api`,
    withCredentials: true, 
});

// Add a request interceptor to add the JWT token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
