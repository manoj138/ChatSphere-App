import { createContext, useContext, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUserInternal] = useState(null);
  const [selectedGroup, setSelectedGroupInternal] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState({});

  const { socket, authUser } = useAuth();
  const { soundEnabled } = useTheme();

  const appendMessageIfMissing = useCallback((message) => {
    if (!message?._id) return;
    setMessages((prev) => {
      const alreadyExists = prev.some((item) => item._id === message._id);
      if (alreadyExists) return prev;
      return [...prev, message];
    });
  }, []);

  const getUsers = useCallback(async (silent = false) => {
    if (!silent) setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/messages/users-sidebar");
      setUsers(res.data.data);
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      if (!silent) setIsUsersLoading(false);
    }
  }, []);

  const getGroups = useCallback(async (silent = false) => {
    if (!silent) setIsGroupsLoading(true);
    try {
      const res = await axiosInstance.get("/groups/my-groups");
      setGroups(res.data.data);
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || "Error fetching groups");
    } finally {
      if (!silent) setIsGroupsLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      const newGroup = res.data.data;
      setGroups((prev) => [...prev, newGroup]);
      toast.success("Group established successfully");
      return newGroup;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating group");
    }
  }, []);

  const getMessages = useCallback(async (userId) => {
    setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      setMessages(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const getGroupMessages = useCallback(async (groupId) => {
    setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      setMessages(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching group messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const markMessagesAsSeen = useCallback(async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch {
      console.log("Error marking messages as seen");
    }
  }, []);

  const sendMessage = useCallback(async (messageData, targetId = null) => {
    try {
      const finalTargetId = targetId || (selectedGroup ? selectedGroup._id : selectedUser?._id);
      if(!finalTargetId) return;

      const endpoint = (selectedGroup && !targetId)
        ? `/messages/send/${selectedGroup._id}` 
        : `/messages/send/${finalTargetId}`;
      
      const payload = selectedGroup 
        ? { ...messageData, groupId: selectedGroup._id }
        : messageData;

      const res = await axiosInstance.post(endpoint, payload);
      const newMessage = res.data.data;
      appendMessageIfMissing(newMessage);
      
      if (soundEnabled) {
        const sendAudio = new Audio("/send-tone.mp3");
        sendAudio.volume = 0.5;
        sendAudio.play().catch(e => console.log("Send sound blocked:", e));
      }

      getUsers(true); 
      if (selectedGroup) getGroups(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
      throw error;
    }
  }, [selectedUser, selectedGroup, soundEnabled, appendMessageIfMissing, getUsers, getGroups]);

  const sendTypingStatus = useCallback((isTyping) => {
    if (!socket || !selectedUser || !authUser) return;
    if (isTyping) {
        socket.emit("typing", { receiverId: selectedUser._id, senderId: authUser._id, typing: true });
    } else {
        socket.emit("stopTyping", { receiverId: selectedUser._id, senderId: authUser._id });
    }
  }, [socket, selectedUser, authUser]);

  const deleteMessage = useCallback(async (messageId, type = "everyone") => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`, { data: { type } });
      
      if (type === "me") {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      } else {
        setMessages((prev) => prev.map((m) =>
          m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", image: null } : m
        ));
      }
      toast.success(`Message removed for ${type === "me" ? "you" : "everyone"}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting message");
    }
  }, []);

  const reactToMessage = useCallback(async (messageId, emoji) => {
    try {
      const res = await axiosInstance.put(`/messages/react/${messageId}`, { emoji });
      setMessages((prev) => prev.map((m) =>
        m._id === messageId ? { ...m, reactions: res.data.data.reactions } : m
      ));
    } catch {
      console.log("Error reacting to message");
    }
  }, []);

  const subscribeToEvents = useCallback(() => {
    if (!socket) return;

    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
    socket.off("usertyping");
    socket.off("userStopTyping");
    socket.off("messagesSeen");
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");

    socket.on("newMessage", (newMessage) => {
        const isMessageFromSelectedUser = newMessage.senderId === selectedUser?._id;
        if (isMessageFromSelectedUser) {
            appendMessageIfMissing(newMessage);
            markMessagesAsSeen(newMessage.senderId);
        }
        getUsers(true);
        
        if (newMessage.senderId !== authUser?._id) {
            if (soundEnabled) {
                const audio = new Audio("/recieve-tone.mp3");
                audio.play().catch(() => console.log("Receive sound failed"));
            }
        }
    });

    socket.on("newFriendRequest", () => {
        // Friend requests handled by FriendContext if available
        if (soundEnabled) {
            const audio = new Audio("/recieve-tone.mp3");
            audio.play().catch(() => console.log("Sound blocked"));
        }
    });

    socket.on("friendRequestAccepted", () => {
        getUsers(true);
        toast.success("A friend request was accepted!");
    });

    socket.on("newGroupMessage", (newMessage) => {
        const isMessageForSelectedGroup = newMessage.groupId === selectedGroup?._id;
        if (isMessageForSelectedGroup) {
            appendMessageIfMissing(newMessage);
        }
        getGroups(true);

        const isMyMessage = newMessage.senderId?._id === authUser?._id || newMessage.senderId === authUser?._id;
        if (!isMyMessage) {
            if (soundEnabled) {
                const audio = new Audio("/recieve-tone.mp3");
                audio.play().catch(() => console.log("Receive sound failed"));
            }
        }
    });

    socket.on("messageDeleted", ({ messageId }) => {
        setMessages((prev) => prev.map((m) =>
            m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", image: null } : m
        ));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
        setMessages((prev) => prev.map((m) =>
            m._id === messageId ? { ...m, reactions } : m
        ));
    });

    socket.on("usertyping", ({ senderId, typing }) => {
        setTypingStatus((prev) => ({ ...prev, [senderId]: typing }));
    });

    socket.on("userStopTyping", ({ senderId }) => {
        setTypingStatus((prev) => ({ ...prev, [senderId]: false }));
    });

    socket.on("messagesSeen", ({ senderId }) => {
        if (selectedUser?._id === senderId) {
            setMessages((prev) => prev.map(m => ({ ...m, isSeen: true })));
        }
    });
  }, [socket, selectedUser, selectedGroup, authUser, soundEnabled, appendMessageIfMissing, getUsers, getGroups, markMessagesAsSeen]);

  const unsubscribeFromEvents = useCallback(() => {
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
    socket.off("usertyping");
    socket.off("userStopTyping");
    socket.off("messagesSeen");
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
  }, [socket]);

  const setSelectedUser = useCallback((user) => {
    if (user) {
      setSelectedUserInternal(user);
      setSelectedGroupInternal(null);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, unreadCount: 0 } : u)));
      markMessagesAsSeen(user._id);
    } else {
      setSelectedUserInternal(null);
      setSelectedGroupInternal(null);
    }
  }, [markMessagesAsSeen]);

  const setSelectedGroup = useCallback((group) => {
    if (group) {
      setSelectedGroupInternal(group);
      setSelectedUserInternal(null);
      setGroups((prev) => prev.map((g) => (g._id === group._id ? { ...g, unreadCount: 0 } : g)));
      if (socket) socket.emit("joinGroup", group._id);
    } else {
      setSelectedUserInternal(null);
      setSelectedGroupInternal(null);
    }
  }, [socket]);

  const updateGroup = useCallback(async (groupId, groupData) => {
    try {
      const res = await axiosInstance.put(`/groups/update/${groupId}`, groupData);
      const updatedGroup = res.data.data;
      setGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, ...updatedGroup } : g)));
      setSelectedGroupInternal((prev) => prev?._id === groupId ? { ...prev, ...updatedGroup } : prev);
      toast.success("Group settings updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating group");
    }
  }, []);

  const deleteGroup = useCallback(async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/delete/${groupId}`);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      if (selectedGroup?._id === groupId) {
        setSelectedGroupInternal(null);
      }
      toast.success("Group terminated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting group");
    }
  }, [selectedGroup]);

  const kickMember = useCallback(async (groupId, userId) => {
    try {
      const res = await axiosInstance.put(`/groups/kick/${groupId}`, { userId });
      const updatedGroup = res.data.data;
      setGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, ...updatedGroup } : g)));
      setSelectedGroupInternal((prev) => prev?._id === groupId ? { ...prev, ...updatedGroup } : prev);
      toast.success("Node removed from cell");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error kicking member");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        groups,
        selectedUser,
        selectedGroup,
        isUsersLoading,
        isMessagesLoading,
        isGroupsLoading,
        typingStatus,
        getUsers,
        getGroups,
        createGroup,
        getMessages,
        getGroupMessages,
        sendMessage,
        sendTypingStatus,
        deleteMessage,
        reactToMessage,
        subscribeToEvents,
        unsubscribeFromEvents,
        setSelectedUser,
        setSelectedGroup,
        updateGroup,
        deleteGroup,
        kickMember,
        markMessagesAsSeen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
