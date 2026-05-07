import { createContext, useContext, useState, useCallback } from "react";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";
import { useChat } from "./ChatContext";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isRequestsLoading, setIsRequestsLoading] = useState(false);

    const { getUsers } = useChat();

    const getAllUsers = useCallback(async () => {
        setIsUsersLoading(true);
        try {
            const res = await axiosInstance.get("/friends/all-users");
            setAllUsers(res.data.data);
        } catch (error) {
            console.log("Error in getAllUsers:", error);
        } finally {
            setIsUsersLoading(false);
        }
    }, []);

    const getFriendRequests = useCallback(async () => {
        setIsRequestsLoading(true);
        try {
            const res = await axiosInstance.get("/friends/pending");
            setFriendRequests(res.data.data);
        } catch (error) {
            console.log("Error in getFriendRequests:", error);
        } finally {
            setIsRequestsLoading(false);
        }
    }, []);

    const sendFriendRequest = useCallback(async (userId) => {
        try {
            await axiosInstance.post("/friends/send", { receiverId: userId });
            toast.success("Request sent successfully");
            getAllUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    }, [getAllUsers]);

    const respondToRequest = useCallback(async (requestId, status) => {
        try {
            await axiosInstance.post("/friends/respond", { requestId, status });
            toast.success(`Request ${status}`);
            
            getFriendRequests();
            getAllUsers();
            
            if (status === "accepted") {
                getUsers(true);
            }
        } catch {
            toast.error("Failed to respond to request");
        }
    }, [getFriendRequests, getAllUsers, getUsers]);

    return (
        <FriendContext.Provider
            value={{
                allUsers,
                friendRequests,
                isUsersLoading,
                isRequestsLoading,
                getAllUsers,
                getFriendRequests,
                sendFriendRequest,
                respondToRequest,
            }}
        >
            {children}
        </FriendContext.Provider>
    );
};

export const useFriend = () => {
    const context = useContext(FriendContext);
    if (!context) {
        throw new Error("useFriend must be used within a FriendProvider");
    }
    return context;
};
