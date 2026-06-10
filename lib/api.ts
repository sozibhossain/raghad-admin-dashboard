// lib/api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"

/**
 * Create a fresh axios instance for each call/token to avoid leaking Authorization
 * across calls (especially important in SSR or multi-tab scenarios).
 */
const createAxios = (token?: string, extra?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...extra,
  })

  // OPTIONAL: surface backend error messages consistently
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // Keep the original error, but normalize a message for callers if needed
      err.normalizedMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Request failed"
      return Promise.reject(err)
    }
  )

  return instance
}

// -------------------- Auth APIs --------------------
export const authAPI = {
  login: async (email: string, password: string) => {
    const http = createAxios()
    return http.post("/auth/login", { email, password })
  },

  forgotPassword: async (email: string) => {
    const http = createAxios()
    // keeping your original route `/auth/forget`
    return http.post("/auth/forget", { email })
  },

  resetPassword: async (email: string, otp: string, password: string) => {
    const http = createAxios()
    return http.post("/auth/reset-password", { email, otp, password })
  },

  /**
   * Matches your backend controller:
   *  expects { currentPassword, newPassword, confirmPassword }
   *  and Authorization: Bearer <token>
   *
   * If your actual route is /auth/change-password instead of /user/change-password,
   * switch the path below accordingly.
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    token: string
  ) => {
    const http = createAxios(token)
    return http.post("/user/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    })
  },
}

// -------------------- Dashboard APIs --------------------
export const dashboardAPI = {
  getOverview: async (token: string) => {
    const http = createAxios(token)
    return http.get("/user/admin-overview")
  },
}

// -------------------- Category APIs --------------------
export const categoryAPI = {
  getCategories: async (token: string, page = 1, limit = 10) => {
    const http = createAxios(token)
    return http.get("/category", { params: { page, limit } })
  },

  createCategory: async (data: FormData, token: string) => {
    const http = createAxios(token, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return http.post("/category", data)
  },

  updateCategory: async (id: string, data: FormData, token: string) => {
    const http = createAxios(token, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return http.put(`/category/${id}`, data)
  },

  deleteCategory: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.delete(`/category/${id}`)
  },
}

// -------------------- Item Type APIs --------------------
// -------------------- Item Type APIs --------------------
export const itemTypeAPI = {
  getItemTypeByCategory: async (categoryId: string, token: string) => {
    const http = createAxios(token)
    return http.get(`/product/itemTypes/${categoryId}`)
  },

  createItemType: async (body: any, token: string) => {
    const http = createAxios(token)
    return http.post("/product/itemTypes", body)
  },

  updateItemType: async (id: string, body: any, token: string) => {
    const http = createAxios(token)
    return http.put(`/product/itemTypes/${id}`, body)
  },

  deleteItemType: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.delete(`/product/itemTypes/${id}`)
  },
}





// -------------------- Order APIs --------------------
export const orderAPI = {
  getOrders: async (token: string, page = 1, limit = 10) => {
    const http = createAxios(token)
    return http.get("/order", { params: { page, limit } })
  },
}

// -------------------- Revenue APIs --------------------
export const revenueAPI = {
  getRevenueFromSellers: async (token: string, page = 1, limit = 10) => {
    const http = createAxios(token)
    return http.get("/user/revenue-from-sellers", { params: { page, limit } })
  },
}

// -------------------- Seller APIs --------------------
export const sellerAPI = {
  getSellers: async (token: string, page = 1, limit = 10) => {
    const http = createAxios(token)
    return http.get("/user/seller-profiles", { params: { page, limit } })
  },

  getSellerDetails: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.get(`/user/seller-details/${id}`)
  },

  deleteSeller: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.delete(`/user/seller-delete/${id}`)
  },
}

// -------------------- Buyer APIs --------------------
export const buyerAPI = {
  getBuyers: async (token: string, page = 1, limit = 10) => {
    const http = createAxios(token)
    return http.get("/user/buyer-profiles", { params: { page, limit } })
  },

  getBuyerDetails: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.get(`/user/buyer-details/${id}`)
  },

  deleteBuyer: async (id: string, token: string) => {
    const http = createAxios(token)
    return http.delete(`/user/buyer-delete/${id}`)
  },
}
