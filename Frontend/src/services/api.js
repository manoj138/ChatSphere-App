import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL 
        ? `${import.meta.env.VITE_BACKEND_URL}/api` 
        : "https://chatsphere-app-mbj0.onrender.com/api",
    withCredentials: true, 
});
