import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import { create } from 'zustand'

interface FeatureBanner {
    id: string;
    imageUrl: string;
}

interface FeatureProduct {
    id: string;
    name: string;
    price: string;
    images: string[];
}

interface SettingsState {
    banners: FeatureBanner[];
    featureProducts: FeatureProduct[];
    isLoading: boolean;
    error: string | null;

    fetchBanners: () => Promise<void>;
    fetchFeatureProducts: () => Promise<void>;
    addBanners: (files: File[]) => Promise<boolean>;
    updateFeatureProducts: (productId: string[]) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    banners: [],
    featureProducts: [],
    isLoading: false,
    error: null,


    fetchBanners: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_ROUTES.SETTINGS}/get-banners`, { withCredentials: true });

            const banners: FeatureBanner[] = Array.isArray(res.data?.banners)
                ? res.data.banners.map((b: { id: string; imageUrl: string }) => ({
                    id: b.id,
                    imageUrl: b.imageUrl // ✅ match backend
                }))
                : [];

            set({ banners, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },

    fetchFeatureProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_ROUTES.SETTINGS}/fetch-feature-products`, { withCredentials: true });
            set({ featureProducts: Array.isArray(res.data?.products) ? res.data.products : [], isLoading: false });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },

    addBanners: async (files: File[]) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            const res = await axios.post(`${API_ROUTES.SETTINGS}/banners`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
            set({ isLoading: false });
            return res.data.success;

        } catch (error) {
            set({ error: 'Failed to add banners', isLoading: false });
        } finally {
            set({ isLoading: false });
        }
    },

    updateFeatureProducts: async (productId: string[]) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_ROUTES.SETTINGS}/update-feature-products`, { productId }, { withCredentials: true });
            set({ featureProducts: res.data.featureProducts, isLoading: false });
            return res.data.success;

        } catch (error) {
            set({ error: 'Failed to update feature products', isLoading: false });
        } finally {
            set({ isLoading: false });
        }
    }

}));
