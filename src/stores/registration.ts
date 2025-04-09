import { defineStore } from "pinia";
import { axiosApiClient } from "../api/Service";
import { API_ENDPOINTS } from "../api/EndPoint";
import {
  Lifestyle,
  CommonDiseases,
  TimeRangesForNotification,
} from "../enums/healthEnums";

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: string;
  calories_intake: number;
  height: number;
  weight: number;
  age: number;
  lifestyle?: Lifestyle;
  existing_diseases?: CommonDiseases;
  notification_time: TimeRangesForNotification;
  water_intake: number;
  device_token: string;
}

interface RegistrationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegistrationStore = defineStore("registration", {
  state: (): RegistrationState => ({
    loading: false,
    error: null,
    success: false,
  }),

  actions: {
    async register(formData: RegistrationForm) {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        const response = await axiosApiClient.post(
          API_ENDPOINTS.REGISTRATION,
          formData
        );
        this.success = true;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    resetState() {
      this.loading = false;
      this.error = null;
      this.success = false;
    },
  },

  getters: {
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isSuccess: (state) => state.success,
  },
});
