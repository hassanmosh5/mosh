"use client";

import { create } from "zustand";

/**
 * Client UI state.
 *
 * Deliberately small. Server data lives on the server and arrives through
 * props or `router.refresh()`; this store holds only what the browser owns —
 * the mobile navigation drawer, the save indicator, and transient messages.
 * Keeping server data out of it is what stops the two from disagreeing.
 */

export type ToastTone = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type MoshUiState = {
  navOpen: boolean;
  saving: boolean;
  toasts: Toast[];
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
  setSaving: (saving: boolean) => void;
  toast: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
};

let nextToastId = 1;

export const useMoshUi = create<MoshUiState>((set) => ({
  navOpen: false,
  saving: false,
  toasts: [],
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
  toggleNav: () => set((state) => ({ navOpen: !state.navOpen })),
  setSaving: (saving) => set({ saving }),
  toast: (message, tone = "success") => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    // Toasts are transient by design; the dismiss button exists for anyone who
    // needs longer than the timer allows.
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 4500);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
