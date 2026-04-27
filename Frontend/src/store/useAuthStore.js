import { create } from "zustand";

const useAuthStore = create((set) => ({
   authUser:{name:"Manoj",_id:1234, age:25},
   isLoggedIn:false,
   isLoading:false,
  login:()=>{
    console.log("we just login");
    set({isLoggedIn:true, isLoading:true});
  }
}))

export default useAuthStore