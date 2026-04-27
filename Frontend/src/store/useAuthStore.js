import { create } from "zustand";
import API from "../services/Api";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
 authUser:null,
 isCheckingAuth:true,
isSigningUp:false,
isLoggingIn:false,

 checkAuth: async ()=>{
    try {
        const res = await API.get("/auth/check");
        set({authUser: res.data})
    } catch (error) {
        console.log("Error checking authentication:",error);
        set({authUser: null})
    } finally {
        set({isCheckingAuth: false})
    }
 },

 signup : async (data)=>{
    set({isSigningUp:true})
    try {
        const res = await API.post("/auth/signup", data);
        set({authUser: res.data})

        toast.success("Account created successful")

    } catch (error) {
        toast.error(error.response.data.message)
        console.log("Error signing up:",error);
        set({authUser: null})
    } finally {
        set({isSigningUp: false})
    }
 },

 login: async (data)=>{
    set({isLoggingIn:true})
    try {
        const res = await API.post("/auth/login", data);
        set({authUser: res.data})

        toast.success("Login successfully")

    } catch (error) {
        toast.error(error.response.data.message)
        console.log("Error logging in:",error);
        set({authUser: null})
    } finally {
        set({isLoggingIn: false})
    }
 },

 logout: async () => {
    set({isLoggingIn: true})
    try {
        await API.post("/auth/logout");
        set({authUser: null})
        toast.success("Logout successfully")
    } catch (error) {
        toast.error(error.response.data.message)
        console.log("Error logging out:",error);
     
    }
 }

}))

export default useAuthStore