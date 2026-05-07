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
