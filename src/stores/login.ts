import { defineStore } from "pinia";
import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../api/EndPoint";

interface LoginResponse {
  statusCode: number;
  message: string;
  data?: {
    token: string;
    user: any;
  };
}

export const useLoginStore = defineStore("login", {
  state: () => ({
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post<LoginResponse>(
          `${BASE_URL}${API_ENDPOINTS.LOGIN}`,
          credentials
        );

        if (response.data.statusCode === 200) {
          localStorage.setItem("token", response.data.data?.token || "");
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
