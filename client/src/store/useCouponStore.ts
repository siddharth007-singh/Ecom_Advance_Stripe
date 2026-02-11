import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { persist } from "zustand/middleware";
import { create } from "zustand/react";


export interface Coupon {
    id: string;
    code: string;
    discountPercentage: number;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    usageLimit: number;
    usageCount: number;
}

interface CouponState {
    couponList: Coupon[];
    isLoading: boolean;
    error: string | null;
    fetchCoupons: () => Promise<void>;
    addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Promise<void>;
    deleteCoupon: (id: string) => Promise<boolean>;
}

export const useCouponStore = create<CouponState>()(
    persist((set, get) => ({
        couponList: [],
        isLoading: false,
        error: null,

        fetchCoupons: async () => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.get(`${API_ROUTES.COUPONS}/fetch-all-coupons`, { withCredentials: true });
                set({ couponList: response.data.couponList, isLoading: false });

            } catch (error) {
                set({ error: (error as Error).message, isLoading: false });
                console.error("Error fetching coupons:", error);
            }
        },

        addCoupon: async (coupon) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(`${API_ROUTES.COUPONS}/create-coupons`, coupon, { withCredentials: true });
                set({ couponList: [...get().couponList, res.data.coupon], isLoading: false });

            } catch (error) {
                set({ error: (error as Error).message, isLoading: false });
                console.error("Error adding coupon:", error);
            }
        },

        deleteCoupon: async (id: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.delete(`${API_ROUTES.COUPONS}/${id}`, {
                    withCredentials: true,
                });
                set({ isLoading: false });
                return response.data.success;
            } catch (error) {
                set({ isLoading: false, error: "Failed to fetch coupons" });
                return null;
            }
        }
    }),{
        name:"coupon-store"
    })
)