import { create } from "zustand";

const useOnlineStore = create((set, get) => ({
  onlineUsers: {},

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [user.id]: user },
    })),

  removeOnlineUser: (userId) =>
    set((state) => {
      const updated = { ...state.onlineUsers };
      delete updated[userId];
      return { onlineUsers: updated };
    }),

  isUserOnline: (userId) => !!get().onlineUsers[userId],
}));

export default useOnlineStore;
