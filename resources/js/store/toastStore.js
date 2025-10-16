import { create } from "zustand";

export const toastStore = create((set) => ({
    message: "",
    type: "",
    show: false,

    setToast: (message, type = "success") =>
        set({ message, type, show: true }),

    hideToast: () => set({ message: "", type: "", show: false })
}))