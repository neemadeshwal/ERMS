import { create } from "zustand";

interface userProfile {
  name: string;
  profileImageUrl: string;
  email: string;
  phoneNumber?: number;
  emailVerified?: boolean;
}
interface AuthStore {
  isAuthenticated: boolean;
  isloadingUserData: boolean;
  accessToken: string;
  userProfile: userProfile;
  addAccessToken: (accessToken: string) => void;
  setLoadingUserData: (loading: boolean) => void;
  setUserProfile: (userData: userProfile) => void;
  setIsAuthenticated: (authStatus: boolean) => void;
  setUserProfileImage: (imgurl: string) => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  isloadingUserData: true,
  isAuthenticated: false,
  accessToken: "",
  userProfile: {
    name: "",
    email: "",
    profileImageUrl: "",
    phoneNumber: 0,
    emailVerified: false,
  },
  addAccessToken: async (accessToken: string) => {
    set({ accessToken: accessToken });
  },
  setLoadingUserData: (loading: boolean) => {
    console.log("setting user data loading status", loading, get().accessToken);
    set({ isloadingUserData: loading });
  },
  setUserProfile: (userData: userProfile) => {
    console.log("saving user data ", userData);
    set({ userProfile: userData });
  },
  setUserProfileImage: (imgurl: string) => {
    set({ userProfile: { ...get().userProfile, profileImageUrl: imgurl } });
  },
  setIsAuthenticated: (authStatus: boolean) => {
    console.log("setting authenticated status", authStatus);
    set({ isAuthenticated: authStatus });
  },
}));

export default useAuthStore;
