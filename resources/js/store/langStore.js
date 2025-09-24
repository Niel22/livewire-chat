
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const langStore = create(
  persist(
    (set) => ({
      lang: "pt",
      setLang: (code) => set({ lang: code }),
    }),
    {
      name: "lang-storage",
    }
  )
);
