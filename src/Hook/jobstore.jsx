"use client"
import { create } from 'zustand'
export const useJobStore = create((set) => ({
  currentJobid: null,
  mode:null,
  index:null,
  setCurrentJobstatus:(id)=>set({mode:id}),
  setCurrentJobid: (id) =>set({currentJobid: id}),
  setIndex: (index) => set({index: index}),
}))