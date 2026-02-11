import { API_ROUTES } from "@/utils/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";


export interface Address{
    id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;   
  phone: string;
  isDefault: boolean;
}

interface AddressStore {
    addresses: Address[];
    isLoading: boolean;
    error: string | null;
    fetchAddresses: () => Promise<void>;
    createAddress: (address: Omit<Address, 'id'>) => Promise<Address | null>;
    updateAddress: (id: string, address: Partial<Address>) =>  Promise<Address | null>;
    deleteAddress: (id: string) => Promise<boolean>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
    addresses: [],
    isLoading: false,
    error: null,

    fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_ROUTES.ADDRESS}/get-address`, { withCredentials: true });
            set({ addresses: res.data.address, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch addresses" });
        }
    },
    createAddress: async (address) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_ROUTES.ADDRESS}/add-address`, address, { withCredentials: true });
            const newAddress = res.data.address;
            set((state)=>({addresses:[...state.addresses,newAddress],isLoading:false}));
            return newAddress;
        }
        catch (error) {
            set({ error: "Failed to create address" });
        }
    },
    updateAddress: async (id, address) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.put(`${API_ROUTES.ADDRESS}/update-address/${id}`, address, { withCredentials: true });
            const updatedAddress = res.data.address;
            set((state) => ({
                addresses: state.addresses.map((addr) => (addr.id === id ? updatedAddress : addr)),
                isLoading: false,
            }));
            return updatedAddress;
        } catch (error) {
            set({ error: "Failed to update address" });
        }
    },
    deleteAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`, { withCredentials: true });
            const success = res.data.success;
            if (success) {
                set((state) => ({
                    addresses: state.addresses.filter((addr) => addr.id !== id),
                    isLoading: false,
                }));
            }
            return success;
        } catch (error) {
            set({ error: "Failed to delete address" });
        }
    },
}));