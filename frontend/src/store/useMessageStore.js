import { create } from 'zustand';
import instance from '../lib/axios';

export const useMessageStore = create((set, get) => ({
  users: null,
  messages: null,
  isloading: false,
  isSending: false,

  getUsers: async () => {
    try {
      const response = await instance.get("/message/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  getMessages: async (user) => {
    // CHANGE: Add null check for user and user._id
    if (!user || !user._id) return;
    set({ isloading: true });
    try {
      const response = await instance.get(`/message/${user._id}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isloading: false });
    }
  },

  sendMessage: async (message, user) => {
    // CHANGE: Add null check for user and user._id
    if (!user || !user._id) {
      console.error("No user selected for sending message.");
      return;
    }
    set({ isSending: true });
    try {
      const response = await instance.post(`/message/send/${user._id}`, { message });
      const messages = get().messages || [];
      set({ messages: [...messages, response.data] });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      set({ isSending: false });
    }
  },
}));