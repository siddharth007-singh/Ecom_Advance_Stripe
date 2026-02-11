import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { persist } from "zustand/middleware";


type User = {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'SUPER_ADMIN';
}

type AuthStore = {
    user: User | null;
    isLoading: boolean;
    error: string | null;

    register: (name: string, email: string, password: string) => Promise<Boolean>;
    login: (email: string, password: string) => Promise<Boolean>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<Boolean>;
};

const axiosInstance = axios.create({
    baseURL: API_ROUTES.AUTH,
    withCredentials: true,
});


export const useAuthStore = create<AuthStore>()(
    persist((set, get) => ({
        user: null,
        isLoading: false,
        error: null,

        register: async (name, email, password) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axiosInstance.post('/register', { name, email, password });
                if (res.data.success) {
                    set({ isLoading: false, user: res.data.user });
                    // return res.data.userId;
                    return true
                } else {
                    set({ isLoading: false, error: res.data.error || "Registration failed" });
                    return false;
                }
            } catch (error) {
                set({
                    isLoading: false,
                    error: axios.isAxiosError(error)
                        ? error?.response?.data?.error || "Registration failed"
                        : "Registration failed"
                });
                return false;
            }
        },

        login: async (email, password) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axiosInstance.post('/login', { email, password });
                set({ isLoading: false, user: res.data.user });
                return true;
            } catch (error) {
                set({
                    isLoading: false,
                    error: axios.isAxiosError(error)
                        ? error?.response?.data?.error || "Login failed"
                        : "Login failed"
                });
                return false;
            }
        },

        logout: async () => {
            set({ isLoading: true, error: null });
            try {
                await axiosInstance.post('/logout');
                set({ isLoading: false, user: null });
            } catch (error) {
                set({
                    isLoading: false,
                    error: axios.isAxiosError(error)
                        ? error?.response?.data?.error || "Logout failed"
                        : "Logout failed",
                });
            }
        },

        refreshAccessToken: async () => {
            try {
                const res = await axiosInstance.post('/refresh-token');
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    }), {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }),
    }
    )
)
