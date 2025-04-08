import { defineStore } from "pinia";
import { axiosApiClient } from "../api/Service";
import { API_ENDPOINTS } from "../api/EndPoint";
import { useSnackbarStore } from "./snackbar";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  calories_intake: number;
  water_intake: number;
  notification_time: string;
  lifestyle: string;
  existing_diseases: string;
}

interface ProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
}

export const useProfileStore = defineStore("profile", {
  state: (): ProfileState => ({
    userProfile: null,
    loading: false,
    error: null,
    isEditing: false,
  }),

  actions: {
    async fetchUserProfile() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosApiClient.get(API_ENDPOINTS.PROFILE);
        if (response.data?.data) {
          this.userProfile = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch profile";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData: Partial<UserProfile>) {
      const snackbarStore = useSnackbarStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosApiClient.post(
          API_ENDPOINTS.UPDATE_PROFILE,
          profileData
        );

        if (response.data?.statusCode === 202) {
          this.userProfile = {
            ...this.userProfile,
            ...profileData,
          } as UserProfile;
          this.isEditing = false;
          snackbarStore.showMessage(response.data.message, "success");
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message;
        snackbarStore.showMessage(this.error, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },
  },
});
