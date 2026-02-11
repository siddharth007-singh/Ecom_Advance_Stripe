// import { API_ROUTES } from "@/utils/api";
// import axios from "axios";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";



// type Product = {
//     id: string;
//     name: string;
//     brand: string;
//     category: string;
//     description: string;
//     gender: string;
//     sizes: string[];
//     colors: string[];
//     price: number;
//     stock: number;
//     rating?: number;
//     soldCount: number;
//     images: string[];
// }

// type ProductStore = {
//     products: Product[];
//     isLoading: boolean;
//     error: string | null;

//     currentPage:number;
//     totalPages:number;
//     totalProducts:number;

//     fetchAllProductsForAdmin: () => Promise<void>;
//     createProduct: (productData: FormData) => Promise<string | null>;
//     updateProduct: (id: string, productData: FormData) => Promise<string | null>;
//     deleteProduct: (id: string) => Promise<string | null>;
//     getProductById: (id: string) => Promise<Product | null>;
//     fetchProductFromFilters:(params:{
//         page?:number;
//         limit?:number;
//         categories?:string[];
//         sizes?:string[];
//         brands?:string[];
//         colors?:string[];
//         minPrice?:number;
//         maxPrice?:number;
//         sortBy?:string;
//         sortOrder?:"asc" | "desc";
//     })=>Promise<void>;
//     setCurrentPage:(page:number)=>void;

// }

// export const useProductStore = create<ProductStore>()(
//     persist((set, get) => ({
//         products: [],
//         isLoading: false,
//         error: null,
//         currentPage:1,
//         totalPages:1,
//         totalProducts:0,

//         fetchAllProductsForAdmin: async () => {
//             set({ isLoading: true, error: null });
//             try {
//                 const res = await axios.get(`${API_ROUTES.PRODUCTS}/fetch-admin-products`, { withCredentials: true });
//                 console.log("API raw response:", res.data); // 👈 log kar
//                 set({ products: res.data.products || [], isLoading: false });
//                 return;
//             } catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
                
//             }
//         },

//         createProduct: async (productData: FormData) => {
//             set({ isLoading: true, error: null });
//             try {
//                 const res = await axios.post(`${API_ROUTES.PRODUCTS}/create-new-product`, productData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
//                 set({ isLoading: false });
//             } catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
//             }
//         },

//         updateProduct: async (id: string, productData: FormData) => {
//             set({ isLoading: true, error: null });
//             try {
//                 const res = await axios.put(`${API_ROUTES.PRODUCTS}/${id}`, productData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
//                 set({ isLoading: false });
//             } catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
//             }
//         },

//         deleteProduct: async (id: string) => {
//             set({ isLoading: true, error: null });
//             try {
//                 const res = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, { withCredentials: true });
//                 set({ isLoading: false });
//             } catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
//             }
//         },

//         getProductById: async (id: string) => {
//             set({ isLoading: true, error: null });
//             try {
//                 const res = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, { withCredentials: true });
//                 set({ isLoading: false });
//                 return res.data.product;
//             }
//             catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
//             }
//         },

//         fetchProductFromFilters:async(params:any)=>{
//             set({ isLoading: true, error: null });
//             try {
//                 const queryParams = {
//                     ...params,
//                     categories: params.categories?.join(","),
//                     sizes: params.sizes?.join(","),
//                     brands: params.brands?.join(","),
//                     colors: params.colors?.join(","),
//                 }

//                 const res = await axios.get(`${API_ROUTES.PRODUCTS}/fetch-client-products`, {
//                     params: queryParams,
//                     withCredentials: true,
//                 })
//                 set({
//                     products: res.data.products || [],
//                     currentPage:res.data.currentPage || 1,
//                     totalPages:res.data.totalPages || 1,
//                     totalProducts:res.data.totalProducts || 0,
//                     isLoading: false
//                 });
//             } catch (error) {
//                 set({ error: (error as Error).message, isLoading: false });
//             }
//         },

//         setCurrentPage:(page:number)=>{
//             set({currentPage:page});
//         }

//     })
//     )
// )

import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  rating?: number;
  soldCount: number;
  images: string[];
};

type ProductStore = {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalProducts: number;

  fetchAllProductsForAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<string | null>;
  updateProduct: (id: string, productData: FormData) => Promise<string | null>;
  deleteProduct: (id: string) => Promise<string | null>;
  getProductById: (id: string) => Promise<Product | null>;
  fetchProductFromFilters: (params: {
    page?: number;
    limit?: number;
    categories?: string[];
    sizes?: string[];
    brands?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
  setCurrentPage: (page: number) => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,

      fetchAllProductsForAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.get(
            `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
            { withCredentials: true }
          );
          set({ products: res.data.products || [], isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createProduct: async (productData: FormData) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(
            `${API_ROUTES.PRODUCTS}/create-new-product`,
            productData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          set({ isLoading: false });
          return "success";
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return null;
        }
      },

      updateProduct: async (id: string, productData: FormData) => {
        set({ isLoading: true, error: null });
        try {
          await axios.put(`${API_ROUTES.PRODUCTS}/${id}`, productData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
          set({ isLoading: false });
          return "success";
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return null;
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
            withCredentials: true,
          });
          set({ isLoading: false });
          return "success";
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return null;
        }
      },

      getProductById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
            withCredentials: true,
          });
          set({ isLoading: false });
          return res.data.product;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return null;
        }
      },

      fetchProductFromFilters: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const queryParams = {
            ...params,
            categories: params.categories?.join(","),
            sizes: params.sizes?.join(","),
            brands: params.brands?.join(","),
            colors: params.colors?.join(","),
          };

          const res = await axios.get(
            `${API_ROUTES.PRODUCTS}/fetch-client-products`,
            {
              params: queryParams,
              withCredentials: true,
            }
          );

          set({
            products: res.data.products || [],
            currentPage: res.data.currentPage || 1,
            totalPages: res.data.totalPages || 1,
            totalProducts: res.data.totalProducts || 0,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },
    }),
    {
      name: "product-store", // 👈 REQUIRED second argument
    }
  )
);
