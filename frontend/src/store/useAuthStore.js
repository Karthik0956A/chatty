import {create } from 'zustand';
import instance from '../lib/axios';
import { showToast } from '../lib/toast';
import { Socket ,io} from 'socket.io-client';

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth:true,
  isSigningIn: false,
  isLoggingIn:false,
  socket:null,
  onlineUsers:[],

  checkAuth: async()=>{
    try {
      const response = await instance.get("/auth/check");
      set({ authUser: response.data});
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null  });
    }
    finally{
        set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningIn: true });
      const response = await instance.post("/auth/signup", data);
      // If signup is successful, backend returns user object
      if (response.status < 400 && response.data._id) {
        showToast("Signed up successfully", "success");
        set({ authUser: response.data });
        get().connectSocket();
      } else {
        showToast(response.data.message || "Signup failed", "error");
      }
    } catch (error) {
      // Show backend error message if available
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast(error.message, "error");
      }
      set({ authUser: null });
    } finally {
      set({ isSigningIn: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await instance.post("/auth/login", data);
      // If login is successful, backend returns user object
      if (response.status < 400 && response.data._id) {
        showToast("Logged in successfully", "success");
        set({ authUser: response.data });
        get().connectSocket();
      } else {
        showToast(response.data.message || "Login failed", "error");
      }
    } catch (error) {
      // Show backend error message if available
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast(error.message || "Invalid Credentials", "error");
      }
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await instance.post("/auth/logout");
      showToast(response.data.message || "Logged out", "success");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      // Show backend error message if available
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast(error.message, "error");
      }
    }
  },

  connectSocket:(userId)=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io("http://localhost:3000",{
      query:{
        userId:authUser._id,
      }
    });
    socket.connect();
    set({socket:socket});
    
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds});
    });
  },

  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();    
  },

}));
