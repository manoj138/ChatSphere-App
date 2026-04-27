import { create } from "zustand";
import API from "../services/Api";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
 authUser:null,
 isCheckingAuth:true,
isSigningUp:false,

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
 }
}))

export default useAuthStore