// store/registerStore.ts
import { create } from "zustand";

interface RegisterState {
  basicInfo: {
    name: string;
    email: string;
    password: string;
    role: string;
  } | null;
  engineerDetails: {
    skills: string[];
    // ...other fields
  } | null;
  setBasicInfo: (info: RegisterState["basicInfo"]) => void;
  setEngineerDetails: (details: RegisterState["engineerDetails"]) => void;
  clear: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  basicInfo: null,
  engineerDetails: null,
  setBasicInfo: (info) => set({ basicInfo: info }),
  setEngineerDetails: (details) => set({ engineerDetails: details }),
  clear: () => set({ basicInfo: null, engineerDetails: null }),
}));
