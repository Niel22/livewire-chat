import { create } from "zustand";

export const useChatStore = create((set) => ({
  conversations: [],

  setConversations: (conversations) => set({ conversations }),
}));
