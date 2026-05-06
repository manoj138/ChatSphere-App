import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatsphere-app-mbj0.onrender.com/api",
    withCredentials: true, 
});
